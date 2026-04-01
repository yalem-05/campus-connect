import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Enrolled: "bg-success/10 text-success border-success/20",
  Present: "bg-success/10 text-success border-success/20",
  Completed: "bg-primary/10 text-primary border-primary/20",
  Graduated: "bg-primary/10 text-primary border-primary/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Waitlisted: "bg-warning/10 text-warning border-warning/20",
  Late: "bg-warning/10 text-warning border-warning/20",
  "On Leave": "bg-warning/10 text-warning border-warning/20",
  Inactive: "bg-muted text-muted-foreground border-border",
  Suspended: "bg-destructive/10 text-destructive border-destructive/20",
  Withdrawn: "bg-destructive/10 text-destructive border-destructive/20",
  Dropped: "bg-destructive/10 text-destructive border-destructive/20",
  Absent: "bg-destructive/10 text-destructive border-destructive/20",
  Failed: "bg-destructive/10 text-destructive border-destructive/20",
  Terminated: "bg-destructive/10 text-destructive border-destructive/20",
  Retired: "bg-muted text-muted-foreground border-border",
  Excused: "bg-info/10 text-info border-info/20",
  Refunded: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium", statusColors[status] || "")}>
      {status}
    </Badge>
  );
}
