// components/faculty/FacultyForm.tsx
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
import { DepartmentDto } from "@/services/departmentService";

export interface FacultyFormData {
  facultyId: string;
  phoneNumber: string;
  dateOfBirth: string;
  hireDate: string;
  designation: string;
  qualification: string;
  specialization: string;
  salary: number;
  status: "Active" | "Inactive" | "On Leave" | "Retired";
  departmentId: number;
  officeAddress?: string;
  bio?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
}

interface FacultyFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FacultyFormData) => void;
  initialData?: Partial<FacultyFormData>;
  mode?: "add" | "edit";
  departments: DepartmentDto[];
}

const defaultFormData: FacultyFormData = {
  facultyId: "",
  phoneNumber: "",
  dateOfBirth: "",
  hireDate: new Date().toISOString().split('T')[0],
  designation: "",
  qualification: "",
  specialization: "",
  salary: 50000,
  status: "Active",
  departmentId: 1,
  officeAddress: "",
  bio: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
};

const designationOptions = [
  { value: "Professor", label: "Professor" },
  { value: "AssociateProfessor", label: "Associate Professor" },
  { value: "AssistantProfessor", label: "Assistant Professor" },
  { value: "Lecturer", label: "Lecturer" },
];

const statusOptions = ["Active", "Inactive", "On Leave", "Retired"];
const qualificationOptions = [
  "PhD Mathematics",
  "PhD Physics",
  "PhD Chemistry",
  "PhD Computer Science",
  "PhD English Literature",
  "Master's Degree",
  "Bachelor's Degree",
  "Post Graduate Diploma"
];

export function FacultyForm({ open, onClose, onSubmit, initialData, mode = "add", departments }: FacultyFormProps) {
  const [formData, setFormData] = useState<FacultyFormData>({
    ...defaultFormData,
    ...initialData,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FacultyFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FacultyFormData, string>> = {};

    if (!formData.facultyId?.trim()) newErrors.facultyId = "Faculty ID is required";
    if (!formData.departmentId) newErrors.departmentId = "Department is required";
    if (!formData.designation) newErrors.designation = "Designation is required";
    if (!formData.specialization?.trim()) newErrors.specialization = "Specialization is required";
    if (!formData.qualification) newErrors.qualification = "Qualification is required";
    if (formData.salary && formData.salary < 0) newErrors.salary = "Salary must be positive";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleChange = (field: keyof FacultyFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Faculty Member" : "Edit Faculty Member"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Fill in the details below to add a new faculty member to the system."
              : "Update the faculty member information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facultyId">Faculty ID *</Label>
                  <Input
                    id="facultyId"
                    value={formData.facultyId}
                    onChange={(e) => handleChange("facultyId", e.target.value)}
                    placeholder="FAC-001"
                    className={errors.facultyId ? "border-red-500" : ""}
                  />
                  {errors.facultyId && <p className="text-xs text-red-500">{errors.facultyId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    placeholder="555-2002"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departmentId">Department *</Label>
                  <Select 
                    value={formData.departmentId.toString()} 
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
                  <Label htmlFor="designation">Designation *</Label>
                  <Select 
                    value={formData.designation} 
                    onValueChange={(v) => handleChange("designation", v)}
                  >
                    <SelectTrigger className={errors.designation ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {designationOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.designation && <p className="text-xs text-red-500">{errors.designation}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification *</Label>
                  <Select 
                    value={formData.qualification} 
                    onValueChange={(v) => handleChange("qualification", v)}
                  >
                    <SelectTrigger className={errors.qualification ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualificationOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.qualification && <p className="text-xs text-red-500">{errors.qualification}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => handleChange("specialization", e.target.value)}
                    placeholder="Algebra, Quantum Physics, etc."
                    className={errors.specialization ? "border-red-500" : ""}
                  />
                  {errors.specialization && <p className="text-xs text-red-500">{errors.specialization}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hireDate">Hire Date</Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => handleChange("hireDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Annual Salary ($)</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) => handleChange("salary", parseFloat(e.target.value))}
                    placeholder="95000"
                    className={errors.salary ? "border-red-500" : ""}
                  />
                  {errors.salary && <p className="text-xs text-red-500">{errors.salary}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(v: string) => handleChange("status", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="officeAddress">Office Address</Label>
                  <Textarea
                    id="officeAddress"
                    value={formData.officeAddress}
                    onChange={(e) => handleChange("officeAddress", e.target.value)}
                    placeholder="Room 201, Science Building"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biography / Research Interests</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Research interests in algebraic geometry, published works in..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={(e) => handleChange("emergencyContactName", e.target.value)}
                      placeholder="Robert Garcia"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactNumber">Emergency Contact Number</Label>
                    <Input
                      id="emergencyContactNumber"
                      value={formData.emergencyContactNumber}
                      onChange={(e) => handleChange("emergencyContactNumber", e.target.value)}
                      placeholder="555-2003"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "add" ? "Add Faculty Member" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}