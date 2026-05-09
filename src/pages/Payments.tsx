// Payments.tsx (updated)
import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { payments as initialPayments, students } from "@/data/mockData";
import { PaymentForm } from "./payments/PaymentForm";
import { toast } from "@/components/ui/use-toast";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

const columns = [
  { key: "paymentId", label: "Payment ID" },
  {
    key: "student",
    label: "Student",
    render: (p: typeof initialPayments[0]) => {
      const s = students.find(st => st.id === p.studentId);
      return s ? `${s.firstName} ${s.lastName}` : "—";
    },
  },
  {
    key: "amount",
    label: "Amount",
    render: (p: typeof initialPayments[0]) => <span className="font-semibold">${p.amount.toLocaleString()}</span>,
  },
  { key: "paymentMethod", label: "Method" },
  { key: "paymentType", label: "Type" },
  {
    key: "paymentDate",
    label: "Date",
    render: (p: typeof initialPayments[0]) => new Date(p.paymentDate).toLocaleDateString(),
  },
  {
    key: "status",
    label: "Status",
    render: (p: typeof initialPayments[0]) => <StatusBadge status={p.status} />,
  },
];

export default function Payments() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [paymentsList, setPaymentsList] = useState(initialPayments);

  const handleAddPayment = () => {
    setIsFormOpen(true);
  };

  const handleSubmitPayment = (data: any) => {
    const newPayment = {
      id: paymentsList.length + 1,
      guid: `p${paymentsList.length + 1}`,
      ...data,
      createdDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    
    setPaymentsList([...paymentsList, newPayment]);
    
    const student = students.find(s => s.id === data.studentId);
    
    toast({
      title: "Payment Recorded",
      description: `${data.paymentType} payment of $${data.amount.toLocaleString()} recorded for ${student?.firstName} ${student?.lastName}.`,
    });
    
    setIsFormOpen(false);
  };

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
        <DataTable 
          data={paymentsList} 
          columns={columns} 
          searchKey="paymentId" 
          title="All Payments" 
          addLabel="Record Payment" 
          onAdd={handleAddPayment} 
        />
      </div>

      <PaymentForm 
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitPayment}
        mode="add"
      />
    </>
  );
}