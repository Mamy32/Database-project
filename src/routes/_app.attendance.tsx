import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud/CrudPage";

import { useEffect, useState } from "react";
import axios from "axios";

export const Route = createFileRoute("/_app/attendance")({
  component: AttendancePage,
});

function AttendancePage() {

  // =========================================
  // STATES
  // =========================================

  const [members, setMembers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  // =========================================
  // FETCH DATA
  // =========================================

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {

    try {

      const [membersRes, classesRes] =
        await Promise.all([
          axios.get("http://localhost:5000/members"),
          axios.get("http://localhost:5000/classes"),
        ]);

      setMembers(membersRes.data);
      setClasses(classesRes.data);

    } catch (error) {
      console.error(error);
    }
  }

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

            const cls = classes.find(
              (c) => c.classID == r.classID
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
        },

        // =========================================
        // CHECK IN
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