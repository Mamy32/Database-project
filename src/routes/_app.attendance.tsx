import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud/CrudPage";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api";

export const Route = createFileRoute("/_app/attendance")({
  component: AttendancePage,
});

function AttendancePage() {

  // =========================================
  // STATES
  // =========================================

  const [members, setMembers] =
    useState<any[]>([]);

  const [classes, setClasses] =
    useState<any[]>([]);

  const [subscriptions, setSubscriptions] =
    useState<any[]>([]);

  const [plans, setPlans] =
    useState<any[]>([]);

  // =========================================
  // FETCH DATA
  // =========================================

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {

    try {

      const [
        membersRes,
        classesRes,
        subscriptionsRes,
        plansRes,
      ] = await Promise.all([

        axios.get(
          `${API_URL}/members`
        ),

        axios.get(
          `${API_URL}/classes`
        ),

        axios.get(
          `${API_URL}/subscriptions`
        ),

        axios.get(
          `${API_URL}/plans`
        ),
      ]);

      setMembers(
        membersRes.data
      );

      setClasses(
        classesRes.data
      );

      setSubscriptions(
        subscriptionsRes.data
      );

      setPlans(
        plansRes.data
      );

    } catch (error) {
      console.error(error);
    }
  }

  // =========================================
  // ONLY STANDARD / PREMIUM MEMBERS
  // =========================================

  const eligibleMembers =
    members.filter((member) => {

      const activeSubscription =
        subscriptions.find(
          (s) =>
            String(s.memberID) ===
              String(member.memberID) &&
            s.status
              ?.toLowerCase() ===
              "active"
        );

      if (!activeSubscription)
        return false;

      const plan =
        plans.find(
          (p) =>
            String(p.planID) ===
            String(
              activeSubscription.planID
            )
        );

      if (!plan) return false;

      return (
        !plan.planName
          ?.toLowerCase()
          .includes("basic")
      );
    });

  // =========================================
  // UI
  // =========================================

  return (

    <CrudPage

      title="Attendance"

      subtitle="Class check-ins by member"

      // API route
      dbKey="attendance"

      // MySQL PK
      idField="attendanceID"

      fields={[

        // =========================================
        // MEMBER
        // =========================================

        {
          key: "memberID",

          label: "Member",

          type: "select",

          options:
            eligibleMembers.map((m) => {

              const subscription =
                subscriptions.find(
                  (s) =>
                    String(s.memberID) ===
                    String(m.memberID)
                );

              const plan =
                plans.find(
                  (p) =>
                    String(p.planID) ===
                    String(
                      subscription?.planID
                    )
                );

              return {

                value: m.memberID,

                label:
                  `${m.firstName} ${m.lastName} (${plan?.planName})`,
              };
            }),

          render: (r) => {

            const member =
              members.find(
                (m) =>
                  String(m.memberID) ===
                  String(r.memberID)
              );

            const subscription =
              subscriptions.find(
                (s) =>
                  String(s.memberID) ===
                  String(r.memberID)
              );

            const plan =
              plans.find(
                (p) =>
                  String(p.planID) ===
                  String(
                    subscription?.planID
                  )
              );

            return member
              ? `${member.firstName} ${member.lastName} (${plan?.planName})`
              : "—";
          },
        },

        // =========================================
        // CLASS
        // =========================================

        {
          key: "classID",

          label: "Class",

          type: "select",

          options: classes.map((c) => ({
            value: c.classID,
            label: c.className,
          })),

          render: (r) => {

            const cls =
              classes.find(
                (c) =>
                  String(c.classID) ===
                  String(r.classID)
              );

            return cls
              ? cls.className
              : "—";
          },
        },

        // =========================================
        // DATE
        // =========================================

        {
          key: "date",

          label: "Date",

          type: "date",

          readOnly: true,

          defaultValue: () =>
            new Date()
              .toISOString()
              .split("T")[0],

          render: (r) =>

            r.date
              ? new Date(r.date)
                  .toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )
              : "—",
        },

        // =========================================
        // CHECKED IN
        // =========================================

        {
          key: "checkedIn",

          label: "Checked In",

          type: "select",

          options: [

            {
              value: "Yes",
              label: "Yes",
            },

            {
              value: "No",
              label: "No",
            },
          ],

          render: (r) => (

            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                r.checkedIn === "Yes"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {r.checkedIn}
            </span>
          ),
        },
      ]}
    />
  );
}