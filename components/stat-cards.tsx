type StatCard = {
  label: string;
  sublabel: string;
  value: number;
  accent: string;             // top border colour
  valueClass: string;         // number colour
  bg: string;                 // card background tint
  icon: React.ReactNode;
  dominant?: boolean;         // Active card gets extra emphasis
};

function FireIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.6]">
      <path d="M12 2C8 8 6 11 6 14a6 6 0 0 0 12 0c0-3-2-6-6-12z" />
      <path d="M12 22v-4" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.6]">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.6]">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  );
}

export function StatCards({
  stats,
}: {
  stats: { total: number; active: number; resolved: number };
}) {
  const cards: StatCard[] = [
    {
      label: "Total Incidents",
      sublabel: "All time logged",
      value: stats.total,
      accent: "border-t-slate-400",
      valueClass: "text-[color:var(--text-primary)]",
      bg: "bg-white",
      icon: <FireIcon />,
    },
    {
      label: "Active Incidents",
      sublabel: "Requiring response",
      value: stats.active,
      accent: "border-t-[color:var(--brand)]",
      valueClass: "text-[color:var(--brand)]",
      bg: "bg-[#fff8f8]",
      icon: <AlertIcon />,
      dominant: true,
    },
    {
      label: "Resolved",
      sublabel: "Successfully closed",
      value: stats.resolved,
      accent: "border-t-emerald-500",
      valueClass: "text-emerald-600",
      bg: "bg-[#f0fdf4]",
      icon: <CheckIcon />,
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.label}
          className={`relative overflow-hidden rounded-xl border-t-4 ${card.accent} ${card.bg} shadow-[4px_4px_16px_rgba(15,23,42,0.07),-2px_-2px_10px_rgba(255,255,255,0.9)] transition-transform duration-150 hover:-translate-y-0.5 ${
            card.dominant ? "ring-1 ring-red-100" : ""
          }`}
        >
          <div className="px-6 pb-6 pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
                  {card.label}
                </p>
                <p className="mt-0.5 text-[10px] text-[color:var(--text-muted)] opacity-70">
                  {card.sublabel}
                </p>
              </div>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  card.dominant
                    ? "bg-red-100 text-[color:var(--brand)]"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {card.icon}
              </span>
            </div>
            <p
              className={`mt-4 font-bold tabular-nums leading-none tracking-tight ${card.valueClass} ${
                card.dominant ? "text-6xl" : "text-5xl"
              }`}
            >
              {card.value}
            </p>
            {card.dominant && (
              <p className="mt-2 text-xs font-medium text-[color:var(--brand)] opacity-80">
                Requires immediate attention
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
