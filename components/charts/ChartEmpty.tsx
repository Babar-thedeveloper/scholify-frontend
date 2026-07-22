interface ChartEmptyProps {
  height: number;
  message?: string;
}

/** Neutral placeholder shown when a chart has no data yet. */
export function ChartEmpty({ height, message = "No data yet" }: ChartEmptyProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border/70 text-center"
      style={{ height }}
    >
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
      <p className="text-xs text-muted-foreground/70">Data will appear here once available</p>
    </div>
  );
}
