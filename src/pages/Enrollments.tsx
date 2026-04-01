import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { enrollments, students, courses } from "@/data/mockData";

const columns = [
  {
    key: "student",
    label: "Student",
    render: (e: typeof enrollments[0]) => {
      const s = students.find(st => st.id === e.studentId);
      return s ? `${s.firstName} ${s.lastName}` : "—";
    },
  },
  {
    key: "course",
    label: "Course",
    render: (e: typeof enrollments[0]) => {
      const c = courses.find(co => co.id === e.courseId);
      return c ? `${c.courseCode} - ${c.courseName}` : "—";
    },
  },
  { key: "semester", label: "Semester" },
  { key: "academicYear", label: "Year" },
  {
    key: "enrollmentDate",
    label: "Date",
    render: (e: typeof enrollments[0]) => new Date(e.enrollmentDate).toLocaleDateString(),
  },
  {
    key: "enrollmentStatus",
    label: "Status",
    render: (e: typeof enrollments[0]) => <StatusBadge status={e.enrollmentStatus} />,
  },
];

export default function Enrollments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Enrollments</h1>
        <p className="text-sm text-muted-foreground">Track course enrollments and registrations.</p>
      </div>
      <DataTable data={enrollments} columns={columns} searchKey="semester" title="All Enrollments" addLabel="New Enrollment" onAdd={() => {}} />
    </div>
  );
}
