import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { gradeService, GradeDto } from "@/services/gradeService";

const columns = [
  { key: "id", label: "ID" },
  {
    key: "studentName",
    label: "Student",
    render: (g: GradeDto) => g.studentName || `Student #${g.studentId}`,
  },
  {
    key: "courseName",
    label: "Course",
    render: (g: GradeDto) => g.courseName || `Course #${g.courseId}`,
  },
  { key: "semester", label: "Semester" },
  {
    key: "marksObtained",
    label: "Marks",
    render: (g: GradeDto) => `${g.marksObtained}/${g.totalMarks}`,
  },
  {
    key: "gradeLetter",
    label: "Grade",
    render: (g: GradeDto) => (
      <Badge variant={g.gradeLetter === "F" ? "destructive" : "default"}>{g.gradeLetter}</Badge>
    ),
  },
  { key: "gradePoint", label: "GPA" },
];

export default function Grades() {
  const { data: grades = [], isLoading } = useQuery({
    queryKey: ["grades"],
    queryFn: gradeService.getAll,
  });

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading grades...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Grades</h1>
        <p className="text-sm text-muted-foreground">View and manage student grades.</p>
      </div>
      <DataTable data={grades} columns={columns} searchKey="studentName" title="All Grades" addLabel="Add Grade" onAdd={() => {}} />
    </div>
  );
}
