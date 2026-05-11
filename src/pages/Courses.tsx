import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService, CourseDto } from "@/services/courseService";
import { departmentService, DepartmentDto } from "@/services/departmentService";
import { CourseForm, CourseFormData } from "./Course/CourseForm";
import { toast } from "@/components/ui/use-toast";

const columns = (departments: DepartmentDto[]) => [
  { key: "courseCode", label: "Code" },
  {
    key: "courseName",
    label: "Course Name",
    render: (c: CourseDto) => (
      <div>
        <p className="font-medium">{c.courseName}</p>
        <p className="text-xs text-muted-foreground line-clamp-1">{c.description}</p>
      </div>
    ),
  },
  {
    key: "department",
    label: "Department",
    render: (c: CourseDto) => departments.find(d => d.id === c.departmentId)?.departmentName || "—",
  },
  { key: "credits", label: "Credits" },
  {
    key: "courseLevel",
    label: "Level",
    render: (c: CourseDto) => (
      <Badge variant="outline" className="text-[11px]">{c.courseLevel}</Badge>
    ),
  },
  {
    key: "fee",
    label: "Fee",
    render: (c: CourseDto) => `$${c.fee.toLocaleString()}`,
  },
];

export default function Courses() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: coursesList = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: courseService.getAll,
  });
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: courseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({ title: "Course Added", description: "The course has been added successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add course.", variant: "destructive" });
    },
  });

  const handleSubmit = (data: CourseFormData) => {
    createMutation.mutate({
      courseCode: data.courseCode,
      courseName: data.courseName,
      description: data.description || undefined,
      credits: data.credits,
      durationInHours: data.durationInHours,
      courseLevel: data.courseLevel,
      prerequisites: data.prerequisites || undefined,
      fee: data.fee,
      departmentId: data.departmentId,
    });
    setIsFormOpen(false);
  };

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading courses...</div>;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="text-sm text-muted-foreground">Browse and manage course offerings.</p>
        </div>
        <DataTable data={coursesList} columns={columns(departments)} searchKey="courseName" title="All Courses" addLabel="Add Course" onAdd={() => setIsFormOpen(true)} />
      </div>
      <CourseForm open={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} mode="add" departments={departments} />
    </>
  );
}
