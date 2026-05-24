import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud/CrudPage";

import { useEffect, useState } from "react";
import axios from "axios";

export const Route = createFileRoute("/_app/subscriptions")({
  component: SubscriptionsPage,
});

function SubscriptionsPage() {

  // =========================================
  // STATES
  // =========================================

  const [members, setMembers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);

  // =========================================
  // FETCH DATA
  // =========================================

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {

    try {

      const [membersRes, plansRes] =
        await Promise.all([
          axios.get("http://localhost:5000/members"),
          axios.get("http://localhost:5000/plans"),
        ]);

      setMembers(membersRes.data);
      setPlans(plansRes.data);

    } catch (error) {
      console.error(error);
    }
  }

  // =========================================
  // UI
  // =========================================

  return (

    <CrudPage

      title="Subscriptions"

      subtitle="Active and past memberships"

      // API route
      dbKey="subscriptions"

      // MySQL PK
      idField="subscriptionID"

      fields={[

        // =========================================
        // MEMBER
        // =========================================

        {
          key: "memberID",

          label: "Member",

          type: "select",

          options: members.map((m) => ({
            value: m.memberID,
            label: `${m.firstName} ${m.lastName}`,
          })),

          render: (r) => {

            const member = members.find(
              (m) => m.memberID == r.memberID
            );

            return member
              ? `${member.firstName} ${member.lastName}`
              : "—";
          },
        },

        // =========================================
        // PLAN
        // =========================================

        {
  key: "planID",

  label: "Plan",

  type: "select",

  options: plans.map((p) => ({
    value: p.planID,
    label: p.planName,
  })),

  render: (r) => {

    const plan = plans.find(
      (p) => p.planID == r.planID
    );

    return plan
      ? plan.planName
      : "—";
  },

  // AUTO UPDATE PAYMENT
  onChange: (
    value,
    form,
    setForm
  ) => {

    const selectedPlan = plans.find(
      (p) => p.planID == value
    );

    if (selectedPlan) {

      setForm((prev: any) => ({
        ...prev,

        planID: value,

        paymentAmount:
          selectedPlan.planPrice,
      }));
    }
  },
},

        // =========================================
        // START DATE
        // =========================================

        {
          key: "startDate",
          label: "Start Date",
          type: "date",
        },

        // =========================================
        // END DATE
        // =========================================

        {
          key: "endDate",
          label: "End Date",
          type: "date",
        },

        // =========================================
        // PAYMENT AMOUNT
        // =========================================

      {
  key: "paymentAmount",

  label: "Payment Amount",

  type: "number",

  readOnly: true,

  render: (r) =>
    `$${r.paymentAmount}`,
},

        // =========================================
        // PAYMENT DATE
        // =========================================

        {
          key: "paymentDate",
          label: "Payment Date",
          type: "date",
        },

        // =========================================
        // PAYMENT METHOD
        // =========================================

        {
  key: "method",

  label: "Payment Method",

  type: "select",

  options: [
    {
      value: "Cash",
      label: "Cash",
    },

    {
      value: "Credit Card",
      label: "Credit Card",
    },

    {
      value: "Debit Card",
      label: "Debit Card",
    },

    {
      value: "Bank Transfer",
      label: "Bank Transfer",
    },

    {
      value: "E-Wallet",
      label: "E-Wallet",
    },
  ],
},

        // =========================================
        // STATUS
        // =========================================

        {
          key: "status",

          label: "Status",

          type: "select",

          options: [
            {
              value: "Active",
              label: "Active",
            },

            {
              value: "Expired",
              label: "Expired",
            },
          ],

          render: (r) => (

            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                r.status === "Active"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {r.status}
            </span>
          ),
        },
      ]}

      defaults={{
        status: "Active",
      }}
    />
  );
}