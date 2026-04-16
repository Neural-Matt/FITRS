"use client";

import { ROLE_OPTIONS } from "@/lib/constants";
import { useRole } from "@/components/role-provider";

export function RoleSwitcher() {
  const { role, setRole } = useRole();

  return (
    <label className="soft-inset flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-[color:var(--text-muted)]">
      Active Role
      <select
        className="rounded-md border border-[color:var(--line)] bg-white px-2 py-1 text-sm text-[color:var(--text-primary)] outline-none"
        onChange={(event) => setRole(event.target.value as (typeof ROLE_OPTIONS)[number])}
        value={role}
      >
        {ROLE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </label>
  );
}
