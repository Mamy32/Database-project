import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud/CrudPage";
import { loadDB } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/schedules")({
  component: SchedulesPage,
});

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function SchedulesPage() {
  const db = loadDB();
  return (
    <CrudPage
      title="Schedules"
      subtitle="When and where classes meet"
      dbKey="schedules"
      idPrefix="sc"
      fields={[
        {
          key: "classId", label: "Class", type: "select",
          options: db.classes.map((c) => ({ value: c.id, label: c.name })),
          render: (r) => db.classes.find((c) => c.id === r.classId)?.name ?? "—",
        },
        {
          key: "dayOfWeek", label: "Day", type: "select",
          options: DAYS.map((d) => ({ value: d, label: d })),
        },
        { key: "startTime", label: "Start" },
        { key: "endTime", label: "End" },
        { key: "room", label: "Room" },
      ]}
    />
  );
}