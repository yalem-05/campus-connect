import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { courseService, CourseDto } from "@/services/courseService";
import { departmentService, DepartmentDto } from "@/services/departmentService";

const columns = (departments: DepartmentDto[]) => [
  { key: "courseCode", label: "Code" },
  {
    key: "courseName",
    label: "Course Name",
    render: (c: CourseDto) => (
      <div>
        <p className="font-medium">{c.courseName}</p>
        <p className="text-xs text-muted-foreground line-clamp-1">{c.description}</p>
      </div>
    ),
  },
  {
    key: "department",
    label: "Department",
    render: (c: CourseDto) => departments.find(d => d.id === c.departmentId)?.departmentName || "—",
  },
  { key: "credits", label: "Credits" },
  {
    key: "courseLevel",
    label: "Level",
    render: (c: CourseDto) => (
      <Badge variant="outline" className="text-[11px]">{c.courseLevel}</Badge>
    ),
  },
  {
    key: "fee",
    label: "Fee",
    render: (c: CourseDto) => `$${c.fee.toLocaleString()}`,
  },
];

export default function Courses() {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: courseService.getAll,
  });
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentService.getAll,
  });

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading courses...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Courses</h1>
        <p className="text-sm text-muted-foreground">Browse and manage course offerings.</p>
      </div>
      <DataTable data={courses} columns={columns(departments)} searchKey="courseName" title="All Courses" addLabel="Add Course" onAdd={() => {}} />
    </div>
  );
}
