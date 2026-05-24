import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";

import { PageHeader } from "@/components/ui/page-header";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Users,
  CreditCard,
  Dumbbell,
  ClipboardCheck,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
});

function Dashboard() {

  // =========================================
  // STATES
  // =========================================

  const [members, setMembers] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);

  // =========================================
  // FETCH DATA
  // =========================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {

    try {

      const [
        membersRes,
        subscriptionsRes,
        classesRes,
        attendanceRes,
        schedulesRes,
      ] = await Promise.all([
        axios.get("http://localhost:5000/members"),
        axios.get("http://localhost:5000/subscriptions"),
        axios.get("http://localhost:5000/classes"),
        axios.get("http://localhost:5000/attendance"),
        axios.get("http://localhost:5000/schedules"),
      ]);

      setMembers(membersRes.data);
      setSubscriptions(subscriptionsRes.data);
      setClasses(classesRes.data);
      setAttendance(attendanceRes.data);
      setSchedules(schedulesRes.data);

    } catch (error) {
      console.error(error);
    }
  }

  // =========================================
  // DASHBOARD STATS
  // =========================================

  const stats = [
    {
      label: "Members",
      value: members.length,
      icon: Users,
      accent: true,
    },

    {
      label: "Active Subscriptions",
      value: subscriptions.filter(
        (s) => s.status === "active"
      ).length,
      icon: CreditCard,
    },

    {
      label: "Classes",
      value: classes.length,
      icon: Dumbbell,
    },

    {
      label: "Check-ins",
      value: attendance.length,
      icon: ClipboardCheck,
    },
  ];

  // =========================================
  // UI
  // =========================================

  return (
    <div>

      <PageHeader
        title="Dashboard"
        subtitle="Overview of your gym at a glance"
      />

      {/* ========================================= */}
      {/* STATS */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        {stats.map((s) => {

          const Icon = s.icon;

          return (

            <Card
              key={s.label}
              className={s.accent ? "border-accent/40" : ""}
            >

              <CardContent className="pt-6">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">
                      {s.label}
                    </p>

                    <p className="text-3xl font-bold mt-2 text-foreground">
                      {s.value}
                    </p>

                  </div>

                  <div
                    className={`w-10 h-10 rounded-md flex items-center justify-center ${
                      s.accent
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ========================================= */}
      {/* RECENT MEMBERS + SCHEDULE */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ========================================= */}
        {/* MEMBERS */}
        {/* ========================================= */}

        <Card>

          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4" />
              Recent Members
            </CardTitle>
          </CardHeader>

          <CardContent>

            <ul className="space-y-3">

              {members.slice(0, 5).map((m) => (

                <li
                  key={m.memberID}
                  className="flex items-center justify-between text-sm"
                >

                  <div>

                    <p className="font-medium text-foreground">
                      {m.firstName} {m.lastName}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {m.email}
                    </p>

                  </div>

                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* ========================================= */}
        {/* SCHEDULES */}
        {/* ========================================= */}

        <Card>

          <CardHeader>
            <CardTitle className="text-base">
              Upcoming Schedule
            </CardTitle>
          </CardHeader>

          <CardContent>

            <ul className="space-y-3">

              {schedules.slice(0, 5).map((sc) => {

                const cls = classes.find(
                  (c) => c.classID === sc.classID
                );

                return (

                  <li
                    key={sc.scheduleID}
                    className="flex items-center justify-between text-sm"
                  >

                    <div>

                      <p className="font-medium text-foreground">
                        {cls?.className}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {sc.day}
                      </p>

                    </div>

                    <span className="text-xs font-mono text-muted-foreground">
                      {sc.timeStart} - {sc.timeEnd}
                    </span>

                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}