// components/payments/PaymentForm.tsx
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
import { students, enrollments, courses } from "@/data/mockData";
import { DollarSign, CreditCard, Calendar, UserIcon, FileText, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface PaymentFormData {
  paymentId: string;
  studentId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  paymentType: string;
  referenceNumber: string;
  status: "Completed" | "Pending" | "Failed" | "Refunded" | "Processing";
  semester: string;
  academicYear: number;
  description: string;
  enrollmentId?: number;
  courseId?: number;
  transactionId?: string;
  notes?: string;
}

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentFormData) => void;
  initialData?: Partial<PaymentFormData>;
  mode?: "add" | "edit";
}

const defaultFormData: PaymentFormData = {
  paymentId: "",
  studentId: 0,
  amount: 0,
  paymentDate: new Date().toISOString().split('T')[0],
  paymentMethod: "",
  paymentType: "",
  referenceNumber: "",
  status: "Pending",
  semester: "",
  academicYear: new Date().getFullYear(),
  description: "",
  enrollmentId: undefined,
  courseId: undefined,
  transactionId: "",
  notes: "",
};

const paymentMethods = [
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Cash",
  "Check",
  "Online Banking",
  "Wallet",
  "Scholarship",
  "Financial Aid"
];

const paymentTypes = [
  "Tuition",
  "Registration Fee",
  "Library Fee",
  "Lab Fee",
  "Sports Fee",
  "Hostel Fee",
  "Transport Fee",
  "Exam Fee",
  "Late Fee",
  "Scholarship",
  "Refund"
];

const statusOptions = ["Completed", "Pending", "Processing", "Failed", "Refunded"];
const semesterOptions = ["Fall", "Spring", "Summer", "Winter"];
const yearOptions = [2022, 2023, 2024, 2025, 2026];

export function PaymentForm({ open, onClose, onSubmit, initialData, mode = "add" }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    ...defaultFormData,
    ...initialData,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PaymentFormData, string>>>({});
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [outstandingBalance, setOutstandingBalance] = useState<number>(0);
  const [showBalanceWarning, setShowBalanceWarning] = useState(false);

  // Get active students
  const activeStudents = students.filter(s => s.enrollmentStatus === "Active");

  // Calculate outstanding balance for selected student
  useEffect(() => {
    if (formData.studentId) {
      const student = students.find(s => s.id === formData.studentId);
      setSelectedStudent(student);
      
      // Calculate total fees from enrollments
      const studentEnrollments = enrollments.filter(e => e.studentId === formData.studentId);
      const totalFees = studentEnrollments.reduce((total, enrollment) => {
        const course = courses.find(c => c.id === enrollment.courseId);
        return total + (course?.fee || 0);
      }, 0);
      
      // This would normally fetch from API
      // For now, using mock calculation
      setOutstandingBalance(totalFees);
      setShowBalanceWarning(formData.amount > (totalFees * 0.5) && totalFees > 0);
    }
  }, [formData.studentId, formData.amount]);

  // Auto-generate payment ID
  useEffect(() => {
    if (mode === "add" && !formData.paymentId) {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setFormData(prev => ({
        ...prev,
        paymentId: `PAY-${year}-${random}`
      }));
    }
  }, [mode]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentFormData, string>> = {};

    if (!formData.studentId || formData.studentId === 0) {
      newErrors.studentId = "Please select a student";
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (formData.amount > 100000) {
      newErrors.amount = "Amount exceeds maximum limit";
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Please select payment method";
    }

    if (!formData.paymentType) {
      newErrors.paymentType = "Please select payment type";
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate = "Payment date is required";
    }

    if (!formData.semester) {
      newErrors.semester = "Please select semester";
    }

    if (!formData.academicYear) {
      newErrors.academicYear = "Please select academic year";
    }

    if (formData.referenceNumber && formData.referenceNumber.length < 3) {
      newErrors.referenceNumber = "Reference number too short";
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

  const handleChange = (field: keyof PaymentFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getAmountColor = () => {
    if (formData.amount > 5000) return "text-orange-600";
    if (formData.amount > 2000) return "text-blue-600";
    return "text-green-600";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Record New Payment" : "Edit Payment"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Record a tuition fee payment or other charges for a student."
              : "Update the payment information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Payment Summary */}
            {mode === "add" && formData.amount > 0 && (
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Amount</p>
                    <p className={`text-3xl font-bold ${getAmountColor()}`}>
                      ${formData.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Payment ID</p>
                    <p className="font-mono text-sm">{formData.paymentId || "Auto-generated"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Student Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Student Information
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
                      {activeStudents.map(student => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.studentId} - {student.firstName} {student.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.studentId && <p className="text-xs text-red-500">{errors.studentId}</p>}
                  {selectedStudent && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedStudent.email} | Dept ID: {selectedStudent.departmentId}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentId">Payment ID</Label>
                  <Input
                    id="paymentId"
                    value={formData.paymentId}
                    onChange={(e) => handleChange("paymentId", e.target.value)}
                    placeholder="PAY-2024-001"
                    disabled={mode === "add"}
                  />
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Payment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
                      placeholder="1500"
                      className={`pl-9 ${errors.amount ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Select 
                      value={formData.paymentMethod} 
                      onValueChange={(v) => handleChange("paymentMethod", v)}
                    >
                      <SelectTrigger className={`pl-9 ${errors.paymentMethod ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map(method => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.paymentMethod && <p className="text-xs text-red-500">{errors.paymentMethod}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentType">Payment Type *</Label>
                  <Select 
                    value={formData.paymentType} 
                    onValueChange={(v) => handleChange("paymentType", v)}
                  >
                    <SelectTrigger className={errors.paymentType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.paymentType && <p className="text-xs text-red-500">{errors.paymentType}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Payment Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(v: any) => handleChange("status", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Academic Period */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
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
                  <Label htmlFor="paymentDate">Payment Date *</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => handleChange("paymentDate", e.target.value)}
                    className={errors.paymentDate ? "border-red-500" : ""}
                  />
                  {errors.paymentDate && <p className="text-xs text-red-500">{errors.paymentDate}</p>}
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Transaction Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="referenceNumber">Reference Number</Label>
                  <Input
                    id="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={(e) => handleChange("referenceNumber", e.target.value)}
                    placeholder="REF-001"
                  />
                  {errors.referenceNumber && <p className="text-xs text-red-500">{errors.referenceNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transactionId">Transaction ID</Label>
                  <Input
                    id="transactionId"
                    value={formData.transactionId}
                    onChange={(e) => handleChange("transactionId", e.target.value)}
                    placeholder="TXN123456789"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Fall 2024 tuition payment"
                    rows={2}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Any additional information about this payment..."
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Warning Section */}
            {showBalanceWarning && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold">Large Payment Amount</p>
                  <p className="text-xs">This payment amount exceeds 50% of the estimated total fees. Please verify the amount.</p>
                </div>
              </div>
            )}

            {/* Summary Section */}
            {selectedStudent && (
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm">Payment Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Student:</span>
                    <span>{selectedStudent.firstName} {selectedStudent.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Student ID:</span>
                    <span>{selectedStudent.studentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment For:</span>
                    <span>{formData.semester} {formData.academicYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="outline">{formData.paymentType}</Badge>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-bold text-lg">${formData.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method:</span>
                    <span>{formData.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <StatusBadge status={formData.status} />
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
              {mode === "add" ? "Record Payment" : "Update Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}