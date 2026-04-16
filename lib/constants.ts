export const ROLE_OPTIONS = ["firefighter", "dispatcher", "commander"] as const;

export type AppRole = (typeof ROLE_OPTIONS)[number];

export const INCIDENT_STATUSES = [
  "reported",
  "dispatched",
  "enroute",
  "on_scene",
  "resolved",
] as const;

export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];

export const INCIDENT_PRIORITIES = ["critical", "high", "medium", "low"] as const;

export type IncidentPriority = (typeof INCIDENT_PRIORITIES)[number];

export const INCIDENT_TYPES = [
  "house_fire",
  "market_fire",
  "electrical_fire",
  "bush_fire",
  "vehicle_fire",
  "industrial_fire",
] as const;

export type IncidentType = (typeof INCIDENT_TYPES)[number];

export const UNIT_STATUSES = ["available", "dispatched", "busy"] as const;

export type UnitStatus = (typeof UNIT_STATUSES)[number];

export const UNIT_TYPES = ["fire", "police", "ambulance"] as const;

export type UnitType = (typeof UNIT_TYPES)[number];

export const HYDRANT_STATUSES = ["working", "low_pressure", "faulty"] as const;

export type HydrantStatus = (typeof HYDRANT_STATUSES)[number];
