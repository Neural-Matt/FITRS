"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ROLE_OPTIONS, type AppRole } from "@/lib/constants";

type RoleContextValue = {
  role: AppRole;
  setRole: (role: AppRole) => void;
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<AppRole>("firefighter");

  useEffect(() => {
    const saved = window.localStorage.getItem("fitrs-role") as AppRole | null;
    if (saved && ROLE_OPTIONS.includes(saved)) {
      setRoleState(saved);
    }
  }, []);

  const setRole = (nextRole: AppRole) => {
    setRoleState(nextRole);
    window.localStorage.setItem("fitrs-role", nextRole);
  };

  const value = useMemo(() => ({ role, setRole }), [role]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);

  if (!context) {
    throw new Error("useRole must be used inside RoleProvider");
  }

  return context;
}
