import nextDynamic from "next/dynamic";
import { getHydrants, getIncidents, getUnits } from "@/lib/incidents";

export const dynamic = "force-dynamic";

const LeafletMap = nextDynamic(
  () => import("@/components/leaflet-map").then((module) => module.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="panel flex h-[65vh] items-center justify-center">
        <p className="text-sm text-[color:var(--text-muted)]">Loading incident map...</p>
      </div>
    ),
  },
);

export default async function MapPage() {
  const [incidents, units, hydrants] = await Promise.all([getIncidents(), getUnits(), getHydrants()]);

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-2xl font-bold">Map View</h2>
        <p className="text-sm text-[color:var(--text-muted)]">
          Live city map with incidents, agencies, hydrants, smart traffic, and risk overlays.
        </p>
      </div>

      <LeafletMap incidents={incidents} units={units} hydrants={hydrants} />
    </section>
  );
}
