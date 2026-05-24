import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud/CrudPage";

export const Route = createFileRoute("/_app/trainers")({
  component: () => (
    <CrudPage
      title="Trainers"
      subtitle="Coaches running classes"
      dbKey="trainers"
      idPrefix="t"
      fields={[
        { key: "name", label: "Name" },
        { key: "specialty", label: "Specialty" },
        { key: "email", label: "Email" },
      ]}
    />
  ),
});