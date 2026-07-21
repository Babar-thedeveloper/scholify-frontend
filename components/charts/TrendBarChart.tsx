"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_TOOLTIP_STYLE, type BarDatum } from "@/lib/dashboard/chart-data";

interface TrendBarChartProps {
  data: BarDatum[];
  height?: number;
}

export function TrendBarChart({ data, height = 240 }: TrendBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="chart-bar-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.95} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.6} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={28}
          allowDecimals={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: "var(--primary)", opacity: 0.08 }}
          contentStyle={CHART_TOOLTIP_STYLE}
          itemStyle={{ color: "var(--foreground)" }}
          labelStyle={{ color: "var(--muted-foreground)", marginBottom: 2 }}
        />
        <Bar
          dataKey="value"
          radius={[6, 6, 0, 0]}
          maxBarSize={44}
          fill="url(#chart-bar-gradient)"
          isAnimationActive
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
