import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadDB } from "@/lib/mock-data";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Dumbbell, ClipboardCheck, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
});

function Dashboard() {
  const [db, setDb] = useState(() => loadDB());
  useEffect(() => setDb(loadDB()), []);

  const stats = [
    { label: "Members", value: db.members.length, icon: Users, accent: true },
    { label: "Active Subscriptions", value: db.subscriptions.filter((s) => s.status === "active").length, icon: CreditCard },
    { label: "Classes", value: db.classes.length, icon: Dumbbell },
    { label: "Check-ins", value: db.attendance.filter((a) => a.checkedIn).length, icon: ClipboardCheck },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your gym at a glance" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className={s.accent ? "border-accent/40" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-3xl font-bold mt-2 text-foreground">{s.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center ${s.accent ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="w-4 h-4" /> Recent Members</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {db.members.slice(0, 5).map((m) => (
                <li key={m.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{m.joinDate}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {db.schedules.slice(0, 5).map((sc) => {
                const cls = db.classes.find((c) => c.id === sc.classId);
                return (
                  <li key={sc.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-foreground">{cls?.name}</p>
                      <p className="text-xs text-muted-foreground">{sc.dayOfWeek} · {sc.room}</p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{sc.startTime}–{sc.endTime}</span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}