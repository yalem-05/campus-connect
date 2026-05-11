import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollmentService, EnrollmentDto } from "@/services/enrollmentService";
import { studentService, StudentDto } from "@/services/studentService";
import { courseService, CourseDto } from "@/services/courseService";
import { EnrollmentForm, EnrollmentFormData } from "./Enrollment/EnrollmentForm";
import { toast } from "@/components/ui/use-toast";

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: enrollmentsList = [], isLoading } = useQuery({
    queryKey: ["enrollments"],
    queryFn: enrollmentService.getAll,
  });
  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: studentService.getAll,
  });
  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: courseService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: enrollmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast({ title: "Enrollment Created", description: "The enrollment has been created successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create enrollment.", variant: "destructive" });
    },
  });

  const handleSubmit = (data: EnrollmentFormData) => {
    createMutation.mutate({
      studentId: data.studentId,
      courseId: data.courseId,
      semester: data.semester,
      academicYear: data.academicYear,
    });
    setIsFormOpen(false);
  };

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading enrollments...</div>;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Enrollments</h1>
          <p className="text-sm text-muted-foreground">Track course enrollments and registrations.</p>
        </div>
        <DataTable data={enrollmentsList} columns={columns} searchKey="semester" title="All Enrollments" addLabel="New Enrollment" onAdd={() => setIsFormOpen(true)} />
      </div>
      <EnrollmentForm open={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} mode="add" students={students} courses={courses} />
    </>
  );
}
