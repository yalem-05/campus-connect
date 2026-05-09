// Students.tsx (updated)
import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { students, departments } from "@/data/mockData";
import { StudentForm } from "./StudentC/StudentForm";

const columns = [
  { key: "studentId", label: "ID" },
  {
    key: "name",
    label: "Name",
    render: (s: typeof students[0]) => (
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
    render: (s: typeof students[0]) => departments.find(d => d.id === s.departmentId)?.departmentName || "—",
  },
  {
    key: "enrollmentDate",
    label: "Enrolled",
    render: (s: typeof students[0]) => new Date(s.enrollmentDate).toLocaleDateString(),
  },
  {
    key: "enrollmentStatus",
    label: "Status",
    render: (s: typeof students[0]) => <StatusBadge status={s.enrollmentStatus} />,
  },
];

export default function Students() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddStudent = () => {
    setIsFormOpen(true);
  };

  const handleSubmitStudent = (data: any) => {
    console.log("New student data:", data);
    // Here you would typically make an API call to save the student
    // and then refresh the students list
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-sm text-muted-foreground">Manage student records and enrollments.</p>
        </div>
        <DataTable 
          data={students} 
          columns={columns} 
          searchKey="firstName" 
          title="All Students" 
          addLabel="Add Student" 
          onAdd={handleAddStudent} 
        />
      </div>

      <StudentForm 
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitStudent}
        mode="add"
      />
    </>
  );
}