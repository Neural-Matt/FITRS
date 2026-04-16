type StatusBadgeProps = {
  status: string;
  className?: string;
};

function tone(status: string) {
  switch (status) {
    case "reported":
    case "dispatched":
    case "on_scene":
      return "border-red-200 bg-red-50 text-red-700";
    case "enroute":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "resolved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "available":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "busy":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold uppercase tracking-wide ${tone(status)} ${className}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
