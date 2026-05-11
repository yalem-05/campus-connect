import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { facultyService, FacultyDto } from "@/services/facultyService";
import { departmentService, DepartmentDto } from "@/services/departmentService";
import { FacultyForm, FacultyFormData } from "./Faculity/FaculityForm";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

const columns = (departments: DepartmentDto[]) => [
  { key: "facultyId", label: "ID" },
  {
    key: "name",
    label: "Name",
    render: (f: FacultyDto) => (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
          {f.firstName[0]}{f.lastName[0]}
        </div>
        <div>
          <p className="font-medium">{f.firstName} {f.lastName}</p>
          <p className="text-xs text-muted-foreground">{f.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "department",
    label: "Department",
    render: (f: FacultyDto) => departments.find(d => d.id === f.departmentId)?.departmentName || "—",
  },
  {
    key: "designation",
    label: "Designation",
    render: (f: FacultyDto) => <Badge variant="outline" className="text-[11px]">{f.designation}</Badge>,
  },
  { key: "specialization", label: "Specialization" },
  {
    key: "status",
    label: "Status",
    render: (f: FacultyDto) => <StatusBadge status={f.status} />,
  },
];

export default function FacultyPage() {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: facultyList = [], isLoading } = useQuery({
    queryKey: ["faculty"],
    queryFn: facultyService.getAll,
  });
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: facultyService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculty"] });
      toast({ title: "Faculty Member Added", description: "The faculty member has been added successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add faculty member.", variant: "destructive" });
    },
  });

  const handleSubmit = (data: FacultyFormData) => {
    createMutation.mutate({
      facultyId: data.facultyId,
      phoneNumber: data.phoneNumber || undefined,
      dateOfBirth: data.dateOfBirth,
      designation: data.designation,
      qualification: data.qualification || undefined,
      specialization: data.specialization || undefined,
      salary: data.salary,
      departmentId: data.departmentId || undefined,
    });
    setIsFormOpen(false);
  };

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading faculty...</div>;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Faculty</h1>
          <p className="text-sm text-muted-foreground">Manage faculty members and assignments.</p>
        </div>
        <DataTable data={facultyList} columns={columns(departments)} searchKey="lastName" title="All Faculty" addLabel="Add Faculty" onAdd={() => setIsFormOpen(true)} />
      </div>
      <FacultyForm open={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} mode="add" departments={departments} />
    </>
  );
}
