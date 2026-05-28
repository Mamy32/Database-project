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

  const [trainers, setTrainers] =
    useState<any[]>([]);

  const [schedules, setSchedules] =
    useState<any[]>([]);

  const [selectedTrainer, setSelectedTrainer] =
    useState("");

  // =========================================
  // FETCH DATA
  // =========================================

  useEffect(() => {

    fetchData();

  }, []);

  async function fetchData() {

    try {

      const [
        trainersRes,
        schedulesRes,
      ] = await Promise.all([

        axios.get(
          "http://localhost:5000/trainers"
        ),

        axios.get(
          "http://localhost:5000/schedules"
        ),
      ]);

      setTrainers(
        trainersRes.data
      );

      setSchedules(
        schedulesRes.data
      );

    } catch (error) {

      console.log(error);
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

      // MySQL PK
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

            value: String(
              t.trainerID
            ),

            label:
              `${t.trainerName} (${t.specialization})`,
          })),

          onChange: (value) => {

            setSelectedTrainer(
              String(value)
            );
          },

          render: (r) => {

            const trainer =
              trainers.find(
                (t) =>
                  String(t.trainerID) ===
                  String(r.trainerID)
              );

            return trainer
              ? `${trainer.trainerName} (${trainer.specialization})`
              : "—";
          },
        },

        // =========================================
        // SCHEDULE
        // =========================================

        {
          key: "scheduleID",

          label: "Schedule",

          type: "select",

          options: schedules

            .filter(
              (s) =>
                String(s.trainerID) ===
                String(selectedTrainer)
            )

            .map((s) => ({

              value: String(
                s.scheduleID
              ),

              label:
                `${s.day} • ${s.timeStart} - ${s.timeEnd}`,
            })),

          render: (r) => {

            const schedule =
              schedules.find(
                (s) =>
                  String(s.scheduleID) ===
                  String(r.scheduleID)
              );

            return schedule
              ? `${schedule.day} • ${schedule.timeStart} - ${schedule.timeEnd}`
              : "—";
          },
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