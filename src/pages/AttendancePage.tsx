import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { attendanceService, AttendanceDto } from "@/services/attendanceService";

const columns = [
  { key: "id", label: "ID" },
  {
    key: "studentName",
    label: "Student",
    render: (a: AttendanceDto) => a.studentName || `Student #${a.studentId}`,
  },
  {
    key: "courseName",
    label: "Course",
    render: (a: AttendanceDto) => a.courseName || `Schedule #${a.courseScheduleId}`,
  },
  {
    key: "attendanceDate",
    label: "Date",
    render: (a: AttendanceDto) => new Date(a.attendanceDate).toLocaleDateString(),
  },
  {
    key: "status",
    label: "Status",
    render: (a: AttendanceDto) => <StatusBadge status={a.status} />,
  },
];

export default function AttendancePage() {
  const { data: records = [], isLoading } = useQuery({
    queryKey: ["attendance"],
    queryFn: attendanceService.getAll,
  });

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading attendance...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-sm text-muted-foreground">Track and manage student attendance records.</p>
      </div>
      <DataTable data={records} columns={columns} searchKey="studentName" title="Attendance Records" addLabel="Mark Attendance" onAdd={() => {}} />
    </div>
  );
}
