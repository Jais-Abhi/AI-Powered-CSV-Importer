'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowUpFromLine,
  DatabaseZap,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Workflow,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Toaster } from '@/components/ui/sonner';
import { parseCsvFile } from '@/lib/csv-parser';
import { validateCsvFile } from '@/lib/csv-validation';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/utils/format-file-size';
import api from '@/config/api';
import useExtractionStore from '@/store/extractionStore';

const featurePoints = [
  {
    icon: Sparkles,
    title: 'Instant overview',
    description: 'Review columns and rows before any import work begins.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe review flow',
    description: 'Validate files locally and preview the structure first.',
  },
  {
    icon: Workflow,
    title: 'Clean handoff',
    description: 'Prepare structured data for the next integration step.',
  },
  {
    icon: DatabaseZap,
    title: 'Built for CSVs',
    description: 'Support for drag-and-drop uploads and responsive tables.',
  },
];

export default function ImportPage() {
  const router = useRouter();
  const setExtractionResult = useExtractionStore((state) => state.setExtractionResult);
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const resetState = useCallback(() => {
    setFile(null);
    setPreviewData(null);
    setError('');
    setIsParsing(false);
    setIsPreviewVisible(false);
    setToastMessage('');
  }, []);

  const handleFileSelection = useCallback(async (selectedFile) => {
    if (!selectedFile) {
      return;
    }

    const validation = validateCsvFile(selectedFile);
    if (!validation.isValid) {
      setError(validation.message);
      setFile(null);
      setPreviewData(null);
      setIsPreviewVisible(false);
      return;
    }

    setError('');
    setFile(selectedFile);
    setIsParsing(true);

    try {
      const parsed = await parseCsvFile(selectedFile);
      setPreviewData(parsed);
      setIsPreviewVisible(true);
    } catch (parseError) {
      setError(parseError.message || 'We could not read that CSV. Please try another file.');
      setPreviewData(null);
      setIsPreviewVisible(false);
    } finally {
      setIsParsing(false);
    }
  }, []);

  const handleDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles?.length) {
        setError('Only .csv files are supported. Please choose a valid CSV file.');
        setFile(null);
        setPreviewData(null);
        setIsPreviewVisible(false);
        return;
      }

      handleFileSelection(acceptedFiles[0]);
    },
    [handleFileSelection],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    multiple: false,
    noClick: true,
    onDrop: handleDrop,
  });

  const handleUploadClick = async () => {
    if (!file) {
      toast.error('Please select a CSV file first.');
      return;
    }

    const csv = new FormData();
    csv.append('csv', file);

    try {
      const response = await api.post('/api/csv/upload', csv);
      const payload = response?.data?.data;

      if (payload) {
        setExtractionResult(payload);
        router.push('/results');
      } else {
        toast.error('The upload completed but no result data was returned.');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Upload failed. Please try again.');
    }
  };

  if (!isPreviewVisible) {
    return (
      <UploadView
        error={error}
        fileName={file?.name}
        getInputProps={getInputProps}
        getRootProps={getRootProps}
        isDragActive={isDragActive}
        isParsing={isParsing}
        onBrowseClick={open}
      />
    );
  }

  return (
    <PreviewView
      file={file}
      previewData={previewData}
      onReselect={resetState}
      onUploadClick={handleUploadClick}
      toastMessage={toastMessage}
    />
  );
}

function UploadView({
  error,
  fileName,
  getInputProps,
  getRootProps,
  isDragActive,
  isParsing,
  onBrowseClick,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full min-h-screen px-0 py-0 "
    >
      <div className="flex flex-col gap-8 px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:px-8 lg:py-8 xl:px-10 xl:py-10">
        <div className="order-2 flex flex-col justify-center gap-6 lg:order-1">
          <ProjectInfo />
        </div>

        <div className="order-1 lg:order-2">
          <UploadDropzone
            error={error}
            fileName={fileName}
            getInputProps={getInputProps}
            getRootProps={getRootProps}
            isDragActive={isDragActive}
            isParsing={isParsing}
            onBrowseClick={onBrowseClick}
          />
        </div>
      </div>
    </motion.div>
  );
}

function ProjectInfo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-background/95 px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm dark:border-border dark:bg-card/90">
        <FileSpreadsheet className="size-4" />
        AI CSV Importer
      </div>

      <div className="space-y-4">
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Preview CSV data before anything is sent anywhere.
        </h1>
        <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          A calm, structured upload experience for reviewing files, checking columns, and preparing your next step with confidence.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {featurePoints.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              whileHover={{ y: -2, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-border/80 bg-background/95 p-4 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] dark:border-border/80 dark:bg-card/90"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl border border-border/80 bg-muted/80 p-2 text-foreground shadow-sm dark:border-border/80 dark:bg-muted/70">
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{feature.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function UploadDropzone({
  error,
  fileName,
  getInputProps,
  getRootProps,
  isDragActive,
  isParsing,
  onBrowseClick,
}) {
  return (
    <div className="flex flex-col gap-4">
      <div
        {...getRootProps({ className: 'group' })}
        className={cn(
          'flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-border/80 bg-background/95 px-6 py-8 text-center shadow-[0_20px_70px_-30px_rgba(15,23,42,0.4)] transition-all duration-200 sm:min-h-[380px] sm:px-8 dark:border-border dark:bg-card/95',
          isDragActive
            ? 'border-primary bg-primary/10 shadow-[0_20px_70px_-28px_rgba(59,130,246,0.45)] dark:border-primary/80 dark:bg-primary/12'
            : 'hover:border-primary/70 hover:bg-muted/80 dark:hover:bg-muted/40',
        )}
      >
        <input {...getInputProps()} />
        <div className="rounded-2xl border border-border/80 bg-muted/80 p-3 shadow-sm dark:border-border/80 dark:bg-muted/70">
          <UploadCloud className="size-8 text-foreground" />
        </div>
        <p className="mt-5 text-lg font-semibold text-foreground">
          {isDragActive ? 'Drop your CSV here' : 'Drag and drop a CSV file'}
        </p>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Browse your device or drop a spreadsheet into the area below to preview the content.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" variant="outline" onClick={onBrowseClick}>
            Browse files
          </Button>
          <span className="text-sm text-muted-foreground">Accepted format: .csv</span>
        </div>

        {fileName ? (
          <p className="mt-4 text-sm font-medium text-foreground">Selected file: {fileName}</p>
        ) : null}

        {isParsing ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Parsing your CSV...
          </div>
        ) : null}
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Invalid file</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}

function PreviewView({ file, previewData, onReselect, onUploadClick, toastMessage }) {
  const visibleRows = previewData.rows.slice(0, 50);
  const hasMoreRows = previewData.totalRows > 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full min-h-screen px-0 py-0"
    >
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Preview ready</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {file.name}
            </h2>
          </div>
          <Button variant="destructive" onClick={onReselect} className="w-fit">
            <RefreshCw className="mr-2 size-4" />
            Reselect File
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <FileInfoCard label="File name" value={file.name} />
          <FileInfoCard label="File size" value={formatFileSize(file.size)} />
          <FileInfoCard label="Rows" value={previewData.totalRows.toLocaleString()} />
          <FileInfoCard label="Columns" value={previewData.totalColumns.toLocaleString()} />
        </div>

        <div className="overflow-hidden rounded-[24px] border border-border/80 bg-background/95 shadow-[0_16px_50px_-28px_rgba(15,23,42,0.4)] dark:border-border dark:bg-card/95">
          <div className="flex flex-col gap-2 border-b border-border/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <p className="text-sm font-semibold text-foreground">CSV Preview</p>
              <p className="text-sm text-muted-foreground">Showing the first 50 rows of your imported file.</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {previewData.totalRows} rows • {previewData.totalColumns} columns
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-background/95 backdrop-blur">
                  <tr>
                    {previewData.headers.map((header) => (
                      <th key={header} className="border-b border-border/70 bg-background/95 px-3 py-3 text-left font-medium text-foreground">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row, rowIndex) => (
                    <tr key={`${rowIndex}-${Object.values(row).join('-')}`} className={rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/40'}>
                      {previewData.headers.map((header) => (
                        <td key={`${rowIndex}-${header}`} className="max-w-[220px] border-b border-border/60 px-3 py-3 align-top text-foreground">
                          <div className="whitespace-normal break-words break-all">{row[header] ?? ''}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {hasMoreRows ? (
            <div className="border-t border-border/70 px-4 py-3 text-sm text-muted-foreground sm:px-5">
              Only the first 50 rows are shown. Scroll horizontally to inspect the full structure.
            </div>
          ) : null}
        </div>

        <div className="sticky bottom-4 z-20 rounded-[20px] border border-border/80 bg-background/95 p-3 shadow-[0_16px_50px_-24px_rgba(15,23,42,0.4)] backdrop-blur dark:border-border dark:bg-card/95 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              This button is only for the next UI step and will connect to the backend later.
            </p>
            <Button type="button" onClick={onUploadClick} className="bg-emerald-600 text-white hover:bg-emerald-500">
              <ArrowUpFromLine className="mr-2 size-4" />
              Upload CSV
            </Button>
          </div>
        </div>
      </div>

      <Toaster />
    </motion.div>
  );
}

function FileInfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/40 px-4 py-3 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 truncate font-medium text-foreground">{value}</p>
    </div>
  );
}
