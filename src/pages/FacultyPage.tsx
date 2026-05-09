// FacultyPage.tsx (updated)
import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { faculty, departments } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { FacultyForm } from "./Faculity/FaculityForm";
import { toast } from "@/components/ui/use-toast";

const columns = [
  { key: "facultyId", label: "ID" },
  {
    key: "name",
    label: "Name",
    render: (f: typeof faculty[0]) => (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
          {f.firstName.replace("Dr. ", "")[0]}{f.lastName[0]}
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
    render: (f: typeof faculty[0]) => departments.find(d => d.id === f.departmentId)?.departmentName || "—",
  },
  {
    key: "designation",
    label: "Designation",
    render: (f: typeof faculty[0]) => <Badge variant="outline" className="text-[11px]">{f.designation}</Badge>,
  },
  { key: "specialization", label: "Specialization" },
  {
    key: "status",
    label: "Status",
    render: (f: typeof faculty[0]) => <StatusBadge status={f.status} />,
  },
];

export default function FacultyPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [facultyList, setFacultyList] = useState(faculty);

  const handleAddFaculty = () => {
    setIsFormOpen(true);
  };

  const handleSubmitFaculty = (data: any) => {
    // Add Dr. prefix to first name for display purposes
    const newFaculty = {
      id: facultyList.length + 1,
      guid: `f${facultyList.length + 1}`,
      ...data,
      firstName: `Dr. ${data.firstName}`,
      createdDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    
    setFacultyList([...facultyList, newFaculty]);
    
    toast({
      title: "Faculty Member Added",
      description: `${newFaculty.firstName} ${newFaculty.lastName} has been added successfully.`,
    });
    
    setIsFormOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Faculty</h1>
          <p className="text-sm text-muted-foreground">Manage faculty members and assignments.</p>
        </div>
        <DataTable 
          data={facultyList} 
          columns={columns} 
          searchKey="lastName" 
          title="All Faculty" 
          addLabel="Add Faculty" 
          onAdd={handleAddFaculty} 
        />
      </div>

      <FacultyForm 
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitFaculty}
        mode="add"
      />
    </>
  );
}