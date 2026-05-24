import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud/CrudPage";
import { loadDB } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/subscriptions")({
  component: SubscriptionsPage,
});

function SubscriptionsPage() {
  const db = loadDB();
  return (
    <CrudPage
      title="Subscriptions"
      subtitle="Active and past memberships"
      dbKey="subscriptions"
      idPrefix="s"
      fields={[
        {
          key: "memberId", label: "Member", type: "select",
          options: db.members.map((m) => ({ value: m.id, label: m.name })),
          render: (r) => db.members.find((m) => m.id === r.memberId)?.name ?? "—",
        },
        {
          key: "planId", label: "Plan", type: "select",
          options: db.plans.map((p) => ({ value: p.id, label: p.name })),
          render: (r) => db.plans.find((p) => p.id === r.planId)?.name ?? "—",
        },
        { key: "startDate", label: "Start", type: "date" },
        { key: "endDate", label: "End", type: "date" },
        {
          key: "status", label: "Status", type: "select",
          options: [{ value: "active", label: "Active" }, { value: "expired", label: "Expired" }],
          render: (r) => (
            <span className={`text-xs font-medium px-2 py-1 rounded ${r.status === "active" ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
              {r.status}
            </span>
          ),
        },
      ]}
      defaults={{ status: "active" }}
    />
  );
}