"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type SystemPreferences = {
  autoRefresh: boolean;
  mapClustering: boolean;
  setAutoRefresh: (enabled: boolean) => void;
  setMapClustering: (enabled: boolean) => void;
};

const SystemPreferencesContext = createContext<SystemPreferences | undefined>(undefined);

const AUTO_REFRESH_KEY = "fitrs-auto-refresh";
const MAP_CLUSTERING_KEY = "fitrs-map-clustering";

export function SystemPreferencesProvider({ children }: { children: ReactNode }) {
  const [autoRefresh, setAutoRefreshState] = useState(true);
  const [mapClustering, setMapClusteringState] = useState(false);

  useEffect(() => {
    const savedAutoRefresh = window.localStorage.getItem(AUTO_REFRESH_KEY);
    const savedClustering = window.localStorage.getItem(MAP_CLUSTERING_KEY);

    if (savedAutoRefresh !== null) {
      setAutoRefreshState(savedAutoRefresh === "true");
    }

    if (savedClustering !== null) {
      setMapClusteringState(savedClustering === "true");
    }
  }, []);

  const setAutoRefresh = (enabled: boolean) => {
    setAutoRefreshState(enabled);
    window.localStorage.setItem(AUTO_REFRESH_KEY, String(enabled));
  };

  const setMapClustering = (enabled: boolean) => {
    setMapClusteringState(enabled);
    window.localStorage.setItem(MAP_CLUSTERING_KEY, String(enabled));
  };

  const value = useMemo(
    () => ({ autoRefresh, mapClustering, setAutoRefresh, setMapClustering }),
    [autoRefresh, mapClustering],
  );

  return <SystemPreferencesContext.Provider value={value}>{children}</SystemPreferencesContext.Provider>;
}

export function useSystemPreferences() {
  const context = useContext(SystemPreferencesContext);

  if (!context) {
    throw new Error("useSystemPreferences must be used inside SystemPreferencesProvider");
  }

  return context;
}
