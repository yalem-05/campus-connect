// components/grades/GradeForm.tsx
import { useState, useEffect } from "react";
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
import { students, courses, enrollments } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { GraduationCapIcon, TrendingUpIcon, AlertCircleIcon } from "lucide-react";

interface GradeFormData {
  studentId: number;
  courseId: number;
  semester: string;
  academicYear: number;
  marksObtained: number;
  totalMarks: number;
  gradeLetter: string;
  gradePoint: number;
  remarks: string;
  gradeDate: string;
  assessmentType?: string;
  attendance?: number;
  assignmentScore?: number;
  examScore?: number;
}

interface GradeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: GradeFormData) => void;
  initialData?: Partial<GradeFormData>;
  mode?: "add" | "edit";
}

const defaultFormData: GradeFormData = {
  studentId: 0,
  courseId: 0,
  semester: "",
  academicYear: new Date().getFullYear(),
  marksObtained: 0,
  totalMarks: 100,
  gradeLetter: "",
  gradePoint: 0,
  remarks: "",
  gradeDate: new Date().toISOString().split('T')[0],
  assessmentType: "Final Exam",
  attendance: 0,
  assignmentScore: 0,
  examScore: 0,
};

const semesterOptions = ["Fall", "Spring", "Summer", "Winter"];
const yearOptions = [2022, 2023, 2024, 2025, 2026];
const assessmentTypes = ["Final Exam", "Midterm", "Assignment", "Project", "Quiz", "Lab Work", "Presentation"];

// Grade mapping function
const calculateGrade = (percentage: number): { letter: string; point: number } => {
  if (percentage >= 97) return { letter: "A+", point: 4.0 };
  if (percentage >= 93) return { letter: "A", point: 4.0 };
  if (percentage >= 90) return { letter: "A-", point: 3.7 };
  if (percentage >= 87) return { letter: "B+", point: 3.3 };
  if (percentage >= 83) return { letter: "B", point: 3.0 };
  if (percentage >= 80) return { letter: "B-", point: 2.7 };
  if (percentage >= 77) return { letter: "C+", point: 2.3 };
  if (percentage >= 73) return { letter: "C", point: 2.0 };
  if (percentage >= 70) return { letter: "C-", point: 1.7 };
  if (percentage >= 67) return { letter: "D+", point: 1.3 };
  if (percentage >= 63) return { letter: "D", point: 1.0 };
  if (percentage >= 60) return { letter: "D-", point: 0.7 };
  return { letter: "F", point: 0.0 };
};

const getGradeColor = (gradeLetter: string): string => {
  if (gradeLetter.startsWith('A')) return "bg-green-100 text-green-800 border-green-200";
  if (gradeLetter.startsWith('B')) return "bg-blue-100 text-blue-800 border-blue-200";
  if (gradeLetter.startsWith('C')) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (gradeLetter.startsWith('D')) return "bg-orange-100 text-orange-800 border-orange-200";
  return "bg-red-100 text-red-800 border-red-200";
};

export function GradeForm({ open, onClose, onSubmit, initialData, mode = "add" }: GradeFormProps) {
  const [formData, setFormData] = useState<GradeFormData>({
    ...defaultFormData,
    ...initialData,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof GradeFormData, string>>>({});
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showWarning, setShowWarning] = useState(false);

  // Get enrolled students and courses
  const enrolledStudents = students.filter(s => s.enrollmentStatus === "Active");
  const availableCourses = courses.filter(c => c.isActive);

  // Auto-calculate grade when marks change
  useEffect(() => {
    if (formData.marksObtained > 0 && formData.totalMarks > 0) {
      const percentage = (formData.marksObtained / formData.totalMarks) * 100;
      const { letter, point } = calculateGrade(percentage);
      
      setFormData(prev => ({
        ...prev,
        gradeLetter: letter,
        gradePoint: point,
      }));
    }
  }, [formData.marksObtained, formData.totalMarks]);

  // Check if student is enrolled in the selected course
  useEffect(() => {
    if (formData.studentId && formData.courseId && formData.semester && formData.academicYear) {
      const isEnrolled = enrollments.some(e => 
        e.studentId === formData.studentId &&
        e.courseId === formData.courseId &&
        e.semester === formData.semester &&
        e.academicYear === formData.academicYear &&
        e.enrollmentStatus === "Enrolled"
      );
      setShowWarning(!isEnrolled);
    }
  }, [formData.studentId, formData.courseId, formData.semester, formData.academicYear]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GradeFormData, string>> = {};

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

    if (formData.marksObtained < 0) {
      newErrors.marksObtained = "Marks cannot be negative";
    }

    if (formData.marksObtained > formData.totalMarks) {
      newErrors.marksObtained = `Marks cannot exceed total marks (${formData.totalMarks})`;
    }

    if (!formData.totalMarks || formData.totalMarks <= 0) {
      newErrors.totalMarks = "Total marks must be greater than 0";
    }

    if (!formData.gradeDate) {
      newErrors.gradeDate = "Grade date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (showWarning) {
        if (!confirm("This student is not officially enrolled in this course for the selected semester. Do you still want to add the grade?")) {
          return;
        }
      }
      onSubmit(formData);
      onClose();
    }
  };

  const handleChange = (field: keyof GradeFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getStudentInfo = (studentId: number) => {
    return students.find(s => s.id === studentId);
  };

  const getCourseInfo = (courseId: number) => {
    return courses.find(c => c.id === courseId);
  };

  const percentage = formData.marksObtained > 0 && formData.totalMarks > 0
    ? ((formData.marksObtained / formData.totalMarks) * 100).toFixed(1)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Student Grade" : "Edit Grade"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Record grades for student assessments and exams."
              : "Update the grade information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Student and Course Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <GraduationCapIcon className="h-4 w-4" />
                Student & Course Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student *</Label>
                  <Select 
                    value={formData.studentId.toString()} 
                    onValueChange={(v) => {
                      handleChange("studentId", parseInt(v));
                      setSelectedStudent(getStudentInfo(parseInt(v)));
                    }}
                  >
                    <SelectTrigger className={errors.studentId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {enrolledStudents.map(student => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.studentId} - {student.firstName} {student.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.studentId && <p className="text-xs text-red-500">{errors.studentId}</p>}
                  {selectedStudent && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedStudent.email} | ID: {selectedStudent.studentId}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseId">Course *</Label>
                  <Select 
                    value={formData.courseId.toString()} 
                    onValueChange={(v) => {
                      handleChange("courseId", parseInt(v));
                      setSelectedCourse(getCourseInfo(parseInt(v)));
                    }}
                  >
                    <SelectTrigger className={errors.courseId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCourses.map(course => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.courseCode} - {course.courseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.courseId && <p className="text-xs text-red-500">{errors.courseId}</p>}
                  {selectedCourse && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Credits: {selectedCourse.credits} | Level: {selectedCourse.courseLevel}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Period */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Academic Period</h3>
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
                  <Label htmlFor="gradeDate">Grade Date *</Label>
                  <Input
                    id="gradeDate"
                    type="date"
                    value={formData.gradeDate}
                    onChange={(e) => handleChange("gradeDate", e.target.value)}
                    className={errors.gradeDate ? "border-red-500" : ""}
                  />
                  {errors.gradeDate && <p className="text-xs text-red-500">{errors.gradeDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assessmentType">Assessment Type</Label>
                  <Select 
                    value={formData.assessmentType} 
                    onValueChange={(v) => handleChange("assessmentType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {assessmentTypes.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Grade Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4" />
                Grade Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marksObtained">Marks Obtained *</Label>
                  <Input
                    id="marksObtained"
                    type="number"
                    value={formData.marksObtained}
                    onChange={(e) => handleChange("marksObtained", parseFloat(e.target.value))}
                    placeholder="85"
                    className={errors.marksObtained ? "border-red-500" : ""}
                  />
                  {errors.marksObtained && <p className="text-xs text-red-500">{errors.marksObtained}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalMarks">Total Marks *</Label>
                  <Input
                    id="totalMarks"
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => handleChange("totalMarks", parseFloat(e.target.value))}
                    placeholder="100"
                    className={errors.totalMarks ? "border-red-500" : ""}
                  />
                  {errors.totalMarks && <p className="text-xs text-red-500">{errors.totalMarks}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Percentage</Label>
                  <div className="text-2xl font-bold text-primary">
                    {percentage}%
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Calculated Grade</Label>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-base px-3 py-1 ${getGradeColor(formData.gradeLetter)}`}>
                      {formData.gradeLetter || "—"}
                    </Badge>
                    {formData.gradePoint > 0 && (
                      <span className="text-sm text-muted-foreground">
                        (GPA: {formData.gradePoint.toFixed(1)})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Scores (Optional) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Detailed Scores (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="attendance">Attendance (%)</Label>
                  <Input
                    id="attendance"
                    type="number"
                    value={formData.attendance}
                    onChange={(e) => handleChange("attendance", parseFloat(e.target.value))}
                    placeholder="90"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignmentScore">Assignment Score</Label>
                  <Input
                    id="assignmentScore"
                    type="number"
                    value={formData.assignmentScore}
                    onChange={(e) => handleChange("assignmentScore", parseFloat(e.target.value))}
                    placeholder="85"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examScore">Exam Score</Label>
                  <Input
                    id="examScore"
                    type="number"
                    value={formData.examScore}
                    onChange={(e) => handleChange("examScore", parseFloat(e.target.value))}
                    placeholder="88"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Remarks & Comments</h3>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                  placeholder="Excellent performance, improvement needed, etc."
                  rows={3}
                />
              </div>
            </div>

            {/* Warning Section */}
            {showWarning && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold">Enrollment Warning</p>
                  <p className="text-xs">This student is not officially enrolled in this course for the selected semester. Adding grades may affect academic records.</p>
                </div>
              </div>
            )}

            {/* Summary Section */}
            {selectedStudent && selectedCourse && (
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm">Grade Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Student:</span>
                    <span>{selectedStudent.firstName} {selectedStudent.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Course:</span>
                    <span>{selectedCourse.courseCode} - {selectedCourse.courseName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Score:</span>
                    <span>{formData.marksObtained}/{formData.totalMarks} ({percentage}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grade:</span>
                    <Badge className={getGradeColor(formData.gradeLetter)}>
                      {formData.gradeLetter} ({formData.gradePoint.toFixed(1)} GPA)
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Period:</span>
                    <span>{formData.semester} {formData.academicYear}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "add" ? "Save Grade" : "Update Grade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}