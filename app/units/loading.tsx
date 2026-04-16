export default function UnitsLoading() {
  return (
    <section className="space-y-4">
      <div className="h-7 w-64 skeleton" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-24 skeleton" />
        <div className="h-24 skeleton" />
        <div className="h-24 skeleton" />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="h-48 skeleton" />
        <div className="h-48 skeleton" />
        <div className="h-48 skeleton" />
      </div>
    </section>
  );
}
