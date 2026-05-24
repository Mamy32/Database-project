import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud/CrudPage";

export const Route = createFileRoute("/_app/members")({
  component: () => (
    <CrudPage
      title="Members"
      subtitle="People with access to the gym"
      dbKey="members"
      idPrefix="m"
      fields={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "joinDate", label: "Join Date", type: "date" },
      ]}
    />
  ),
});