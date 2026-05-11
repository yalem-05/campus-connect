import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gradeService, GradeDto } from "@/services/gradeService";
import { studentService, StudentDto } from "@/services/studentService";
import { courseService, CourseDto } from "@/services/courseService";
import { enrollmentService, EnrollmentDto } from "@/services/enrollmentService";
import { GradeForm, GradeFormData } from "./Grade/GradeForm";
import { toast } from "@/components/ui/use-toast";

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: gradesList = [], isLoading } = useQuery({
    queryKey: ["grades"],
    queryFn: gradeService.getAll,
  });
  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: studentService.getAll,
  });
  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: courseService.getAll,
  });
  const { data: enrollments = [] } = useQuery({
    queryKey: ["enrollments"],
    queryFn: enrollmentService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: gradeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      toast({ title: "Grade Recorded", description: "The grade has been recorded successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to record grade.", variant: "destructive" });
    },
  });

  const handleSubmit = (data: GradeFormData) => {
    createMutation.mutate({
      studentId: data.studentId,
      courseId: data.courseId,
      semester: data.semester,
      academicYear: data.academicYear,
      marksObtained: data.marksObtained,
      totalMarks: data.totalMarks || 100,
      remarks: data.remarks || undefined,
    });
    setIsFormOpen(false);
  };

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading grades...</div>;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Grades</h1>
          <p className="text-sm text-muted-foreground">View and manage student grades.</p>
        </div>
        <DataTable data={gradesList} columns={columns} searchKey="gradeLetter" title="All Grades" addLabel="Add Grade" onAdd={() => setIsFormOpen(true)} />
      </div>
      <GradeForm open={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} mode="add" students={students} courses={courses} enrollments={enrollments} />
    </>
  );
}
