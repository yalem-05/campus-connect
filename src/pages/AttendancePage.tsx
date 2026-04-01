import { CalendarCheck } from "lucide-react";

export default function AttendancePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-sm text-muted-foreground">Track and manage student attendance records.</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 shadow-card">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <CalendarCheck className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Attendance Tracking</h3>
        <p className="mt-1 text-sm text-muted-foreground text-center max-w-md">
          Attendance records will be displayed here. Connect to your backend API to start tracking attendance for course schedules.
        </p>
      </div>
    </div>
  );
}
