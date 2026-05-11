import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { enrollmentService, EnrollmentDto } from "@/services/enrollmentService";

const columns = [
  { key: "id", label: "ID" },
  {
    key: "studentName",
    label: "Student",
    render: (e: EnrollmentDto) => e.studentName || `Student #${e.studentId}`,
  },
  {
    key: "courseName",
    label: "Course",
    render: (e: EnrollmentDto) => e.courseName || `Course #${e.courseId}`,
  },
  { key: "semester", label: "Semester" },
  { key: "academicYear", label: "Year" },
  {
    key: "enrollmentDate",
    label: "Enrolled",
    render: (e: EnrollmentDto) => new Date(e.enrollmentDate).toLocaleDateString(),
  },
  {
    key: "enrollmentStatus",
    label: "Status",
    render: (e: EnrollmentDto) => <StatusBadge status={e.enrollmentStatus} />,
  },
];

export default function Enrollments() {
  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ["enrollments"],
    queryFn: enrollmentService.getAll,
  });

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading enrollments...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Enrollments</h1>
        <p className="text-sm text-muted-foreground">Track student course enrollments.</p>
      </div>
      <DataTable data={enrollments} columns={columns} searchKey="studentName" title="All Enrollments" addLabel="Add Enrollment" onAdd={() => {}} />
    </div>
  );
}
