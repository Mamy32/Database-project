import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud/CrudPage";

import { useEffect, useState } from "react";
import axios from "axios";

export const Route = createFileRoute("/_app/classes")({
  component: ClassesPage,
});

function ClassesPage() {

  // =========================================
  // STATES
  // =========================================

  const [trainers, setTrainers] = useState<any[]>([]);

  // =========================================
  // FETCH TRAINERS
  // =========================================

  useEffect(() => {
    fetchTrainers();
  }, []);

  async function fetchTrainers() {

    try {

      const response = await axios.get(
        "http://localhost:5000/trainers"
      );

      setTrainers(response.data);

    } catch (error) {
      console.error(error);
    }
  }

  // =========================================
  // UI
  // =========================================

  return (

    <CrudPage

      title="Classes"

      subtitle="Group sessions offered at the gym"

      // API route
      dbKey="classes"

      // MySQL primary key
      idField="classID"

      fields={[

        // =========================================
        // CLASS NAME
        // =========================================

        {
          key: "className",
          label: "Class Name",
        },

        // =========================================
        // TRAINER
        // =========================================

        {
          key: "trainerID",

          label: "Trainer",

          type: "select",

          options: trainers.map((t) => ({
            value: t.trainerID,
            label: t.trainerName,
          })),

          render: (r) => {

            const trainer = trainers.find(
              (t) => t.trainerID == r.trainerID
            );

            return trainer
              ? trainer.trainerName
              : "—";
          },
        },

        // =========================================
        // SCHEDULE ID
        // =========================================

        {
          key: "scheduleID",
          label: "Schedule ID",
          type: "number",
        },

        // =========================================
        // MAX CAPACITY
        // =========================================

        {
          key: "maxCapacity",
          label: "Max Capacity",
          type: "number",
        },
      ]}
    />
  );
}