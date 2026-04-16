"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toDisplayType } from "@/lib/zambia";

type HeatPoint = {
  x: number;
  y: number;
  area: string;
  title: string;
  status: string;
};

type TypeDistribution = {
  type: string;
  count: number;
};

type ResponsePoint = {
  name: string;
  dispatchMinutes: number;
  resolveMinutes: number;
};

type TopArea = {
  area: string;
  count: number;
};

type AnalyticsOverviewProps = {
  heatmap: HeatPoint[];
  typeDistribution: TypeDistribution[];
  responseTrend: ResponsePoint[];
  topAreas: TopArea[];
  averageDispatchMinutes: number;
  improving: boolean;
};

export function AnalyticsOverview({
  heatmap,
  typeDistribution,
  responseTrend,
  topAreas,
  averageDispatchMinutes,
  improving,
}: AnalyticsOverviewProps) {
  const topArea = topAreas[0]?.area ?? "Lusaka CBD";

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="panel p-4 sm:p-5">
          <h3 className="mb-1 text-lg font-semibold">Incident Heatmap</h3>
          <p className="mb-4 text-sm text-[color:var(--text-muted)]">
            Geographic concentration of incidents by reported coordinates.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.24)" strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" name="Longitude" stroke="#6b7280" />
                <YAxis type="number" dataKey="y" name="Latitude" stroke="#6b7280" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={heatmap} fill="#c1121f" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel p-4 sm:p-5">
          <h3 className="mb-1 text-lg font-semibold">Incident Type Distribution</h3>
          <p className="mb-4 text-sm text-[color:var(--text-muted)]">
            Breakdown of incident categories across the reporting window.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeDistribution}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.24)" strokeDasharray="3 3" />
                <XAxis dataKey="type" stroke="#6b7280" tickFormatter={toDisplayType} />
                <YAxis stroke="#6b7280" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {typeDistribution.map((entry, index) => (
                    <Cell key={entry.type} fill={index % 2 === 0 ? "#c1121f" : "#f59e0b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="panel p-4 sm:p-5">
          <h3 className="mb-1 text-lg font-semibold">Response Time Trends</h3>
          <p className="mb-4 text-sm text-[color:var(--text-muted)]">
            Dispatch and resolution trajectory for recent incidents.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTrend}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.24)" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="dispatchMinutes" stroke="#c1121f" strokeWidth={2} />
                <Line type="monotone" dataKey="resolveMinutes" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel p-4 sm:p-5">
          <h3 className="mb-1 text-lg font-semibold">Top Incident Areas</h3>
          <p className="mb-4 text-sm text-[color:var(--text-muted)]">
            Highest volume locations requiring sustained operational attention.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topAreas} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.24)" strokeDasharray="3 3" />
                <XAxis type="number" stroke="#6b7280" allowDecimals={false} />
                <YAxis dataKey="area" type="category" width={120} stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="count" fill="#c1121f" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <article className="panel p-5">
        <h3 className="text-lg font-semibold">Summary Insights</h3>
        <ul className="mt-3 space-y-2 text-sm text-[color:var(--text-muted)]">
          <li>Most incidents occur in {topArea}.</li>
          <li>
            Average response time is {improving ? "improving" : "stable"} at {averageDispatchMinutes.toFixed(1)}
            {" "}minutes.
          </li>
        </ul>
      </article>
    </section>
  );
}
