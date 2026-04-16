export default function AnalyticsLoading() {
  return (
    <section className="space-y-5">
      <div className="h-7 w-48 skeleton" />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-24 skeleton" />
        <div className="h-24 skeleton" />
        <div className="h-24 skeleton" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-80 skeleton" />
        <div className="h-80 skeleton" />
      </div>
    </section>
  );
}
