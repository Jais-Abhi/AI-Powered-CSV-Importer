import { cn } from '@/lib/utils';

function Alert({ className, variant = 'default', ...props }) {
  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(
        'relative grid w-full gap-2 rounded-xl border border-border/70 bg-background/95 px-4 py-3 text-sm shadow-sm',
        variant === 'destructive' && 'border-destructive/40 text-destructive dark:border-destructive/50',
        className,
      )}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }) {
  return <h5 className={cn('font-semibold leading-none tracking-tight', className)} {...props} />;
}

function AlertDescription({ className, ...props }) {
  return <div className={cn('text-sm leading-6 text-muted-foreground', className)} {...props} />;
}

export { Alert, AlertDescription, AlertTitle };
