import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud/CrudPage";
import { loadDB } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/classes")({
  component: ClassesPage,
});

function ClassesPage() {
  const db = loadDB();
  return (
    <CrudPage
      title="Classes"
      subtitle="Group sessions offered at the gym"
      dbKey="classes"
      idPrefix="c"
      fields={[
        { key: "name", label: "Name" },
        {
          key: "trainerId", label: "Trainer", type: "select",
          options: db.trainers.map((t) => ({ value: t.id, label: t.name })),
          render: (r) => db.trainers.find((t) => t.id === r.trainerId)?.name ?? "—",
        },
        { key: "capacity", label: "Capacity", type: "number" },
        { key: "description", label: "Description" },
      ]}
    />
  );
}