// Enrollments.tsx (updated)
import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { enrollments, students, courses } from "@/data/mockData";
import { EnrollmentForm } from "./Enrollment/EnrollmentForm";
import { toast } from "@/components/ui/use-toast";

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [enrollmentsList, setEnrollmentsList] = useState(enrollments);

  const handleAddEnrollment = () => {
    setIsFormOpen(true);
  };

  const handleSubmitEnrollment = (data: any) => {
    const newEnrollment = {
      id: enrollmentsList.length + 1,
      guid: `e${enrollmentsList.length + 1}`,
      ...data,
      createdDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    
    setEnrollmentsList([...enrollmentsList, newEnrollment]);
    
    // Get student and course names for the toast message
    const student = students.find(s => s.id === data.studentId);
    const course = courses.find(c => c.id === data.courseId);
    
    toast({
      title: "Enrollment Created",
      description: `${student?.firstName} ${student?.lastName} enrolled in ${course?.courseName} for ${data.semester} ${data.academicYear}.`,
    });
    
    setIsFormOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Enrollments</h1>
          <p className="text-sm text-muted-foreground">Track course enrollments and registrations.</p>
        </div>
        <DataTable 
          data={enrollmentsList} 
          columns={columns} 
          searchKey="semester" 
          title="All Enrollments" 
          addLabel="New Enrollment" 
          onAdd={handleAddEnrollment} 
        />
      </div>

      <EnrollmentForm 
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitEnrollment}
        mode="add"
      />
    </>
  );
}