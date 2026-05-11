// components/courses/CourseForm.tsx
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

export interface CourseFormData {
  courseCode: string;
  courseName: string;
  description: string;
  credits: number;
  durationInHours: number;
  courseLevel: "Beginner" | "Intermediate" | "Advanced";
  prerequisites: string;
  fee: number;
  departmentId: number;
  startDate?: string;
  endDate?: string;
  maxStudents?: number;
  syllabus?: string;
  learningOutcomes?: string;
}

interface CourseFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CourseFormData) => void;
  initialData?: Partial<CourseFormData>;
  mode?: "add" | "edit";
  departments: DepartmentDto[];
}

const defaultFormData: CourseFormData = {
  courseCode: "",
  courseName: "",
  description: "",
  credits: 3,
  durationInHours: 45,
  courseLevel: "Beginner",
  prerequisites: "None",
  fee: 1500,
  departmentId: 1,
  startDate: "",
  endDate: "",
  maxStudents: 30,
  syllabus: "",
  learningOutcomes: "",
};

const levelOptions = ["Beginner", "Intermediate", "Advanced"];
const creditOptions = [1, 2, 3, 4, 5, 6];
const durationOptions = [15, 30, 45, 60, 90, 120];

export function CourseForm({ open, onClose, onSubmit, initialData, mode = "add", departments }: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    ...defaultFormData,
    ...initialData,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CourseFormData, string>> = {};

    if (!formData.courseCode?.trim()) {
      newErrors.courseCode = "Course code is required";
    } else if (!/^[A-Z]{2,4}\d{3}$/.test(formData.courseCode)) {
      newErrors.courseCode = "Invalid format. Use e.g., CS101, MATH201";
    }

    if (!formData.courseName?.trim()) {
      newErrors.courseName = "Course name is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.credits) {
      newErrors.credits = "Credits are required";
    } else if (formData.credits < 1 || formData.credits > 6) {
      newErrors.credits = "Credits must be between 1 and 6";
    }

    if (!formData.durationInHours) {
      newErrors.durationInHours = "Duration is required";
    } else if (formData.durationInHours < 15) {
      newErrors.durationInHours = "Minimum duration is 15 hours";
    }

    if (!formData.fee || formData.fee < 0) {
      newErrors.fee = "Valid fee amount is required";
    }

    if (!formData.departmentId) {
      newErrors.departmentId = "Department is required";
    }

    if (!formData.courseLevel) {
      newErrors.courseLevel = "Course level is required";
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

  const handleChange = (field: keyof CourseFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Course" : "Edit Course"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Fill in the details below to add a new course to the catalog."
              : "Update the course information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Course Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="courseCode">Course Code *</Label>
                  <Input
                    id="courseCode"
                    value={formData.courseCode}
                    onChange={(e) => handleChange("courseCode", e.target.value.toUpperCase())}
                    placeholder="CS101"
                    className={errors.courseCode ? "border-red-500" : ""}
                  />
                  {errors.courseCode && <p className="text-xs text-red-500">{errors.courseCode}</p>}
                  <p className="text-xs text-muted-foreground">Format: 2-4 letters followed by 3 digits (e.g., CS101, MATH201)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name *</Label>
                  <Input
                    id="courseName"
                    value={formData.courseName}
                    onChange={(e) => handleChange("courseName", e.target.value)}
                    placeholder="Introduction to Programming"
                    className={errors.courseName ? "border-red-500" : ""}
                  />
                  {errors.courseName && <p className="text-xs text-red-500">{errors.courseName}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Provide a detailed description of the course content and objectives..."
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

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Academic Information</h3>
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
                  <Label htmlFor="courseLevel">Course Level *</Label>
                  <Select 
                    value={formData.courseLevel} 
                    onValueChange={(v: string) => handleChange("courseLevel", v)}
                  >
                    <SelectTrigger className={errors.courseLevel ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levelOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.courseLevel && <p className="text-xs text-red-500">{errors.courseLevel}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credits">Credits *</Label>
                  <Select 
                    value={formData.credits.toString()} 
                    onValueChange={(v) => handleChange("credits", parseInt(v))}
                  >
                    <SelectTrigger className={errors.credits ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select credits" />
                    </SelectTrigger>
                    <SelectContent>
                      {creditOptions.map(option => (
                        <SelectItem key={option} value={option.toString()}>
                          {option} credit{option > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.credits && <p className="text-xs text-red-500">{errors.credits}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="durationInHours">Duration (Hours) *</Label>
                  <Select 
                    value={formData.durationInHours.toString()} 
                    onValueChange={(v) => handleChange("durationInHours", parseInt(v))}
                  >
                    <SelectTrigger className={errors.durationInHours ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map(option => (
                        <SelectItem key={option} value={option.toString()}>
                          {option} hours
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.durationInHours && <p className="text-xs text-red-500">{errors.durationInHours}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prerequisites">Prerequisites</Label>
                  <Input
                    id="prerequisites"
                    value={formData.prerequisites}
                    onChange={(e) => handleChange("prerequisites", e.target.value)}
                    placeholder="CS101, or equivalent knowledge"
                  />
                  <p className="text-xs text-muted-foreground">List any required prior courses or knowledge</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fee">Course Fee ($) *</Label>
                  <Input
                    id="fee"
                    type="number"
                    value={formData.fee}
                    onChange={(e) => handleChange("fee", parseFloat(e.target.value))}
                    placeholder="1500"
                    className={errors.fee ? "border-red-500" : ""}
                  />
                  {errors.fee && <p className="text-xs text-red-500">{errors.fee}</p>}
                </div>
              </div>
            </div>

            {/* Schedule Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Schedule Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Maximum Students</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) => handleChange("maxStudents", parseInt(e.target.value))}
                    placeholder="30"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Additional Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="syllabus">Syllabus / Topics Covered</Label>
                  <Textarea
                    id="syllabus"
                    value={formData.syllabus}
                    onChange={(e) => handleChange("syllabus", e.target.value)}
                    placeholder="Week 1: Introduction to Python&#10;Week 2: Variables and Data Types&#10;Week 3: Control Flow..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="learningOutcomes">Learning Outcomes</Label>
                  <Textarea
                    id="learningOutcomes"
                    value={formData.learningOutcomes}
                    onChange={(e) => handleChange("learningOutcomes", e.target.value)}
                    placeholder="By the end of this course, students will be able to:&#10;• Write basic Python programs&#10;• Understand programming concepts&#10;• Debug simple programs..."
                    rows={3}
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
              {mode === "add" ? "Add Course" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}