import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

export function SummaryCards({ totalExtracted, totalSkipped }) {
  const cards = [
    {
      label: 'Total Extracted',
      value: totalExtracted,
      icon: ArrowUpFromLine,
      tone: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      label: 'Total Skipped',
      value: totalSkipped,
      icon: ArrowDownToLine,
      tone: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-2xl border border-border/70 bg-background/95 p-5 shadow-sm"
          >
            <div className={`inline-flex rounded-xl p-2 ${card.bg}`}>
              <Icon className={`size-5 ${card.tone}`} />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
