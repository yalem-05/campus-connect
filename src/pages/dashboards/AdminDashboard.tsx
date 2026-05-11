import { useAuth } from "@/context/AuthContext";
import { GraduationCap, Users, BookOpen, DollarSign, ClipboardList, Building2, TrendingUp, AlertCircle, Settings, Shield, Calendar } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { studentService, StudentDto } from "@/services/studentService";
import { departmentService, DepartmentDto } from "@/services/departmentService";
import { courseService, CourseDto } from "@/services/courseService";
import { announcementService, AnnouncementDto } from "@/services/announcementService";
import { paymentService, PaymentDto } from "@/services/paymentService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";

const CHART_COLORS = [
  "hsl(210, 75%, 42%)",
  "hsl(165, 60%, 40%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 60%, 55%)",
  "hsl(0, 72%, 55%)",
];

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: students = [] } = useQuery({ queryKey: ["students"], queryFn: studentService.getAll });
  const { data: departments = [] } = useQuery({ queryKey: ["departments"], queryFn: departmentService.getAll });
  const { data: courses = [] } = useQuery({ queryKey: ["courses"], queryFn: courseService.getAll });
  const { data: announcements = [] } = useQuery({ queryKey: ["announcements"], queryFn: announcementService.getAll });
  const { data: payments = [] } = useQuery({ queryKey: ["payments"], queryFn: paymentService.getAll });

  const activeStudents = students.filter((s: StudentDto) => s.enrollmentStatus === "Active" || s.enrollmentStatus === "Enrolled").length;
  const totalRevenue = payments.reduce((sum: number, p: PaymentDto) => p.status === "Completed" ? sum + p.amount : sum, 0);
  const pendingPayments = payments.filter((p: PaymentDto) => p.status === "Pending").length;

  const enrollmentTrends = [
    { month: "Jan", enrollments: 45 }, { month: "Feb", enrollments: 52 },
    { month: "Mar", enrollments: 38 }, { month: "Apr", enrollments: 60 },
    { month: "May", enrollments: 55 }, { month: "Jun", enrollments: 70 },
  ];

  const departmentDistribution = departments.map((d: DepartmentDto) => ({ name: d.departmentName, students: d.studentCount }));

  const stats = [
    { title: "Total Students", value: students.length, subtitle: `${activeStudents} active`, icon: GraduationCap, variant: "primary" as const, trend: { value: 12, positive: true } },
    { title: "Faculty Members", value: departments.reduce((s: number, d: DepartmentDto) => s + d.facultyCount, 0), subtitle: "All departments", icon: Users, variant: "accent" as const },
    { title: "Active Courses", value: courses.filter((c: CourseDto) => c.isActive).length, subtitle: `${courses.length} total`, icon: BookOpen, variant: "warning" as const },
    { title: "Revenue", value: `$${totalRevenue.toLocaleString()}`, subtitle: `${pendingPayments} pending`, icon: DollarSign, variant: "default" as const, trend: { value: 8, positive: true } },
  ];

  const recentStudents = students.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.firstName}! Here's what's happening at your institution.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button size="sm">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-4 animate-fade-in">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Enrollment Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={enrollmentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(214, 20%, 90%)", fontSize: "13px" }} />
              <Bar dataKey="enrollments" fill="hsl(210, 75%, 42%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-3 animate-fade-in">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Students by Department</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={departmentDistribution} dataKey="students" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`} labelLine={false}>
                {departmentDistribution.map((_, i: number) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-card animate-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Recent Students</h3>
            </div>
            <span className="text-xs text-muted-foreground">{students.length} total</span>
          </div>
          <div className="space-y-3">
            {recentStudents.map((s: StudentDto) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {s.firstName[0]}{s.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.firstName} {s.lastName}</p>
                    <p className="text-xs text-muted-foreground">{s.studentId}</p>
                  </div>
                </div>
                <StatusBadge status={s.enrollmentStatus} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card animate-fade-in">
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Latest Announcements</h3>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 4).map((a: AnnouncementDto) => (
              <div key={a.id} className="rounded-lg border border-border/50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{a.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{a.content}</p>
                  </div>
                  <StatusBadge status={a.announcementType} />
                </div>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{a.author}</span>
                  <span>·</span>
                  <span>{new Date(a.publishDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
