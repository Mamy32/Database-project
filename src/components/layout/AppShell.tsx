import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Users, CreditCard, Repeat, Dumbbell, Calendar, UserCog, ClipboardCheck, LayoutDashboard } from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/members", label: "Members", icon: Users },
  { to: "/plans", label: "Plans", icon: CreditCard },
  { to: "/subscriptions", label: "Subscriptions", icon: Repeat },
  { to: "/classes", label: "Classes", icon: Dumbbell },
  { to: "/schedules", label: "Schedules", icon: Calendar },
  { to: "/trainers", label: "Trainers", icon: UserCog },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck },
];

export function AppShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">FlexGym</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Management Console</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const active = path === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border text-xs text-muted-foreground">
          Frontend demo · mock data
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}