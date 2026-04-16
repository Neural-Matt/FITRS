export default function DashboardLoading() {
  return (
    <div className="space-y-10">
      {/* Page header skeleton */}
      <div className="space-y-2">
        <div className="skeleton h-9 w-56 rounded-lg" />
        <div className="skeleton h-4 w-44 rounded-lg" />
      </div>

      {/* Live status bar skeleton */}
      <div className="skeleton h-[52px] w-full rounded-xl" />

      {/* Operational Overview skeleton */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="skeleton h-3 w-36 rounded" />
          <div className="h-px flex-1 bg-[color:var(--line)]" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-36 rounded-xl" />
          ))}
        </div>
      </section>

      {/* Analytics skeleton */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="h-px flex-1 bg-[color:var(--line)]" />
        </div>
        <div className="skeleton h-[22rem] w-full rounded-xl" />
      </section>

      {/* Live Activity skeleton */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="h-px flex-1 bg-[color:var(--line)]" />
        </div>
        <div className="overflow-hidden rounded-xl border border-[color:var(--line)] bg-white">
          <div className="border-b border-[color:var(--line)] px-6 py-4">
            <div className="skeleton h-5 w-32 rounded" />
          </div>
          <div className="divide-y divide-[color:var(--line)]">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="skeleton h-4 flex-1 rounded" />
                <div className="skeleton h-4 w-24 rounded" />
                <div className="skeleton h-4 w-20 rounded" />
                <div className="skeleton h-4 w-28 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
