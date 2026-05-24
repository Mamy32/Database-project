import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud/CrudPage";

export const Route = createFileRoute("/_app/plans")({
  component: () => (
    <CrudPage
      title="Membership Plans"
      subtitle="Subscription tiers offered to members"
      dbKey="plans"
      idPrefix="p"
      fields={[
        { key: "name", label: "Name" },
        { key: "price", label: "Price ($)", type: "number", render: (r) => `$${r.price}` },
        { key: "durationMonths", label: "Duration (mo)", type: "number" },
        { key: "description", label: "Description" },
      ]}
    />
  ),
});