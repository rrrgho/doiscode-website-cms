import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card">
        <LayoutDashboard className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Welcome to Doiscode CMS. Use the sidebar to manage your content.
      </p>
      <p className="mt-1 text-xs text-muted-foreground/60">
        Analytics and overview widgets coming in the next iteration.
      </p>
    </div>
  );
}
