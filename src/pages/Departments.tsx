import { useQuery } from "@tanstack/react-query";
import { departmentService, DepartmentDto } from "@/services/departmentService";
import { Building2, GraduationCap, BookOpen, Users } from "lucide-react";

export default function Departments() {
  const { data: departments = [], isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentService.getAll,
  });

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading departments...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Departments</h1>
        <p className="text-sm text-muted-foreground">Overview of all academic departments.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept: DepartmentDto) => (
          <div key={dept.id} className="rounded-xl border bg-card p-5 shadow-card hover:shadow-elevated transition-shadow animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{dept.departmentName}</h3>
                <p className="text-xs text-muted-foreground">{dept.departmentCode}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{dept.description}</p>
            <p className="mt-2 text-xs text-muted-foreground">Head: <span className="font-medium text-foreground">{dept.headOfDepartment}</span></p>
            <div className="mt-4 flex gap-4 border-t pt-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <GraduationCap className="h-3.5 w-3.5" /> {dept.studentCount} Students
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" /> {dept.courseCount} Courses
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> {dept.facultyCount} Faculty
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
