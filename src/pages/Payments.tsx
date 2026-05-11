import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService, PaymentDto } from "@/services/paymentService";
import { studentService, StudentDto } from "@/services/studentService";
import { courseService, CourseDto } from "@/services/courseService";
import { enrollmentService, EnrollmentDto } from "@/services/enrollmentService";
import { PaymentForm, PaymentFormData } from "./payments/PaymentForm";
import { toast } from "@/components/ui/use-toast";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

const columns = [
  { key: "paymentId", label: "Receipt" },
  {
    key: "studentName",
    label: "Student",
    render: (p: PaymentDto) => p.studentName || `Student #${p.studentId}`,
  },
  {
    key: "amount",
    label: "Amount",
    render: (p: PaymentDto) => <span className="font-semibold">${p.amount.toLocaleString()}</span>,
  },
  { key: "paymentType", label: "Type" },
  { key: "paymentMethod", label: "Method" },
  {
    key: "paymentDate",
    label: "Date",
    render: (p: PaymentDto) => new Date(p.paymentDate).toLocaleDateString(),
  },
  {
    key: "status",
    label: "Status",
    render: (p: PaymentDto) => <StatusBadge status={p.status} />,
  },
];

export default function Payments() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: paymentsList = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: paymentService.getAll,
  });
  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: studentService.getAll,
  });
  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: courseService.getAll,
  });
  const { data: enrollments = [] } = useQuery({
    queryKey: ["enrollments"],
    queryFn: enrollmentService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: paymentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast({ title: "Payment Recorded", description: "The payment has been recorded successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to record payment.", variant: "destructive" });
    },
  });

  const handleSubmit = (data: PaymentFormData) => {
    createMutation.mutate({
      studentId: data.studentId,
      amount: data.amount,
      paymentMethod: data.paymentMethod || undefined,
      paymentType: data.paymentType,
      referenceNumber: data.referenceNumber || undefined,
      semester: data.semester || undefined,
      academicYear: data.academicYear || undefined,
      description: data.description || undefined,
    });
    setIsFormOpen(false);
  };

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading payments...</div>;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payments</h1>
            <p className="text-sm text-muted-foreground">Track tuition fees and payment records.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <DataTable data={paymentsList} columns={columns} searchKey="paymentId" title="All Payments" addLabel="Record Payment" onAdd={() => setIsFormOpen(true)} />
      </div>
      <PaymentForm open={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} mode="add" students={students} courses={courses} enrollments={enrollments} />
    </>
  );
}
