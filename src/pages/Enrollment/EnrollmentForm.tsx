// components/enrollments/EnrollmentForm.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { students, courses } from "@/data/mockData";
import { CalendarIcon, UserIcon, BookOpenIcon, CreditCardIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EnrollmentFormData {
  studentId: number;
  courseId: number;
  semester: string;
  academicYear: number;
  enrollmentDate: string;
  enrollmentStatus: "Enrolled" | "Dropped" | "Completed" | "Pending" | "Waitlisted";
  grade?: string;
  paymentStatus?: "Paid" | "Partial" | "Pending" | "Refunded";
  paymentAmount?: number;
  notes?: string;
}

interface EnrollmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EnrollmentFormData) => void;
  initialData?: Partial<EnrollmentFormData>;
  mode?: "add" | "edit";
}

const defaultFormData: EnrollmentFormData = {
  studentId: 0,
  courseId: 0,
  semester: "",
  academicYear: new Date().getFullYear(),
  enrollmentDate: new Date().toISOString().split('T')[0],
  enrollmentStatus: "Pending",
  grade: "",
  paymentStatus: "Pending",
  paymentAmount: 0,
  notes: "",
};

const semesterOptions = ["Fall", "Spring", "Summer", "Winter"];
const yearOptions = [2023, 2024, 2025, 2026];
const statusOptions = ["Enrolled", "Dropped", "Completed", "Pending", "Waitlisted"];
const paymentStatusOptions = ["Paid", "Partial", "Pending", "Refunded"];
const gradeOptions = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F", "In Progress", "Withdrawn"];

export function EnrollmentForm({ open, onClose, onSubmit, initialData, mode = "add" }: EnrollmentFormProps) {
  const [formData, setFormData] = useState<EnrollmentFormData>({
    ...defaultFormData,
    ...initialData,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EnrollmentFormData, string>>>({});
  const [selectedCourseFee, setSelectedCourseFee] = useState<number>(0);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // Get available students and courses
  const availableStudents = students.filter(s => s.enrollmentStatus === "Active");
  const availableCourses = courses.filter(c => c.isActive);

  // Update fee when course changes
  useEffect(() => {
    if (formData.courseId) {
      const course = courses.find(c => c.id === formData.courseId);
      if (course) {
        setSelectedCourse(course);
        setSelectedCourseFee(course.fee);
        if (!formData.paymentAmount) {
          handleChange("paymentAmount", course.fee);
        }
      }
    } else {
      setSelectedCourse(null);
      setSelectedCourseFee(0);
    }
  }, [formData.courseId]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EnrollmentFormData, string>> = {};

    if (!formData.studentId || formData.studentId === 0) {
      newErrors.studentId = "Please select a student";
    }

    if (!formData.courseId || formData.courseId === 0) {
      newErrors.courseId = "Please select a course";
    }

    if (!formData.semester) {
      newErrors.semester = "Please select a semester";
    }

    if (!formData.academicYear) {
      newErrors.academicYear = "Please select an academic year";
    }

    if (!formData.enrollmentStatus) {
      newErrors.enrollmentStatus = "Please select an enrollment status";
    }

    // Check if student is already enrolled in this course for the semester
    if (formData.studentId && formData.courseId && formData.semester && formData.academicYear) {
      // This would normally check against existing enrollments
      // For now, just validate basic requirements
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

  const handleChange = (field: keyof EnrollmentFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getStudentInfo = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    return student;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "New Course Enrollment" : "Edit Enrollment"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Register a student for a course. Fill in the enrollment details below."
              : "Update the enrollment information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Student and Course Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Enrollment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student *</Label>
                  <Select 
                    value={formData.studentId.toString()} 
                    onValueChange={(v) => handleChange("studentId", parseInt(v))}
                  >
                    <SelectTrigger className={errors.studentId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStudents.map(student => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.studentId} - {student.firstName} {student.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.studentId && <p className="text-xs text-red-500">{errors.studentId}</p>}
                  {formData.studentId > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {getStudentInfo(formData.studentId)?.email} | 
                      Dept: {getStudentInfo(formData.studentId)?.departmentId}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseId">Course *</Label>
                  <Select 
                    value={formData.courseId.toString()} 
                    onValueChange={(v) => handleChange("courseId", parseInt(v))}
                  >
                    <SelectTrigger className={errors.courseId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCourses.map(course => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.courseCode} - {course.courseName} (${course.fee})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.courseId && <p className="text-xs text-red-500">{errors.courseId}</p>}
                  {selectedCourse && (
                    <div className="text-xs text-muted-foreground mt-1 space-y-1">
                      <div>Credits: {selectedCourse.credits} | Level: {selectedCourse.courseLevel}</div>
                      <div className="line-clamp-1">{selectedCourse.description}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Semester and Academic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Academic Period
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester *</Label>
                  <Select 
                    value={formData.semester} 
                    onValueChange={(v) => handleChange("semester", v)}
                  >
                    <SelectTrigger className={errors.semester ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesterOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.semester && <p className="text-xs text-red-500">{errors.semester}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year *</Label>
                  <Select 
                    value={formData.academicYear.toString()} 
                    onValueChange={(v) => handleChange("academicYear", parseInt(v))}
                  >
                    <SelectTrigger className={errors.academicYear ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map(option => (
                        <SelectItem key={option} value={option.toString()}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.academicYear && <p className="text-xs text-red-500">{errors.academicYear}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                  <Input
                    id="enrollmentDate"
                    type="date"
                    value={formData.enrollmentDate}
                    onChange={(e) => handleChange("enrollmentDate", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Status and Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <CreditCardIcon className="h-4 w-4" />
                Status & Payment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enrollmentStatus">Enrollment Status *</Label>
                  <Select 
                    value={formData.enrollmentStatus} 
                    onValueChange={(v: any) => handleChange("enrollmentStatus", v)}
                  >
                    <SelectTrigger className={errors.enrollmentStatus ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.enrollmentStatus && <p className="text-xs text-red-500">{errors.enrollmentStatus}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grade (if completed)</Label>
                  <Select 
                    value={formData.grade} 
                    onValueChange={(v) => handleChange("grade", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select 
                    value={formData.paymentStatus} 
                    onValueChange={(v: any) => handleChange("paymentStatus", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentStatusOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentAmount">Payment Amount ($)</Label>
                  <Input
                    id="paymentAmount"
                    type="number"
                    value={formData.paymentAmount}
                    onChange={(e) => handleChange("paymentAmount", parseFloat(e.target.value))}
                    placeholder="Course fee amount"
                  />
                  {selectedCourseFee > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Course fee: ${selectedCourseFee.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Additional Notes</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes / Comments</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Any special considerations, accommodations, or notes about this enrollment..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Summary Section */}
            {formData.studentId > 0 && formData.courseId > 0 && (
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm">Enrollment Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Student:</span>
                    <span>{getStudentInfo(formData.studentId)?.firstName} {getStudentInfo(formData.studentId)?.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Course:</span>
                    <span>{selectedCourse?.courseCode} - {selectedCourse?.courseName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Period:</span>
                    <span>{formData.semester} {formData.academicYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Fee:</span>
                    <span className="font-semibold">${selectedCourseFee.toLocaleString()}</span>
                  </div>
                  {formData.paymentAmount > 0 && (
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Payment:</span>
                      <Badge variant={formData.paymentAmount === selectedCourseFee ? "default" : "secondary"}>
                        ${formData.paymentAmount.toLocaleString()} 
                        {formData.paymentAmount < selectedCourseFee && ` (${Math.round((formData.paymentAmount / selectedCourseFee) * 100)}% paid)`}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "add" ? "Create Enrollment" : "Update Enrollment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Import Textarea component
