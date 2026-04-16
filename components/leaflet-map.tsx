"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { getDispatchRouteSuggestion, RISK_ZONES, TRAFFIC_ZONES } from "@/lib/smart-city";

type MapIncident = {
  id: string;
  title: string;
  type: string;
  status: string;
  latitude: number;
  longitude: number;
};

type MapUnit = {
  id: string;
  name: string;
  type: string;
  status: string;
  currentLat: number;
  currentLng: number;
};

type MapHydrant = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: string;
};

const FALLBACK_CENTER: [number, number] = [-15.4167, 28.2833];

function markerColor(status: string) {
  if (status === "resolved") {
    return "#22c55e";
  }

  if (status === "enroute") {
    return "#f59e0b";
  }

  return "#ef4444";
}

export function LeafletMap({
  incidents,
  units,
  hydrants,
}: {
  incidents: MapIncident[];
  units: MapUnit[];
  hydrants: MapHydrant[];
}) {
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const [showHydrants, setShowHydrants] = useState(true);
  const [showSmartCity, setShowSmartCity] = useState(false);

  const center = useMemo<[number, number]>(
    () => (incidents[0] ? [incidents[0].latitude, incidents[0].longitude] : FALLBACK_CENTER),
    [incidents],
  );
  const routePreview = useMemo(
    () =>
      incidents[0] ? getDispatchRouteSuggestion(incidents[0].latitude, incidents[0].longitude) : null,
    [incidents],
  );

  useEffect(() => {
    const onToggleLayers = () => {
      setShowHydrants((prev) => !prev);
      setShowSmartCity((prev) => !prev);
    };

    const onCenter = () => {
      if (!navigator.geolocation) {
        return;
      }

      navigator.geolocation.getCurrentPosition((position) => {
        const centerEvent = new CustomEvent("fitrs-map-center-position", {
          detail: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
        window.dispatchEvent(centerEvent);
      });
    };

    window.addEventListener("fitrs-map-toggle-layers", onToggleLayers);
    window.addEventListener("fitrs-map-center-me", onCenter);

    return () => {
      window.removeEventListener("fitrs-map-toggle-layers", onToggleLayers);
      window.removeEventListener("fitrs-map-center-me", onCenter);
    };
  }, []);

  useEffect(() => {
    let map: import("leaflet").Map | null = null;
    let onCenterPosition: ((event: Event) => void) | null = null;

    const initializeMap = async () => {
      if (!mapNodeRef.current) {
        return;
      }

      const L = await import("leaflet");

      map = L.map(mapNodeRef.current).setView(center, 12);

      onCenterPosition = (event: Event) => {
        const custom = event as CustomEvent<{ latitude: number; longitude: number }>;
        map?.setView([custom.detail.latitude, custom.detail.longitude], 13);
      };

      window.addEventListener("fitrs-map-center-position", onCenterPosition);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      incidents.forEach((incident) => {
        const color = markerColor(incident.status);
        const marker = L.circleMarker([incident.latitude, incident.longitude], {
          radius: 8,
          color,
          fillColor: color,
          fillOpacity: 0.75,
        });

        marker
          .bindPopup(
            `<div style="font-size:12px;line-height:1.3">
              <strong>${incident.title}</strong><br />
              Type: ${incident.type}<br />
              Status: ${incident.status}<br />
              Coordinates: ${incident.latitude.toFixed(4)}, ${incident.longitude.toFixed(4)}
            </div>`,
          )
          .addTo(map as import("leaflet").Map);
      });

      const typeColor: Record<string, string> = {
        fire: "#ef4444",
        police: "#2563eb",
        ambulance: "#16a34a",
      };

      units.forEach((unit) => {
        const dotColor = typeColor[unit.type] ?? "#0ea5e9";
        const marker = L.marker([unit.currentLat, unit.currentLng], {
          icon: L.divIcon({
            className: "",
            html: `<div style="width:12px;height:12px;border-radius:9999px;background:${dotColor};border:2px solid #e2e8f0;"></div>`,
          }),
        });

        marker
          .bindPopup(
            `<div style="font-size:12px;line-height:1.3">
              <strong>${unit.name}</strong><br />
              Agency: ${unit.type}<br />
              Station status: ${unit.status}<br />
              Coordinates: ${unit.currentLat.toFixed(4)}, ${unit.currentLng.toFixed(4)}
            </div>`,
          )
          .addTo(map as import("leaflet").Map);
      });

      if (showHydrants) {
        hydrants.forEach((hydrant) => {
          const hydrantColor =
            hydrant.status === "working" ? "#16a34a" : hydrant.status === "low_pressure" ? "#f59e0b" : "#dc2626";

          L.circleMarker([hydrant.latitude, hydrant.longitude], {
            radius: 6,
            color: hydrantColor,
            fillColor: hydrantColor,
            fillOpacity: 0.9,
            weight: 2,
          })
            .bindPopup(
              `<div style="font-size:12px;line-height:1.3">
                <strong>${hydrant.name}</strong><br />
                Hydrant status: ${hydrant.status.replace("_", " ")}
              </div>`,
            )
            .addTo(map as import("leaflet").Map);
        });
      }

      if (showSmartCity) {
        TRAFFIC_ZONES.forEach((zone) => {
          L.polygon(zone.polygon, {
            color: zone.color,
            fillColor: zone.color,
            fillOpacity: 0.2,
            weight: 1,
          })
            .bindPopup(`<strong>${zone.name}</strong><br />Traffic: ${zone.level}`)
            .addTo(map as import("leaflet").Map);
        });

        RISK_ZONES.forEach((zone) => {
          L.polygon(zone.polygon, {
            color: zone.color,
            fillColor: zone.color,
            fillOpacity: 0.12,
            weight: 1,
            dashArray: "4 2",
          })
            .bindPopup(`<strong>${zone.name}</strong><br />Risk: ${zone.category.replace(/_/g, " ")}`)
            .addTo(map as import("leaflet").Map);
        });
      }

    };

    initializeMap();

    return () => {
      if (onCenterPosition) {
        window.removeEventListener("fitrs-map-center-position", onCenterPosition);
      }
      if (map) {
        map.remove();
      }
    };
  }, [center, incidents, units, hydrants, showHydrants, showSmartCity]);

  return (
    <div className="panel relative h-[70vh] w-full overflow-hidden">
      <div className="absolute left-3 top-3 z-[500] flex gap-2">
        <button
          type="button"
          onClick={() => setShowHydrants((prev) => !prev)}
          className="crm-btn-secondary rounded-lg px-3 py-1.5 text-xs font-semibold"
        >
          {showHydrants ? "Hide Hydrants" : "Show Hydrants"}
        </button>
        <button
          type="button"
          onClick={() => setShowSmartCity((prev) => !prev)}
          className="crm-btn-secondary rounded-lg px-3 py-1.5 text-xs font-semibold"
        >
          {showSmartCity ? "Hide Smart City View" : "Smart City View"}
        </button>
      </div>

      <div className="absolute right-3 top-3 z-[500] w-56 rounded-xl border border-[color:var(--line)] bg-white/95 p-3 text-xs shadow-sm">
        <p className="font-semibold text-[color:var(--text-primary)]">Map Legend</p>
        <div className="mt-2 space-y-1 text-[color:var(--text-muted)]">
          <p className="font-medium text-[color:var(--text-primary)]">Hydrants</p>
          <p><span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-600" /> Working</p>
          <p><span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" /> Low pressure</p>
          <p><span className="inline-block h-2.5 w-2.5 rounded-full bg-red-600" /> Faulty</p>
          <p className="pt-1 font-medium text-[color:var(--text-primary)]">Traffic</p>
          <p><span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-600" /> Heavy</p>
          <p><span className="inline-block h-2.5 w-2.5 rounded-sm bg-yellow-400" /> Moderate</p>
          <p><span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-600" /> Clear</p>
          <p className="pt-1 font-medium text-[color:var(--text-primary)]">Risk Zones</p>
          <p><span className="inline-block h-2.5 w-2.5 rounded-sm bg-orange-500" /> Markets</p>
          <p><span className="inline-block h-2.5 w-2.5 rounded-sm bg-indigo-500" /> Industrial</p>
          <p><span className="inline-block h-2.5 w-2.5 rounded-sm bg-sky-500" /> High-density housing</p>
        </div>
      </div>

      {routePreview ? (
        <div className="absolute bottom-3 left-3 z-[500] max-w-xs rounded-xl border border-[color:var(--line)] bg-white/95 p-3 text-xs shadow-sm">
          <p className="font-semibold text-[color:var(--text-primary)]">{routePreview.title}</p>
          <p className="mt-1 text-[color:var(--text-muted)]">{routePreview.message}</p>
        </div>
      ) : null}

      <div ref={mapNodeRef} className="h-full w-full" />
    </div>
  );
}
