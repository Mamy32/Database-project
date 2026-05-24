export type Member = { id: string; name: string; email: string; phone: string; joinDate: string };
export type MembershipPlan = { id: string; name: string; price: number; durationMonths: number; description: string };
export type Subscription = { id: string; memberId: string; planId: string; startDate: string; endDate: string; status: "active" | "expired" };
export type Trainer = { id: string; name: string; specialty: string; email: string };
export type Class = { id: string; name: string; trainerId: string; capacity: number; description: string };
export type Schedule = { id: string; classId: string; dayOfWeek: string; startTime: string; endTime: string; room: string };
export type Attendance = { id: string; memberId: string; classId: string; date: string; checkedIn: boolean };

const KEY = "gym_db_v1";

type DB = {
  members: Member[];
  plans: MembershipPlan[];
  subscriptions: Subscription[];
  trainers: Trainer[];
  classes: Class[];
  schedules: Schedule[];
  attendance: Attendance[];
};

const seed: DB = {
  members: [
    { id: "m1", name: "Alex Carter", email: "alex@flexgym.com", phone: "555-0142", joinDate: "2025-01-15" },
    { id: "m2", name: "Priya Shah", email: "priya@flexgym.com", phone: "555-0177", joinDate: "2025-03-02" },
    { id: "m3", name: "Marcus Lee", email: "marcus@flexgym.com", phone: "555-0188", joinDate: "2024-11-20" },
    { id: "m4", name: "Sofia Reyes", email: "sofia@flexgym.com", phone: "555-0123", joinDate: "2025-05-10" },
  ],
  plans: [
    { id: "p1", name: "Starter", price: 29, durationMonths: 1, description: "Gym access, off-peak hours" },
    { id: "p2", name: "Pro", price: 59, durationMonths: 1, description: "Full access + 2 classes/week" },
    { id: "p3", name: "Elite", price: 149, durationMonths: 3, description: "Unlimited classes + 1 PT session/month" },
  ],
  subscriptions: [
    { id: "s1", memberId: "m1", planId: "p2", startDate: "2025-04-01", endDate: "2025-05-01", status: "active" },
    { id: "s2", memberId: "m2", planId: "p3", startDate: "2025-03-15", endDate: "2025-06-15", status: "active" },
    { id: "s3", memberId: "m3", planId: "p1", startDate: "2025-02-01", endDate: "2025-03-01", status: "expired" },
  ],
  trainers: [
    { id: "t1", name: "Jordan Pike", specialty: "Strength & Conditioning", email: "jordan@flexgym.com" },
    { id: "t2", name: "Mia Tanaka", specialty: "Yoga & Mobility", email: "mia@flexgym.com" },
    { id: "t3", name: "Devon Kim", specialty: "HIIT & Cardio", email: "devon@flexgym.com" },
  ],
  classes: [
    { id: "c1", name: "Power Lifting 101", trainerId: "t1", capacity: 12, description: "Compound lifts with technique focus" },
    { id: "c2", name: "Sunrise Yoga", trainerId: "t2", capacity: 20, description: "Flow-based morning practice" },
    { id: "c3", name: "HIIT Blast", trainerId: "t3", capacity: 15, description: "30-min high-intensity intervals" },
  ],
  schedules: [
    { id: "sc1", classId: "c1", dayOfWeek: "Monday", startTime: "18:00", endTime: "19:00", room: "Weight Room A" },
    { id: "sc2", classId: "c2", dayOfWeek: "Tuesday", startTime: "06:30", endTime: "07:30", room: "Studio 1" },
    { id: "sc3", classId: "c3", dayOfWeek: "Wednesday", startTime: "17:30", endTime: "18:00", room: "Studio 2" },
    { id: "sc4", classId: "c1", dayOfWeek: "Thursday", startTime: "18:00", endTime: "19:00", room: "Weight Room A" },
  ],
  attendance: [
    { id: "a1", memberId: "m1", classId: "c1", date: "2025-05-19", checkedIn: true },
    { id: "a2", memberId: "m2", classId: "c2", date: "2025-05-20", checkedIn: true },
    { id: "a3", memberId: "m1", classId: "c3", date: "2025-05-21", checkedIn: true },
    { id: "a4", memberId: "m4", classId: "c2", date: "2025-05-22", checkedIn: false },
  ],
};

export function loadDB(): DB {
  if (typeof window === "undefined") return seed;
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  }
  try { return JSON.parse(raw) as DB; } catch { return seed; }
}

export function saveDB(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function uid(prefix: string) {
  return `${prefix}${Math.random().toString(36).slice(2, 8)}`;
}