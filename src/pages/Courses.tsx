// Courses.tsx (updated)
import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { courses, departments } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { CourseForm } from "./Course/CourseForm";
import { toast } from "@/components/ui/use-toast";

const columns = [
  { key: "courseCode", label: "Code" },
  {
    key: "courseName",
    label: "Course Name",
    render: (c: typeof courses[0]) => (
      <div>
        <p className="font-medium">{c.courseName}</p>
        <p className="text-xs text-muted-foreground line-clamp-1">{c.description}</p>
      </div>
    ),
  },
  {
    key: "department",
    label: "Department",
    render: (c: typeof courses[0]) => departments.find(d => d.id === c.departmentId)?.departmentName || "—",
  },
  { key: "credits", label: "Credits" },
  {
    key: "courseLevel",
    label: "Level",
    render: (c: typeof courses[0]) => (
      <Badge variant="outline" className="text-[11px]">{c.courseLevel}</Badge>
    ),
  },
  {
    key: "fee",
    label: "Fee",
    render: (c: typeof courses[0]) => `$${c.fee.toLocaleString()}`,
  },
];

export default function Courses() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [coursesList, setCoursesList] = useState(courses);

  const handleAddCourse = () => {
    setIsFormOpen(true);
  };

  const handleSubmitCourse = (data: any) => {
    const newCourse = {
      id: coursesList.length + 1,
      guid: `c${coursesList.length + 1}`,
      ...data,
      createdDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    
    setCoursesList([...coursesList, newCourse]);
    
    toast({
      title: "Course Added",
      description: `${newCourse.courseName} (${newCourse.courseCode}) has been added successfully.`,
    });
    
    setIsFormOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="text-sm text-muted-foreground">Browse and manage course offerings.</p>
        </div>
        <DataTable 
          data={coursesList} 
          columns={columns} 
          searchKey="courseName" 
          title="All Courses" 
          addLabel="Add Course" 
          onAdd={handleAddCourse} 
        />
      </div>

      <CourseForm 
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitCourse}
        mode="add"
      />
    </>
  );
}