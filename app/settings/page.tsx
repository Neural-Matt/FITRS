import { SettingsPanel } from "@/components/settings-panel";

export default function SettingsPage() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-[color:var(--text-muted)]">
          System-level preferences for the Fire Brigade command console.
        </p>
      </div>

      <SettingsPanel />
    </section>
  );
}
