// Grades.tsx (updated)
import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { grades, students, courses } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { GradeForm } from "./Grade/GradeForm";
import { toast } from "@/components/ui/use-toast";

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [gradesList, setGradesList] = useState(grades);

  const handleAddGrade = () => {
    setIsFormOpen(true);
  };

  const handleSubmitGrade = (data: any) => {
    const newGrade = {
      id: gradesList.length + 1,
      guid: `g${gradesList.length + 1}`,
      ...data,
      createdDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    
    setGradesList([...gradesList, newGrade]);
    
    // Get student and course names for the toast message
    const student = students.find(s => s.id === data.studentId);
    const course = courses.find(c => c.id === data.courseId);
    
    toast({
      title: "Grade Recorded",
      description: `${student?.firstName} ${student?.lastName} received ${data.gradeLetter} (${data.marksObtained}/${data.totalMarks}) in ${course?.courseName}.`,
    });
    
    setIsFormOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Grades</h1>
          <p className="text-sm text-muted-foreground">View and manage student grades.</p>
        </div>
        <DataTable 
          data={gradesList} 
          columns={columns} 
          searchKey="gradeLetter" 
          title="All Grades" 
          addLabel="Add Grade" 
          onAdd={handleAddGrade} 
        />
      </div>

      <GradeForm 
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitGrade}
        mode="add"
      />
    </>
  );
}