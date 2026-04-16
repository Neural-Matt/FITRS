import { UnitType } from "@/lib/constants";
import { RISK_ZONES, pointInPolygon } from "@/lib/smart-city";

export type GeoPoint = {
  latitude: number;
  longitude: number;
};

type UnitLike = {
  id: string;
  name: string;
  type: string;
  status: string;
  currentLat: number;
  currentLng: number;
};

type HydrantLike = {
  id: string;
  name: string;
  status: string;
  latitude: number;
  longitude: number;
};

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function getDistanceKm(a: GeoPoint, b: GeoPoint) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(b.latitude - a.latitude);
  const dLng = toRadians(b.longitude - a.longitude);

  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);

  const value = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  const c = 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));

  return earthRadiusKm * c;
}

export function getSuggestedAgencies(incidentType: string): UnitType[] {
  if (incidentType === "industrial_fire") {
    return ["fire", "police", "ambulance"];
  }

  if (incidentType === "house_fire") {
    return ["fire", "ambulance"];
  }

  return ["fire"];
}

export function getNearestWorkingHydrant(incident: GeoPoint, hydrants: HydrantLike[]) {
  const workingHydrants = hydrants.filter((hydrant) => hydrant.status === "working");

  if (workingHydrants.length === 0) {
    return null;
  }

  return workingHydrants
    .map((hydrant) => ({
      hydrant,
      distanceKm: getDistanceKm(incident, hydrant),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];
}

export function getRecommendedUnit(incident: { latitude: number; longitude: number; type: string }, units: UnitLike[]) {
  const available = units.filter((unit) => unit.status === "available");

  if (available.length === 0) {
    return null;
  }

  const preferredTypes = getSuggestedAgencies(incident.type);
  const preferredUnits = available.filter((unit) => preferredTypes.includes(unit.type as UnitType));
  const pool = preferredUnits.length > 0 ? preferredUnits : available;

  return pool
    .map((unit) => ({
      unit,
      distanceKm: getDistanceKm(incident, { latitude: unit.currentLat, longitude: unit.currentLng }),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];
}

function riskBaseByIncidentType(type: string) {
  switch (type) {
    case "industrial_fire":
      return 70;
    case "house_fire":
      return 56;
    case "market_fire":
      return 62;
    case "electrical_fire":
      return 52;
    case "vehicle_fire":
      return 46;
    case "bush_fire":
      return 42;
    default:
      return 40;
  }
}

export function getIncidentRiskAssessment(incident: { type: string; latitude: number; longitude: number }) {
  let score = riskBaseByIncidentType(incident.type);

  RISK_ZONES.forEach((zone) => {
    if (pointInPolygon(incident.latitude, incident.longitude, zone.polygon)) {
      if (zone.category === "industrial") {
        score += 20;
      } else if (zone.category === "market") {
        score += 14;
      } else {
        score += 12;
      }
    }
  });

  const capped = Math.max(0, Math.min(score, 100));
  const level = capped < 45 ? "Low" : capped < 75 ? "Medium" : "High";

  return {
    score: capped,
    level,
  };
}

export function suggestPriorityByType(
  incidentType: string,
): "critical" | "high" | "medium" | "low" {
  if (incidentType === "industrial_fire") return "critical";
  if (incidentType === "house_fire") return "high";
  if (incidentType === "market_fire") return "high";
  if (incidentType === "bush_fire") return "high";
  if (incidentType === "electrical_fire") return "high";
  return "medium";
}