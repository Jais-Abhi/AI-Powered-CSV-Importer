'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowUpFromLine,
  CheckCircle2,
  DatabaseZap,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Workflow,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { parseCsvFile } from '@/lib/csv-parser';
import { validateCsvFile } from '@/lib/csv-validation';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/utils/format-file-size';

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
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const resetState = useCallback(() => {
    setFile(null);
    setPreviewData(null);
    setError('');
    setIsParsing(false);
    setIsPreviewVisible(false);
    setToastMessage('');
    setShowToast(false);
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

  useEffect(() => {
    if (!showToast) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [showToast]);

  const handleUploadClick = () => {
    setToastMessage('Backend integration will be implemented in the next step.');
    setShowToast(true);
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
      showToast={showToast}
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
      className="w-full min-h-screen px-0 py-0"
    >
      <div className="flex flex-col gap-8 px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8 lg:py-8">
        <div className="order-2 flex flex-col gap-5 lg:order-1">
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
    <div className="flex flex-col gap-5">
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-sm text-muted-foreground">
        <FileSpreadsheet className="size-4" />
        AI CSV Importer
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Turn raw CSV files into a polished import preview.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Upload a spreadsheet, inspect the structure, and confirm the data before the next integration step.
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
              className="rounded-none border-0 bg-transparent p-0 shadow-none"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl border border-border/70 bg-background p-2 text-foreground shadow-sm">
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
          'flex min-h-[320px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed px-6 py-8 text-center transition-all duration-200 sm:min-h-[360px] sm:px-8',
          isDragActive
            ? 'border-primary bg-primary/8 shadow-inner'
            : 'border-border/70 bg-muted/30 hover:border-primary/60 hover:bg-accent/40',
        )}
      >
        <input {...getInputProps()} />
        <div className="rounded-2xl border border-border/70 bg-background p-3 shadow-sm">
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

function PreviewView({ file, previewData, onReselect, onUploadClick, showToast, toastMessage }) {
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

        <div className="overflow-hidden border-t border-border/70 bg-transparent">
          <div className="flex flex-col gap-2 border-b border-border/70 px-0 py-3 sm:flex-row sm:items-center sm:justify-between">
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
                        <td key={`${rowIndex}-${header}`} className="max-w-[220px] border-b border-border/60 px-3 py-3 text-foreground">
                          <div className="truncate">{row[header] ?? ''}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {hasMoreRows ? (
            <div className="border-t border-border/70 px-0 py-3 text-sm text-muted-foreground">
              Only the first 50 rows are shown. Scroll horizontally to inspect the full structure.
            </div>
          ) : null}
        </div>

        <div className="sticky bottom-4 z-20 rounded-none border border-border/70 bg-background/95 p-3 shadow-sm backdrop-blur sm:p-4">
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

      <AnimatePresence>
        {showToast ? (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="fixed right-4 top-4 z-50 w-[min(92vw,360px)] rounded-2xl border border-border/70 bg-background/95 p-4 shadow-xl backdrop-blur"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-emerald-500/15 p-2 text-emerald-600">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <p className="font-medium text-foreground">Upload queued</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{toastMessage}</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
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
