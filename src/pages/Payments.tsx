import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { paymentService, PaymentDto } from "@/services/paymentService";

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
    render: (p: PaymentDto) => `$${p.amount.toLocaleString()}`,
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
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: paymentService.getAll,
  });

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading payments...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-sm text-muted-foreground">Manage student payments and fees.</p>
      </div>
      <DataTable data={payments} columns={columns} searchKey="studentName" title="All Payments" addLabel="Add Payment" onAdd={() => {}} />
    </div>
  );
}
