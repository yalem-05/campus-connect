import { useAuth } from "@/context/AuthContext";
import { BookOpen, GraduationCap, Calendar, DollarSign, Clock, Award, TrendingUp, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { courses as allCourses, enrollments, grades, announcements, students } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
  const { user } = useAuth();
  
  const studentCourses = allCourses.slice(0, 5);
  const studentGrades = grades.slice(0, 3);
  const upcomingAnnouncements = announcements.filter(a => a.targetAudience === "Students" || a.targetAudience === "All").slice(0, 3);

  const stats = [
    { title: "Enrolled Courses", value: studentCourses.length, subtitle: "This semester", icon: BookOpen, variant: "primary" as const },
    { title: "Attendance", value: "92%", subtitle: "Above average", icon: Calendar, variant: "accent" as const },
    { title: "GPA", value: "3.75", subtitle: "Dean's List", icon: Award, variant: "warning" as const },
    { title: "Credits", value: "45/120", subtitle: "60% complete", icon: GraduationCap, variant: "default" as const },
  ];

  const gradeData = [
    { course: "Data Structures", grade: "A", marks: 92 },
    { course: "Database Systems", grade: "B+", marks: 87 },
    { course: "Web Development", grade: "A-", marks: 89 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.firstName}! Track your academic progress.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button size="sm">
            <BookOpen className="mr-2 h-4 w-4" />
            My Courses
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
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">My Courses</h3>
            </div>
            <span className="text-xs text-muted-foreground">{studentCourses.length} enrolled</span>
          </div>
          <div className="space-y-4">
            {studentCourses.map((course) => (
              <div key={course.id} className="rounded-lg bg-muted/30 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{course.courseName}</p>
                    <p className="text-xs text-muted-foreground">{course.courseCode} · {course.credits} credits</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">{course.courseLevel}</span>
                </div>
                <Progress value={Math.floor(Math.random() * 40) + 60} className="h-2" />
                <p className="mt-1 text-xs text-muted-foreground">{Math.floor(Math.random() * 40) + 60}% complete</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card animate-fade-in">
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Recent Grades</h3>
          </div>
          <div className="space-y-3">
            {gradeData.map((g, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                <div>
                  <p className="text-sm font-medium">{g.course}</p>
                  <p className="text-xs text-muted-foreground">{g.marks}/100 marks</p>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-primary">{g.grade}</span>
                  <p className="text-xs text-muted-foreground">Grade</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Payment Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950">
              <div>
                <p className="text-sm font-medium">Fall 2024 Tuition</p>
                <p className="text-xs text-muted-foreground">Paid</p>
              </div>
              <StatusBadge status="Completed" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <p className="text-sm font-medium">Spring 2025</p>
                <p className="text-xs text-muted-foreground">Due: Jan 15, 2025</p>
              </div>
              <StatusBadge status="Pending" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Announcements</h3>
          </div>
          <div className="space-y-3">
            {upcomingAnnouncements.map((a) => (
              <div key={a.id} className="rounded-lg border border-border/50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{a.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{a.content}</p>
                  </div>
                  <StatusBadge status={a.announcementType} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}