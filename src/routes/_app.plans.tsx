import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud/CrudPage";

export const Route = createFileRoute("/_app/plans")({
  component: PlansPage,
});

function PlansPage() {

  return (

    <CrudPage

      title="Membership Plans"

      subtitle="Subscription tiers offered to members"

      // API route
      dbKey="plans"

      // MySQL primary key
      idField="planID"

      fields={[

        // =========================================
        // PLAN NAME
        // =========================================

        {
          key: "planName",
          label: "Plan Name",
        },

        // =========================================
        // PLAN PRICE
        // =========================================

        {
          key: "planPrice",

          label: "Price ($)",

          type: "number",

          render: (r) => `$${r.planPrice}`,
        },

        // =========================================
        // DURATION
        // =========================================

        {
          key: "duration",

          label: "Duration (months)",

          type: "number",
        },

        // =========================================
        // DESCRIPTION
        // =========================================

        {
          key: "description",

          label: "Description",
        },
      ]}
    />
  );
}