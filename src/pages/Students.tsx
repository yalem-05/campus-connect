import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService, StudentDto } from "@/services/studentService";
import { departmentService, DepartmentDto } from "@/services/departmentService";
import { StudentForm } from "./StudentC/StudentForm";
import { toast } from "@/components/ui/use-toast";

interface StudentFormData {
  studentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  enrollmentDate: string;
  enrollmentStatus: "Active" | "Inactive" | "Graduated" | "Suspended";
  departmentId: number;
}

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ["students"],
    queryFn: studentService.getAll,
  });
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: studentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Student Added", description: "The student has been added successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add student.", variant: "destructive" });
    },
  });

  const handleSubmit = (data: StudentFormData) => {
    createMutation.mutate({
      studentId: data.studentId,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      email: data.email,
      phoneNumber: data.phoneNumber || undefined,
      address: data.address || undefined,
      city: data.city || undefined,
      state: data.state || undefined,
      country: data.country || undefined,
      postalCode: data.postalCode || undefined,
      emergencyContactName: data.emergencyContactName || undefined,
      emergencyContactNumber: data.emergencyContactNumber || undefined,
      departmentId: data.departmentId || undefined,
    });
    setIsFormOpen(false);
  };

  if (studentsLoading) return <div className="p-6 text-muted-foreground">Loading students...</div>;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-sm text-muted-foreground">Manage student records and enrollments.</p>
        </div>
        <DataTable data={students} columns={columns(departments)} searchKey="firstName" title="All Students" addLabel="Add Student" onAdd={() => setIsFormOpen(true)} />
      </div>
      <StudentForm open={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} mode="add" departments={departments} />
    </>
  );
}
