import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

export default function SummaryCards({ extractedCount, skippedCount }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-border/70 bg-background/95 p-5 shadow-sm dark:bg-card/90">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Extracted</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{extractedCount}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
            <ArrowUpFromLine className="size-5" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-background/95 p-5 shadow-sm dark:bg-card/90">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Skipped</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{skippedCount}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-amber-600 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
            <ArrowDownToLine className="size-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
