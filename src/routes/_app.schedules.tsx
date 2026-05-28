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
  // STATES
  // =========================================

  const [trainers, setTrainers] =
    useState<any[]>([]);

  const [selectedDay, setSelectedDay] =
    useState("");

  // =========================================
  // FETCH TRAINERS
  // =========================================

  useEffect(() => {

    fetchTrainers();

  }, []);

  async function fetchTrainers() {

    try {

      const response =
        await axios.get(
          "http://localhost:5000/trainers"
        );

      setTrainers(response.data);

    } catch (error) {

      console.error(error);
    }
  }

  // =========================================
  // DURATION CALCULATION
  // =========================================

  function calculateDuration(
    start: string,
    end: string,
    setForm: any
  ) {

    if (!start || !end)
      return;

    const startDate =
      new Date(
        `1970-01-01T${start}`
      );

    let endDate =
      new Date(
        `1970-01-01T${end}`
      );

    // NEXT DAY FIX
    if (endDate <= startDate) {

      endDate.setDate(
        endDate.getDate() + 1
      );
    }

    const diffMs =
      endDate.getTime() -
      startDate.getTime();

    const minutes =
      Math.floor(
        diffMs / 1000 / 60
      );

    setForm((prev: any) => ({
      ...prev,

      duration: minutes,
    }));
  }

  // =========================================
  // UI
  // =========================================

  return (

    <CrudPage

      title="Schedules"

      subtitle="When classes are scheduled"

      dbKey="schedules"

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

          onChange: (value) => {

            setSelectedDay(value);
          },
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

            setForm((prev: any) => ({
              ...prev,

              timeStart: value,
            }));

            calculateDuration(
              value,
              form.timeEnd,
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

            setForm((prev: any) => ({
              ...prev,

              timeEnd: value,
            }));

            calculateDuration(
              form.timeStart,
              value,
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

          options: trainers

            .filter((t) => {

              if (
                t.daysAvailable ===
                "Everyday"
              )
                return true;

              if (
                t.daysAvailable ===
                "Weekends"
              ) {

                return [
                  "Saturday",
                  "Sunday",
                ].includes(selectedDay);
              }

              if (
                t.daysAvailable ===
                "Monday-Friday"
              ) {

                return [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ].includes(selectedDay);
              }

              return t.daysAvailable
                ?.includes(selectedDay);
            })

            .map((t) => ({

              value: t.trainerID,

              label:
                `${t.trainerName} (${t.specialization})`,
            })),

          render: (r) => {

            const trainer =
              trainers.find(
                (t) =>
                  t.trainerID ==
                  r.trainerID
              );

            return trainer
              ? `${trainer.trainerName} (${trainer.specialization})`
              : "—";
          },
        },
      ]}
    />
  );
}