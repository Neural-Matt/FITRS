import { IncidentPriority } from "@/lib/constants";

type PriorityBadgeProps = {
  priority: IncidentPriority;
  showBanner?: boolean;
  className?: string;
};

const PRIORITY_CONFIG: Record<IncidentPriority, { color: string; bg: string; label: string }> = {
  critical: { color: "text-white", bg: "bg-red-600", label: "CRITICAL" },
  high: { color: "text-white", bg: "bg-red-500", label: "HIGH" },
  medium: { color: "text-white", bg: "bg-amber-500", label: "MEDIUM" },
  low: { color: "text-slate-700", bg: "bg-slate-200", label: "LOW" },
};

export function PriorityBadge({
  priority,
  showBanner = false,
  className = "",
}: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];

  if (showBanner && priority === "critical") {
    return (
      <div className={`animate-pulse rounded-lg ${config.bg} px-3 py-2 text-center ${className}`}>
        <p className="text-xs font-bold uppercase tracking-widest text-white">
          🚨 Priority Incident
        </p>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${config.bg} ${config.color} px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${className}`}
    >
      {priority === "critical" && <span>🔴</span>}
      {config.label}
    </span>
  );
}
