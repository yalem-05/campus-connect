import { DataTable } from "@/components/shared/DataTable";
import { grades, students, courses } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

const columns = [
  {
    key: "student",
    label: "Student",
    render: (g: typeof grades[0]) => {
      const s = students.find(st => st.id === g.studentId);
      return s ? `${s.firstName} ${s.lastName}` : "—";
    },
  },
  {
    key: "course",
    label: "Course",
    render: (g: typeof grades[0]) => {
      const c = courses.find(co => co.id === g.courseId);
      return c ? c.courseName : "—";
    },
  },
  {
    key: "marks",
    label: "Marks",
    render: (g: typeof grades[0]) => `${g.marksObtained}/${g.totalMarks}`,
  },
  {
    key: "gradeLetter",
    label: "Grade",
    render: (g: typeof grades[0]) => (
      <Badge variant="outline" className="font-semibold">{g.gradeLetter}</Badge>
    ),
  },
  { key: "gradePoint", label: "GPA" },
  { key: "semester", label: "Semester" },
];

export default function Grades() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Grades</h1>
        <p className="text-sm text-muted-foreground">View and manage student grades.</p>
      </div>
      <DataTable data={grades} columns={columns} searchKey="gradeLetter" title="All Grades" addLabel="Add Grade" onAdd={() => {}} />
    </div>
  );
}
