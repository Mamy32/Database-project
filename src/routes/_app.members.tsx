import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud/CrudPage";

export const Route = createFileRoute("/_app/members")({
  component: MembersPage,
});

function MembersPage() {
  return (
    <CrudPage
      title="Members"
      subtitle="People with access to the gym"
      dbKey="members"
      idField="memberID"
      enableSearch={true}
      defaultSortField="firstName"
      defaultSortOrder="asc"
      fields={[
        {
          key: "firstName",
          label: "First Name",
         
        },
        {
          key: "lastName",
          label: "Last Name",
          
        },
        {
          key: "age",
          label: "Age",
          type: "number",
          
        },
        {
          key: "gender",
          label: "Gender",
          type: "select",
          
          options: [
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ],
        },
        {
          key: "phoneNo",
          label: "Phone",
          type: "phone",
        },
        {
          key: "email",
          label: "Email",
          
        },
      ]}
    />
  );
}