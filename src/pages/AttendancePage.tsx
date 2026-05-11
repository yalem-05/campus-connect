import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceService, AttendanceDto } from "@/services/attendanceService";
import { studentService, StudentDto } from "@/services/studentService";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const columns = [
  { key: "id", label: "ID" },
  {
    key: "studentName",
    label: "Student",
    render: (a: AttendanceDto) => a.studentName || `Student #${a.studentId}`,
  },
  {
    key: "courseName",
    label: "Course",
    render: (a: AttendanceDto) => a.courseName || `Schedule #${a.courseScheduleId}`,
  },
  {
    key: "attendanceDate",
    label: "Date",
    render: (a: AttendanceDto) => new Date(a.attendanceDate).toLocaleDateString(),
  },
  {
    key: "status",
    label: "Status",
    render: (a: AttendanceDto) => <StatusBadge status={a.status} />,
  },
];

const statusOptions = ["Present", "Absent", "Late", "Excused"];

export default function AttendancePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ studentId: "", courseScheduleId: "", attendanceDate: new Date().toISOString().split('T')[0], status: "Present", remarks: "" });
  const queryClient = useQueryClient();

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["attendance"],
    queryFn: attendanceService.getAll,
  });
  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: studentService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: attendanceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast({ title: "Attendance Marked", description: "Attendance record has been created." });
      setIsFormOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to mark attendance.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      studentId: parseInt(formData.studentId),
      courseScheduleId: parseInt(formData.courseScheduleId),
      attendanceDate: formData.attendanceDate,
      status: formData.status,
      remarks: formData.remarks || undefined,
    });
  };

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading attendance...</div>;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-sm text-muted-foreground">Track and manage student attendance records.</p>
        </div>
        <DataTable data={records} columns={columns} searchKey="studentName" title="Attendance Records" addLabel="Mark Attendance" onAdd={() => setIsFormOpen(true)} />
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
            <DialogDescription>Record attendance for a student.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Student</Label>
              <Select value={formData.studentId} onValueChange={(v) => setFormData(p => ({ ...p, studentId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>
                  {(students as StudentDto[]).map((s: StudentDto) => (
                    <SelectItem key={s.id} value={s.id.toString()}>{s.firstName} {s.lastName} ({s.studentId})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Course Schedule ID</Label>
              <Input type="number" value={formData.courseScheduleId} onChange={(e) => setFormData(p => ({ ...p, courseScheduleId: e.target.value }))} placeholder="1" />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={formData.attendanceDate} onChange={(e) => setFormData(p => ({ ...p, attendanceDate: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData(p => ({ ...p, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statusOptions.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Input value={formData.remarks} onChange={(e) => setFormData(p => ({ ...p, remarks: e.target.value }))} placeholder="Optional notes" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
