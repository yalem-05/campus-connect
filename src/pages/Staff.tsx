import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffService, StaffDto } from "@/services/staffService";
import { departmentService, DepartmentDto } from "@/services/departmentService";
import { StaffForm } from "./Staffs/StaffForm";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Briefcase, Building2, DollarSign, Edit, Trash2 } from "lucide-react";

export default function Staff() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffDto | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: staffList = [], isLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: staffService.getAll,
  });
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: staffService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({ title: "Staff Member Added", description: "The staff member has been added successfully." });
    },
    onError: () => toast({ title: "Error", description: "Failed to add staff member.", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => staffService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({ title: "Staff Member Updated", description: "The staff member has been updated successfully." });
    },
    onError: () => toast({ title: "Error", description: "Failed to update staff member.", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: staffService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({ title: "Staff Member Deleted", description: "The staff member has been removed." });
    },
    onError: () => toast({ title: "Error", description: "Failed to delete staff member.", variant: "destructive" }),
  });

  const columns = [
    { key: "staffId", label: "ID" },
    {
      key: "name",
      label: "Name",
      render: (s: StaffDto) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/10 text-xs font-semibold text-secondary">
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
      key: "position",
      label: "Position",
      render: (s: StaffDto) => (
        <div className="flex items-center gap-1">
          <Briefcase className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{s.position}</span>
        </div>
      ),
    },
    {
      key: "department",
      label: "Department",
      render: (s: StaffDto) => (
        <div className="flex items-center gap-1">
          <Building2 className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{s.departmentName || "—"}</span>
        </div>
      ),
    },
    {
      key: "employmentType",
      label: "Type",
      render: (s: StaffDto) => (
        <Badge variant="outline" className="text-[11px]">{s.employmentType}</Badge>
      ),
    },
    {
      key: "salary",
      label: "Salary",
      render: (s: StaffDto) => (
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{s.salary.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: "hireDate",
      label: "Hire Date",
      render: (s: StaffDto) => new Date(s.hireDate).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (s: StaffDto) => <StatusBadge status={s.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (s: StaffDto) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(s)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeletingId(s.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingStaff(null);
    setIsFormOpen(true);
  };

  const handleEdit = (staff: StaffDto) => {
    setEditingStaff(staff);
    setIsFormOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (editingStaff) {
      const { firstName, lastName, email, staffId, dateOfBirth, ...rest } = data;
      updateMutation.mutate({ id: editingStaff.id, data: rest });
    } else {
      createMutation.mutate(data);
    }
    setIsFormOpen(false);
    setEditingStaff(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingId !== null) {
      deleteMutation.mutate(deletingId);
      setDeletingId(null);
    }
  };

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading staff...</div>;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Staff</h1>
          <p className="text-sm text-muted-foreground">Manage administrative and support staff members.</p>
        </div>
        <DataTable
          data={staffList}
          columns={columns}
          searchKey="lastName"
          title="All Staff Members"
          addLabel="Add Staff"
          onAdd={handleAdd}
        />
      </div>

      <StaffForm
        open={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingStaff(null); }}
        onSubmit={handleSubmit}
        initialData={editingStaff ? {
          staffId: editingStaff.staffId,
          phoneNumber: editingStaff.phoneNumber || "",
          dateOfBirth: editingStaff.dateOfBirth?.split("T")[0] || "",
          position: editingStaff.position,
          departmentId: editingStaff.departmentId || 0,
          employmentType: editingStaff.employmentType as any,
          salary: editingStaff.salary,
          status: editingStaff.status as any,
          supervisor: editingStaff.supervisor,
          officeLocation: editingStaff.officeLocation,
          qualifications: editingStaff.qualifications,
          emergencyContactName: editingStaff.emergencyContactName,
          emergencyContactNumber: editingStaff.emergencyContactNumber,
          address: editingStaff.address,
          city: editingStaff.city,
          state: editingStaff.state,
          zipCode: editingStaff.zipCode,
        } : undefined}
        mode={editingStaff ? "edit" : "add"}
        departments={departments}
      />

      <AlertDialog open={deletingId !== null} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this staff member? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
