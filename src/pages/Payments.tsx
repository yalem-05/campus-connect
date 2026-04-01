import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { payments, students } from "@/data/mockData";

const columns = [
  { key: "paymentId", label: "Payment ID" },
  {
    key: "student",
    label: "Student",
    render: (p: typeof payments[0]) => {
      const s = students.find(st => st.id === p.studentId);
      return s ? `${s.firstName} ${s.lastName}` : "—";
    },
  },
  {
    key: "amount",
    label: "Amount",
    render: (p: typeof payments[0]) => <span className="font-semibold">${p.amount.toLocaleString()}</span>,
  },
  { key: "paymentMethod", label: "Method" },
  { key: "paymentType", label: "Type" },
  {
    key: "paymentDate",
    label: "Date",
    render: (p: typeof payments[0]) => new Date(p.paymentDate).toLocaleDateString(),
  },
  {
    key: "status",
    label: "Status",
    render: (p: typeof payments[0]) => <StatusBadge status={p.status} />,
  },
];

export default function Payments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-sm text-muted-foreground">Track tuition fees and payment records.</p>
      </div>
      <DataTable data={payments} columns={columns} searchKey="paymentId" title="All Payments" addLabel="Record Payment" onAdd={() => {}} />
    </div>
  );
}
