export type ZoneLevel = "heavy" | "moderate" | "clear";

export type SmartCityZone = {
  id: string;
  name: string;
  level: ZoneLevel;
  color: string;
  polygon: Array<[number, number]>;
};

export type RiskCategory = "market" | "industrial" | "high_density_housing";

export type RiskZone = {
  id: string;
  name: string;
  category: RiskCategory;
  color: string;
  polygon: Array<[number, number]>;
};

export const TRAFFIC_ZONES: SmartCityZone[] = [
  {
    id: "traffic-cbd-core",
    name: "CBD Core Flow",
    level: "heavy",
    color: "#dc2626",
    polygon: [
      [-15.412, 28.275],
      [-15.412, 28.292],
      [-15.425, 28.292],
      [-15.425, 28.275],
    ],
  },
  {
    id: "traffic-matero-corridor",
    name: "Matero Corridor",
    level: "moderate",
    color: "#facc15",
    polygon: [
      [-15.381, 28.245],
      [-15.381, 28.267],
      [-15.397, 28.267],
      [-15.397, 28.245],
    ],
  },
  {
    id: "traffic-chilenje-ring",
    name: "Chilenje Ring",
    level: "clear",
    color: "#22c55e",
    polygon: [
      [-15.445, 28.321],
      [-15.445, 28.347],
      [-15.466, 28.347],
      [-15.466, 28.321],
    ],
  },
];

export const RISK_ZONES: RiskZone[] = [
  {
    id: "risk-soweto-market",
    name: "Soweto Market",
    category: "market",
    color: "#f97316",
    polygon: [
      [-15.417, 28.281],
      [-15.417, 28.289],
      [-15.423, 28.289],
      [-15.423, 28.281],
    ],
  },
  {
    id: "risk-lusaka-light-industrial",
    name: "Lusaka Light Industrial Strip",
    category: "industrial",
    color: "#6366f1",
    polygon: [
      [-15.401, 28.301],
      [-15.401, 28.323],
      [-15.413, 28.323],
      [-15.413, 28.301],
    ],
  },
  {
    id: "risk-matero-high-density",
    name: "Matero High Density",
    category: "high_density_housing",
    color: "#0ea5e9",
    polygon: [
      [-15.383, 28.246],
      [-15.383, 28.263],
      [-15.396, 28.263],
      [-15.396, 28.246],
    ],
  },
];

export function pointInPolygon(latitude: number, longitude: number, polygon: Array<[number, number]>) {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [latI, lngI] = polygon[i];
    const [latJ, lngJ] = polygon[j];

    const intersects =
      lngI > longitude !== lngJ > longitude &&
      latitude < ((latJ - latI) * (longitude - lngI)) / (lngJ - lngI) + latI;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

export function getDispatchRouteSuggestion(latitude: number, longitude: number) {
  const heavyZone = TRAFFIC_ZONES.find(
    (zone) => zone.level === "heavy" && pointInPolygon(latitude, longitude, zone.polygon),
  );

  if (heavyZone) {
    return {
      title: "Alternate corridor advised",
      message: `Avoid ${heavyZone.name}; route via Great East Road bypass before final approach.`,
    };
  }

  return {
    title: "Primary route clear",
    message: "Proceed via shortest arterial route; no heavy traffic conflict detected.",
  };
}