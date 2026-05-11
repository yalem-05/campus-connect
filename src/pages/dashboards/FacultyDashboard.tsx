import { useAuth } from "@/context/AuthContext";
import { BookOpen, Users, Calendar, ClipboardList, Clock, GraduationCap, TrendingUp, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { courseService, CourseDto } from "@/services/courseService";
import { announcementService, AnnouncementDto } from "@/services/announcementService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function FacultyDashboard() {
  const { user } = useAuth();

  const { data: courses = [] } = useQuery({ queryKey: ["courses"], queryFn: courseService.getAll });
  const { data: announcements = [] } = useQuery({ queryKey: ["announcements"], queryFn: announcementService.getAll });

  const facultyCourses = (courses as CourseDto[]).slice(0, 4);
  const todayClasses = [
    { course: "CS101 - Data Structures", time: "9:00 AM - 10:30 AM", room: "Room 301", students: 45 },
    { course: "CS201 - Algorithms", time: "11:00 AM - 12:30 PM", room: "Room 205", students: 38 },
    { course: "CS301 - Database Systems", time: "2:00 PM - 3:30 PM", room: "Lab 102", students: 32 },
  ];
  const pendingGrades = [
    { course: "CS101 - Data Structures", assignment: "Midterm Exam", students: 45, due: "Apr 5, 2026" },
    { course: "CS201 - Algorithms", assignment: "Assignment 5", students: 38, due: "Apr 7, 2026" },
  ];

  const stats = [
    { title: "Teaching Courses", value: facultyCourses.length, subtitle: "This semester", icon: BookOpen, variant: "primary" as const },
    { title: "Total Students", value: 156, subtitle: "All classes", icon: Users, variant: "accent" as const },
    { title: "Classes Today", value: todayClasses.length, subtitle: "Today", icon: Calendar, variant: "warning" as const },
    { title: "Pending Grades", value: pendingGrades.reduce((s, g) => s + g.students, 0), subtitle: "To submit", icon: ClipboardList, variant: "default" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, Professor {user?.lastName}! Manage your classes and students.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            My Schedule
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
              <Calendar className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Today's Classes</h3>
            </div>
            <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="space-y-4">
            {todayClasses.map((cls, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                <div className="space-y-1">
                  <p className="font-medium">{cls.course}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {cls.time}
                    </span>
                    <span>{cls.room}</span>
                  </div>
                </div>
                <Badge variant="secondary">{cls.students} students</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card animate-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Pending Grades</h3>
            </div>
            <span className="text-xs text-muted-foreground">{pendingGrades.length} items</span>
          </div>
          <div className="space-y-4">
            {pendingGrades.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                <div className="space-y-1">
                  <p className="font-medium">{item.assignment}</p>
                  <p className="text-sm text-muted-foreground">{item.course}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{item.students} submissions</Badge>
                  <p className="text-xs text-orange-500 mt-1">Due: {item.due}</p>
                </div>
              </div>
            ))}
            <Button className="w-full mt-2">
              <GraduationCap className="mr-2 h-4 w-4" />
              Enter Grades
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">My Courses</h3>
          </div>
          <div className="space-y-3">
            {facultyCourses.map((course: CourseDto) => (
              <div key={course.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{course.courseName}</p>
                  <p className="text-xs text-muted-foreground">{course.courseCode}</p>
                </div>
                <Badge>{course.credits} CR</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Announcements</h3>
          </div>
          <div className="space-y-3">
            {(announcements as AnnouncementDto[]).slice(0, 3).map((a) => (
              <div key={a.id} className="rounded-lg border border-border/50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{a.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{a.content}</p>
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
