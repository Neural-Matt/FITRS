"use client";

import { useState, useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

type Point = {
  name: string;
  createdAt: string;
  dispatchMinutes: number;
  resolveMinutes: number;
};

type ResponseTimeAnalyticsProps = {
  averageDispatchMinutes: number;
  averageResolutionMinutes: number;
  points: Point[];
};

type Range = "24h" | "7d" | "30d";

const RANGES: { label: string; value: Range }[] = [
  { label: "Last 24h", value: "24h" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
];

function rangeCutoff(range: Range): Date {
  const now = new Date();
  if (range === "24h") return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (range === "7d") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
        {label}
      </p>
      {payload.map((entry: { name: string; value: number; color: string }) => (
        <p key={entry.name} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: <span className="font-bold">{entry.value} min</span>
        </p>
      ))}
    </div>
  );
}

export function ResponseTimeAnalytics({
  averageDispatchMinutes,
  averageResolutionMinutes,
  points,
}: ResponseTimeAnalyticsProps) {
  const [range, setRange] = useState<Range>("30d");

  const filtered = useMemo(() => {
    const cutoff = rangeCutoff(range);
    const inRange = points.filter((p) => new Date(p.createdAt) >= cutoff);
    // Fall back to the last 8 points if the chosen window has no data yet
    return inRange.length > 0 ? inRange : points.slice(-8);
  }, [points, range]);

  return (
    <section className="overflow-hidden rounded-xl border border-[color:var(--line)] bg-white shadow-[4px_4px_16px_rgba(15,23,42,0.07),-2px_-2px_10px_rgba(255,255,255,0.9)]">
      {/* Card header */}
      <div className="border-b border-[color:var(--line)] px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-[color:var(--text-primary)]">
              Response Time Analytics
            </h3>
            <p className="mt-0.5 text-xs text-[color:var(--text-muted)]">
              Dispatch and resolution speed — minutes per incident
            </p>
          </div>

          {/* Time range toggle */}
          <div className="flex rounded-lg border border-[color:var(--line)] bg-slate-50 p-0.5 text-xs">
            {RANGES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRange(r.value)}
                className={`rounded-md px-3 py-1.5 font-semibold transition-colors ${
                  range === r.value
                    ? "bg-white text-[color:var(--text-primary)] shadow-sm"
                    : "text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI summary strip */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[color:var(--brand)]" />
            <span className="text-xs text-[color:var(--text-muted)]">Avg Dispatch Time</span>
            <span className="text-sm font-bold text-[color:var(--brand)]">
              {averageDispatchMinutes.toFixed(1)} min
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-[color:var(--text-muted)]">Avg Resolution Time</span>
            <span className="text-sm font-bold text-emerald-600">
              {averageResolutionMinutes.toFixed(1)} min
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 py-6 sm:px-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filtered} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.18)" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}m`}
                domain={[0, "auto"]}
                width={36}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              />
              <Line
                type="monotone"
                dataKey="dispatchMinutes"
                stroke="#c1121f"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#c1121f", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                name="Dispatch Time"
              />
              <Line
                type="monotone"
                dataKey="resolveMinutes"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                name="Resolution Time"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

