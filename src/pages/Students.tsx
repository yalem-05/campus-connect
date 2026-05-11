import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { studentService, StudentDto } from "@/services/studentService";
import { departmentService, DepartmentDto } from "@/services/departmentService";

const columns = (departments: DepartmentDto[]) => [
  { key: "studentId", label: "ID" },
  {
    key: "name",
    label: "Name",
    render: (s: StudentDto) => (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {s.firstName[0]}{s.lastName[0]}
        </div>
        <div>
          <p className="font-medium">{s.firstName} {s.lastName}</p>
          <p className="text-xs text-muted-foreground">{s.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "department",
    label: "Department",
    render: (s: StudentDto) => departments.find(d => d.id === s.departmentId)?.departmentName || "—",
  },
  {
    key: "enrollmentDate",
    label: "Enrolled",
    render: (s: StudentDto) => new Date(s.enrollmentDate).toLocaleDateString(),
  },
  {
    key: "enrollmentStatus",
    label: "Status",
    render: (s: StudentDto) => <StatusBadge status={s.enrollmentStatus} />,
  },
];

export default function Students() {
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ["students"],
    queryFn: studentService.getAll,
  });
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentService.getAll,
  });

  if (studentsLoading) return <div className="p-6 text-muted-foreground">Loading students...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Students</h1>
        <p className="text-sm text-muted-foreground">Manage student records and enrollments.</p>
      </div>
      <DataTable data={students} columns={columns(departments)} searchKey="firstName" title="All Students" addLabel="Add Student" onAdd={() => {}} />
    </div>
  );
}
