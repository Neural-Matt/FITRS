"use client";

import { useRole } from "@/components/role-provider";
import type { AppRole } from "@/lib/constants";

export function RoleNotice({
  allowed,
  action,
}: {
  allowed: AppRole[];
  action: string;
}) {
  const { role } = useRole();

  if (allowed.includes(role)) {
    return null;
  }

  return (
    <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      Simulation notice: the {role} role in the Fire Brigade usually cannot {action}. Switch to{" "}
      {allowed.join(" or ")} to proceed.
    </p>
  );
}
