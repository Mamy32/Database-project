import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud/CrudPage";

import { useEffect, useState } from "react";
import axios from "axios";

export const Route = createFileRoute("/_app/schedules")({
  component: SchedulesPage,
});

// =========================================
// DAYS
// =========================================

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];


function SchedulesPage() {
  // =========================================
  // DURATION CALCULATION
  // =========================================
  function calculateDuration(
  start: string,
  end: string,
  form: any,
  setForm: any
) {

  if (!start || !end) return;

  const startDate =
    new Date(`1970-01-01T${start}`);

  const endDate =
    new Date(`1970-01-01T${end}`);

  const diffMs =
    endDate.getTime() -
    startDate.getTime();

  const minutes =
    diffMs / 1000 / 60;

  if (minutes > 0) {

    setForm((prev: any) => ({
      ...prev,

      duration: minutes,
    }));
  }
}

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

      title="Schedules"

      subtitle="When classes are scheduled"

      // API route
      dbKey="schedules"

      // MySQL PK
      idField="scheduleID"

      fields={[

        // =========================================
        // DAY
        // =========================================

        {
          key: "day",

          label: "Day",

          type: "select",

          options: DAYS.map((d) => ({
            value: d,
            label: d,
          })),
        },

        // =========================================
        // START TIME
        // =========================================

{
  key: "timeStart",

  label: "Start Time",

  type: "time",

  onChange: (
    value,
    form,
    setForm
  ) => {

    calculateDuration(
      value,
      form.timeEnd,
      form,
      setForm
    );
  },
},

        // =========================================
        // END TIME
        // =========================================

{
  key: "timeEnd",

  label: "End Time",

  type: "time",

  onChange: (
    value,
    form,
    setForm
  ) => {

    calculateDuration(
      form.timeStart,
      value,
      form,
      setForm
    );
  },
},

        // =========================================
        // DURATION
        // =========================================

  {
  key: "duration",

  label: "Duration (Minutes)",

  type: "number",

  readOnly: true,
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
      ]}
    />
  );
}