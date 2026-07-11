'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, ListChecks } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SummaryCards } from '@/components/result/SummaryCards';
import { DataTable } from '@/components/result/DataTable';
import useExtractionStore from '@/store/extractionStore';

export default function ResultsPage() {
  const router = useRouter();
  const {
    extractedRecords,
    skippedRecords,
    totalExtracted,
    totalSkipped,
  } = useExtractionStore();
  const [activeTab, setActiveTab] = useState('extracted');

  const recordsToShow = activeTab === 'extracted' ? extractedRecords : skippedRecords;
  const showReasonColumn = activeTab === 'skipped';

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Import complete</p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Extraction results
            </h1>
          </div>
          <Button variant="outline" onClick={() => router.push('/')} className="w-fit">
            <ArrowLeft className="mr-2 size-4" />
            Back to upload
          </Button>
        </div>

        <SummaryCards totalExtracted={totalExtracted} totalSkipped={totalSkipped} />

        <div className="rounded-2xl border border-border/70 bg-background/95 p-3 shadow-sm sm:p-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('extracted')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'extracted'
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <FileText className="size-4" />
              Extracted Records
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('skipped')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'skipped'
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <ListChecks className="size-4" />
              Skipped Records
            </button>
          </div>

          <div className="mt-4">
            <DataTable rows={recordsToShow} showReasonColumn={showReasonColumn} />
          </div>
        </div>
      </div>
    </div>
  );
}
