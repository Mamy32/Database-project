import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud/CrudPage";
import { API_URL } from "@/lib/api";
export const Route = createFileRoute("/_app/trainers")({
  component: TrainersPage,
});

function TrainersPage() {

  return (

    <CrudPage

      title="Trainers"

      subtitle="Coaches running gym classes"

      // API route
      dbKey="trainers"

      // MySQL PK
      idField="trainerID"

      fields={[

        // =========================================
        // TRAINER NAME
        // =========================================

        {
          key: "trainerName",
          label: "Trainer Name",
        },

        // =========================================
        // SPECIALIZATION
        // =========================================

        {
          key: "specialization",
          label: "Specialization",
        },

        // =========================================
        // DAYS AVAILABLE
        // =========================================

{
  key: "daysAvailable",

  label: "Days Available",

  type: "select",

  options: [
    {
      value: "Monday-Friday",
      label: "Monday-Friday",
    },
    {
      value: "Weekends",
      label: "Weekends",
    },
    {
      value: "Everyday",
      label: "Everyday",
    },
  ],
},
      ]}
    />
  );
}