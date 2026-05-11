import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { Users, Phone, Calendar, Briefcase } from "lucide-react";
import { DepartmentDto } from "@/services/departmentService";

interface StaffFormData {
  staffId: string;
  phoneNumber: string;
  dateOfBirth: string;
  position: string;
  departmentId: number;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Temporary";
  salary: number;
  status: "Active" | "Inactive" | "On Leave" | "Terminated";
  supervisor?: string;
  officeLocation?: string;
  qualifications?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface StaffFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StaffFormData & { firstName: string; lastName: string; email: string }) => void;
  initialData?: Partial<StaffFormData>;
  mode?: "add" | "edit";
  departments: DepartmentDto[];
}

const defaultFormData: StaffFormData = {
  staffId: "",
  phoneNumber: "",
  dateOfBirth: "",
  position: "",
  departmentId: 0,
  employmentType: "Full-time",
  salary: 40000,
  status: "Active",
  supervisor: "",
  officeLocation: "",
  qualifications: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
};

const positionOptions = [
  "Administrative Assistant",
  "Office Manager",
  "Department Coordinator",
  "HR Specialist",
  "Finance Officer",
  "Student Services Coordinator",
  "Library Assistant",
  "IT Support Specialist",
  "Lab Technician",
  "Research Assistant",
  "Marketing Coordinator",
  "Admissions Officer",
  "Registrar Assistant",
  "Facilities Manager",
  "Security Officer"
];

const employmentTypeOptions = ["Full-time", "Part-time", "Contract", "Temporary"];
const statusOptions = ["Active", "Inactive", "On Leave", "Terminated"];

export function StaffForm({ open, onClose, onSubmit, initialData, mode = "add", departments }: StaffFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<StaffFormData>({
    ...defaultFormData,
    ...initialData,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StaffFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StaffFormData, string>> = {};

    if (!formData.staffId?.trim()) newErrors.staffId = "Staff ID is required";
    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.departmentId) newErrors.departmentId = "Department is required";
    if (!formData.employmentType) newErrors.employmentType = "Employment type is required";
    if (!formData.status) newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
      });
      onClose();
    }
  };

  const handleChange = (field: keyof StaffFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Staff Member" : "Edit Staff Member"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Fill in the details below to add a new staff member to the system."
              : "Update the staff member information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="staffId">Staff ID *</Label>
                  <Input
                    id="staffId"
                    value={formData.staffId}
                    onChange={(e) => handleChange("staffId", e.target.value)}
                    placeholder="STF-2024-001"
                    className={errors.staffId ? "border-red-500" : ""}
                  />
                  {errors.staffId && <p className="text-xs text-red-500">{errors.staffId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange("phoneNumber", e.target.value)}
                      placeholder="555-0101"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Employment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Select 
                    value={formData.position} 
                    onValueChange={(v) => handleChange("position", v)}
                  >
                    <SelectTrigger className={errors.position ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positionOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                      <SelectItem value="other">Other (type manually)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.position && <p className="text-xs text-red-500">{errors.position}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departmentId">Department *</Label>
                  <Select 
                    value={formData.departmentId?.toString() || ""} 
                    onValueChange={(v) => handleChange("departmentId", parseInt(v))}
                  >
                    <SelectTrigger className={errors.departmentId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.departmentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.departmentId && <p className="text-xs text-red-500">{errors.departmentId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type *</Label>
                  <Select 
                    value={formData.employmentType} 
                    onValueChange={(v: string) => handleChange("employmentType", v)}
                  >
                    <SelectTrigger className={errors.employmentType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {employmentTypeOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.employmentType && <p className="text-xs text-red-500">{errors.employmentType}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(v: string) => handleChange("status", v)}
                  >
                    <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Annual Salary ($)</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) => handleChange("salary", parseFloat(e.target.value))}
                    placeholder="40000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supervisor">Supervisor</Label>
                  <Input
                    id="supervisor"
                    value={formData.supervisor}
                    onChange={(e) => handleChange("supervisor", e.target.value)}
                    placeholder="Department Head"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officeLocation">Office Location</Label>
                  <Input
                    id="officeLocation"
                    value={formData.officeLocation}
                    onChange={(e) => handleChange("officeLocation", e.target.value)}
                    placeholder="Building A, Room 101"
                  />
                </div>
              </div>
            </div>

            {/* Qualifications Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Qualifications & Skills</h3>
              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualifications / Skills</Label>
                <Textarea
                  id="qualifications"
                  value={formData.qualifications}
                  onChange={(e) => handleChange("qualifications", e.target.value)}
                  placeholder="• Bachelor's Degree in Business Administration&#10;• 3+ years experience in administration&#10;• Proficient in Microsoft Office Suite"
                  rows={3}
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="123 University Ave"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Springfield"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    placeholder="IL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleChange("zipCode", e.target.value)}
                    placeholder="62701"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Contact Name</Label>
                  <Input
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleChange("emergencyContactName", e.target.value)}
                    placeholder="Jane Smith"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContactNumber">Contact Number</Label>
                  <Input
                    id="emergencyContactNumber"
                    value={formData.emergencyContactNumber}
                    onChange={(e) => handleChange("emergencyContactNumber", e.target.value)}
                    placeholder="555-0102"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "add" ? "Add Staff Member" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}