import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud/CrudPage";
import { loadDB } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/attendance")({
  component: AttendancePage,
});

function AttendancePage() {
  const db = loadDB();
  return (
    <CrudPage
      title="Attendance"
      subtitle="Class check-ins by member"
      dbKey="attendance"
      idPrefix="a"
      fields={[
        {
          key: "memberId", label: "Member", type: "select",
          options: db.members.map((m) => ({ value: m.id, label: m.name })),
          render: (r) => db.members.find((m) => m.id === r.memberId)?.name ?? "—",
        },
        {
          key: "classId", label: "Class", type: "select",
          options: db.classes.map((c) => ({ value: c.id, label: c.name })),
          render: (r) => db.classes.find((c) => c.id === r.classId)?.name ?? "—",
        },
        { key: "date", label: "Date", type: "date" },
        {
          key: "checkedIn", label: "Checked In", type: "select",
          options: [{ value: "true", label: "Yes" }, { value: "false", label: "No" }],
          render: (r) => (
            <span className={`text-xs font-medium px-2 py-1 rounded ${String(r.checkedIn) === "true" || r.checkedIn === true ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
              {String(r.checkedIn) === "true" || r.checkedIn === true ? "Yes" : "No"}
            </span>
          ),
        },
      ]}
      defaults={{ checkedIn: "true" }}
    />
  );
}