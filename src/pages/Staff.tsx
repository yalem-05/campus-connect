// Staff.tsx
import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { staff as initialStaff, departments } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { StaffForm } from "./Staffs/StaffForm";
import { toast } from "@/components/ui/use-toast";
import { Briefcase, Building2, Calendar, DollarSign } from "lucide-react";

const columns = [
  { key: "staffId", label: "ID" },
  {
    key: "name",
    label: "Name",
    render: (s: typeof initialStaff[0]) => (
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
    render: (s: typeof initialStaff[0]) => (
      <div className="flex items-center gap-1">
        <Briefcase className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{s.position}</span>
      </div>
    ),
  },
  {
    key: "department",
    label: "Department",
    render: (s: typeof initialStaff[0]) => (
      <div className="flex items-center gap-1">
        <Building2 className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{s.department}</span>
      </div>
    ),
  },
  {
    key: "employmentType",
    label: "Type",
    render: (s: typeof initialStaff[0]) => (
      <Badge variant="outline" className="text-[11px]">
        {s.employmentType}
      </Badge>
    ),
  },
  {
    key: "salary",
    label: "Salary",
    render: (s: typeof initialStaff[0]) => (
      <div className="flex items-center gap-1">
        <DollarSign className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{s.salary.toLocaleString()}</span>
      </div>
    ),
  },
  {
    key: "hireDate",
    label: "Hire Date",
    render: (s: typeof initialStaff[0]) => new Date(s.hireDate).toLocaleDateString(),
  },
  {
    key: "status",
    label: "Status",
    render: (s: typeof initialStaff[0]) => <StatusBadge status={s.status} />,
  },
];

// Sample staff data (add this to your mockData.ts)
const sampleStaffData = [
  { 
    id: 1, 
    guid: "st1", 
    staffId: "STF-001", 
    firstName: "John", 
    lastName: "Smith", 
    email: "john.smith@university.edu", 
    phoneNumber: "555-0101", 
    dateOfBirth: "1985-05-15", 
    hireDate: "2020-01-15", 
    position: "Administrative Assistant", 
    department: "Computer Science", 
    employmentType: "Full-time", 
    salary: 45000, 
    status: "Active", 
    supervisor: "Dr. Alan Turing", 
    officeLocation: "Building A, Room 101", 
    qualifications: "Bachelor's Degree in Business Administration, 5 years experience", 
    emergencyContactName: "Sarah Smith", 
    emergencyContactNumber: "555-0102", 
    address: "123 Main St", 
    city: "Springfield", 
    state: "IL", 
    zipCode: "62701", 
    createdDate: "2020-01-15", 
    isActive: true 
  },
  { 
    id: 2, 
    guid: "st2", 
    staffId: "STF-002", 
    firstName: "Mary", 
    lastName: "Johnson", 
    email: "mary.johnson@university.edu", 
    phoneNumber: "555-0103", 
    dateOfBirth: "1990-08-22", 
    hireDate: "2021-06-01", 
    position: "Student Services Coordinator", 
    department: "Student Affairs", 
    employmentType: "Full-time", 
    salary: 52000, 
    status: "Active", 
    supervisor: "Dr. Jane Wilson", 
    officeLocation: "Student Center, Room 205", 
    qualifications: "Master's in Counseling, 3 years experience", 
    emergencyContactName: "Robert Johnson", 
    emergencyContactNumber: "555-0104", 
    address: "456 Oak Ave", 
    city: "Springfield", 
    state: "IL", 
    zipCode: "62702", 
    createdDate: "2021-06-01", 
    isActive: true 
  },
  { 
    id: 3, 
    guid: "st3", 
    staffId: "STF-003", 
    firstName: "Robert", 
    lastName: "Williams", 
    email: "robert.williams@university.edu", 
    phoneNumber: "555-0105", 
    dateOfBirth: "1978-11-10", 
    hireDate: "2019-03-20", 
    position: "IT Support Specialist", 
    department: "Information Technology", 
    employmentType: "Full-time", 
    salary: 58000, 
    status: "Active", 
    supervisor: "CIO Office", 
    officeLocation: "Tech Center, Room 301", 
    qualifications: "Bachelor's in IT, CompTIA Certified", 
    emergencyContactName: "Lisa Williams", 
    emergencyContactNumber: "555-0106", 
    address: "789 Pine St", 
    city: "Springfield", 
    state: "IL", 
    zipCode: "62703", 
    createdDate: "2019-03-20", 
    isActive: true 
  }
];

export default function Staff() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [staffList, setStaffList] = useState(initialStaff || sampleStaffData);

  const handleAddStaff = () => {
    setIsFormOpen(true);
  };

  const handleSubmitStaff = (data: any) => {
    const newStaff = {
      id: staffList.length + 1,
      guid: `st${staffList.length + 1}`,
      ...data,
      createdDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    
    setStaffList([...staffList, newStaff]);
    
    toast({
      title: "Staff Member Added",
      description: `${newStaff.firstName} ${newStaff.lastName} has been added as ${newStaff.position}.`,
    });
    
    setIsFormOpen(false);
  };

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
          onAdd={handleAddStaff} 
        />
      </div>

      <StaffForm 
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitStaff}
        mode="add"
      />
    </>
  );
}