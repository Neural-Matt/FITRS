type IncidentLike = {
  title: string;
  latitude: number;
  longitude: number;
};

const TITLE_AREA_MATCHERS: Array<{ area: string; terms: string[] }> = [
  { area: "Lusaka CBD", terms: ["lusaka cbd", "cbd", "soweto market"] },
  { area: "Kalingalinga", terms: ["kalingalinga"] },
  { area: "Chilenje", terms: ["chilenje"] },
  { area: "Matero", terms: ["matero"] },
  { area: "Ndola", terms: ["ndola"] },
  { area: "Kitwe", terms: ["kitwe"] },
  { area: "Livingstone", terms: ["livingstone"] },
];

function fromCoordinates(latitude: number, longitude: number) {
  if (latitude > -15.5 && latitude < -15.3 && longitude > 28.2 && longitude < 28.36) {
    return "Lusaka";
  }

  if (latitude > -13.05 && latitude < -12.87 && longitude > 28.55 && longitude < 28.75) {
    return "Ndola";
  }

  if (latitude > -12.9 && latitude < -12.7 && longitude > 28.1 && longitude < 28.3) {
    return "Kitwe";
  }

  if (latitude > -17.95 && latitude < -17.75 && longitude > 25.75 && longitude < 25.95) {
    return "Livingstone";
  }

  return "Other Area";
}

export function getIncidentArea(incident: IncidentLike) {
  const normalizedTitle = incident.title.toLowerCase();

  for (const matcher of TITLE_AREA_MATCHERS) {
    if (matcher.terms.some((term) => normalizedTitle.includes(term))) {
      return matcher.area;
    }
  }

  return fromCoordinates(incident.latitude, incident.longitude);
}

export function toDisplayType(type: string) {
  return type.replace(/_/g, " ");
}
