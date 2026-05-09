// components/departments/DepartmentForm.tsx
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
import { Building2, Mail, Phone, UserIcon } from "lucide-react";

interface DepartmentFormData {
  departmentCode: string;
  departmentName: string;
  description: string;
  headOfDepartment: string;
  contactEmail: string;
  contactPhone: string;
  officeLocation?: string;
  establishedYear?: number;
  budget?: number;
  mission?: string;
  vision?: string;
}

interface DepartmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DepartmentFormData) => void;
  initialData?: Partial<DepartmentFormData>;
  mode?: "add" | "edit";
}

const defaultFormData: DepartmentFormData = {
  departmentCode: "",
  departmentName: "",
  description: "",
  headOfDepartment: "",
  contactEmail: "",
  contactPhone: "",
  officeLocation: "",
  establishedYear: new Date().getFullYear(),
  budget: 0,
  mission: "",
  vision: "",
};

const facultyHeads = [
  "Dr. Alan Turing",
  "Dr. Marie Curie",
  "Dr. Albert Einstein",
  "Dr. Jane Goodall",
  "Dr. Richard Feynman",
  "Prof. Ada Lovelace",
  "Dr. Katherine Johnson",
  "Prof. Stephen Hawking"
];

export function DepartmentForm({ open, onClose, onSubmit, initialData, mode = "add" }: DepartmentFormProps) {
  const [formData, setFormData] = useState<DepartmentFormData>({
    ...defaultFormData,
    ...initialData,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof DepartmentFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DepartmentFormData, string>> = {};

    if (!formData.departmentCode?.trim()) {
      newErrors.departmentCode = "Department code is required";
    } else if (!/^[A-Z]{2,4}$/.test(formData.departmentCode)) {
      newErrors.departmentCode = "Code must be 2-4 uppercase letters (e.g., CS, MATH)";
    }

    if (!formData.departmentName?.trim()) {
      newErrors.departmentName = "Department name is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.headOfDepartment?.trim()) {
      newErrors.headOfDepartment = "Head of Department is required";
    }

    if (!formData.contactEmail?.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!formData.contactEmail.includes("@") || !formData.contactEmail.includes(".")) {
      newErrors.contactEmail = "Invalid email format";
    }

    if (!formData.contactPhone?.trim()) {
      newErrors.contactPhone = "Contact phone is required";
    }

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

  const handleChange = (field: keyof DepartmentFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Department" : "Edit Department"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Create a new academic department. Fill in the details below."
              : "Update the department information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departmentCode">Department Code *</Label>
                  <Input
                    id="departmentCode"
                    value={formData.departmentCode}
                    onChange={(e) => handleChange("departmentCode", e.target.value.toUpperCase())}
                    placeholder="CS"
                    className={errors.departmentCode ? "border-red-500" : ""}
                  />
                  {errors.departmentCode && <p className="text-xs text-red-500">{errors.departmentCode}</p>}
                  <p className="text-xs text-muted-foreground">2-4 uppercase letters (e.g., CS, MATH, ENGL)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departmentName">Department Name *</Label>
                  <Input
                    id="departmentName"
                    value={formData.departmentName}
                    onChange={(e) => handleChange("departmentName", e.target.value)}
                    placeholder="Computer Science"
                    className={errors.departmentName ? "border-red-500" : ""}
                  />
                  {errors.departmentName && <p className="text-xs text-red-500">{errors.departmentName}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Provide a detailed description of the department's focus, goals, and offerings..."
                    rows={3}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/20+ characters
                  </p>
                </div>
              </div>
            </div>

            {/* Leadership & Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Leadership & Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="headOfDepartment">Head of Department *</Label>
                  <Select 
                    value={formData.headOfDepartment} 
                    onValueChange={(v) => handleChange("headOfDepartment", v)}
                  >
                    <SelectTrigger className={errors.headOfDepartment ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select or enter name" />
                    </SelectTrigger>
                    <SelectContent>
                      {facultyHeads.map(name => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                      <SelectItem value="other">Other (type manually)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.headOfDepartment && <p className="text-xs text-red-500">{errors.headOfDepartment}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officeLocation">Office Location</Label>
                  <Input
                    id="officeLocation"
                    value={formData.officeLocation}
                    onChange={(e) => handleChange("officeLocation", e.target.value)}
                    placeholder="Building A, Room 201"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleChange("contactEmail", e.target.value)}
                      placeholder="cs@university.edu"
                      className={`pl-9 ${errors.contactEmail ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.contactEmail && <p className="text-xs text-red-500">{errors.contactEmail}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => handleChange("contactPhone", e.target.value)}
                      placeholder="555-0101"
                      className={`pl-9 ${errors.contactPhone ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.contactPhone && <p className="text-xs text-red-500">{errors.contactPhone}</p>}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => handleChange("establishedYear", parseInt(e.target.value))}
                    placeholder="2024"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Annual Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleChange("budget", parseFloat(e.target.value))}
                    placeholder="1000000"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="mission">Mission Statement</Label>
                  <Textarea
                    id="mission"
                    value={formData.mission}
                    onChange={(e) => handleChange("mission", e.target.value)}
                    placeholder="To provide excellence in education and research..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="vision">Vision Statement</Label>
                  <Textarea
                    id="vision"
                    value={formData.vision}
                    onChange={(e) => handleChange("vision", e.target.value)}
                    placeholder="To be a leading department in the field..."
                    rows={2}
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
              {mode === "add" ? "Create Department" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}