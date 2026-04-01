import { useAuth } from "@/context/AuthContext";
import { FileText, Users, Calendar, Bell, ClipboardList, Building2, Settings, MessageSquare, TrendingUp, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { announcements, students, faculty } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StaffDashboard() {
  const { user } = useAuth();

  const pendingTasks = [
    { task: "Verify student documents", priority: "High", due: "Apr 2, 2026" },
    { task: "Process enrollment requests", priority: "Medium", due: "Apr 3, 2026" },
    { task: "Update faculty records", priority: "Low", due: "Apr 5, 2026" },
  ];

  const recentAnnouncements = announcements.slice(0, 4);

  const stats = [
    { title: "Pending Tasks", value: 12, subtitle: "Requires attention", icon: ClipboardList, variant: "primary" as const },
    { title: "Active Announcements", value: 5, subtitle: "Published", icon: Bell, variant: "accent" as const },
    { title: "Documents Processed", value: 45, subtitle: "This month", icon: FileText, variant: "warning" as const },
    { title: "Total Users", value: 234, subtitle: "All roles", icon: Users, variant: "default" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.firstName}! Manage administrative tasks.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </Button>
          <Button size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Announcements
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-card animate-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Pending Tasks</h3>
            </div>
            <span className="text-xs text-muted-foreground">{pendingTasks.length} tasks</span>
          </div>
          <div className="space-y-4">
            {pendingTasks.map((task, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{task.task}</p>
                  <p className="text-xs text-muted-foreground">Due: {task.due}</p>
                </div>
                <Badge variant={task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "secondary"}>
                  {task.priority}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">
              View All Tasks
            </Button>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card animate-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Recent Announcements</h3>
            </div>
            <span className="text-xs text-muted-foreground">{announcements.length} total</span>
          </div>
          <div className="space-y-4">
            {recentAnnouncements.map((a) => (
              <div key={a.id} className="rounded-lg bg-muted/30 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{a.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{a.content}</p>
                  </div>
                  <StatusBadge status={a.announcementType} />
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span>{a.author}</span>
                  <span>·</span>
                  <span>{new Date(a.publishDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card animate-fade-in cursor-pointer hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="font-medium">User Management</p>
              <p className="text-sm text-muted-foreground">Manage all users</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card animate-fade-in cursor-pointer hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
              <Building2 className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">Departments</p>
              <p className="text-sm text-muted-foreground">View departments</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card animate-fade-in cursor-pointer hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
              <Settings className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="font-medium">Settings</p>
              <p className="text-sm text-muted-foreground">System settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}