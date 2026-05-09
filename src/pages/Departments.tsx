// Departments.tsx (updated)
import { useState } from "react";
import { departments as initialDepartments, students, courses, faculty } from "@/data/mockData";
import { Building2, GraduationCap, BookOpen, Users, Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DepartmentForm } from "./departments/DepartmentForm";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Departments() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const [deletingDepartment, setDeletingDepartment] = useState<any>(null);

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setIsFormOpen(true);
  };

  const handleEditDepartment = (department: any) => {
    setEditingDepartment(department);
    setIsFormOpen(true);
  };

  const handleDeleteDepartment = (department: any) => {
    setDeletingDepartment(department);
  };

  const confirmDelete = () => {
    if (deletingDepartment) {
      // Check if department has any associated records
      const hasStudents = students.some(s => s.departmentId === deletingDepartment.id);
      const hasCourses = courses.some(c => c.departmentId === deletingDepartment.id);
      const hasFaculty = faculty.some(f => f.departmentId === deletingDepartment.id);

      if (hasStudents || hasCourses || hasFaculty) {
        toast({
          title: "Cannot Delete Department",
          description: `This department has ${hasStudents ? 'students' : ''}${hasStudents && hasCourses ? ', ' : ''}${hasCourses ? 'courses' : ''}${(hasStudents || hasCourses) && hasFaculty ? ' and ' : ''}${hasFaculty ? 'faculty' : ''} assigned. Remove or reassign them first.`,
          variant: "destructive",
        });
      } else {
        setDepartments(departments.filter(d => d.id !== deletingDepartment.id));
        toast({
          title: "Department Deleted",
          description: `${deletingDepartment.departmentName} has been removed.`,
        });
      }
      setDeletingDepartment(null);
    }
  };

  const handleSubmitDepartment = (data: any) => {
    if (editingDepartment) {
      // Edit existing department
      const updatedDepartments = departments.map(dept =>
        dept.id === editingDepartment.id
          ? { ...dept, ...data, updatedDate: new Date().toISOString().split('T')[0] }
          : dept
      );
      setDepartments(updatedDepartments);
      toast({
        title: "Department Updated",
        description: `${data.departmentName} has been updated successfully.`,
      });
    } else {
      // Add new department
      const newDepartment = {
        id: departments.length + 1,
        guid: `d${departments.length + 1}`,
        ...data,
        createdDate: new Date().toISOString().split('T')[0],
        isActive: true,
      };
      setDepartments([...departments, newDepartment]);
      toast({
        title: "Department Created",
        description: `${data.departmentName} has been added successfully.`,
      });
    }
    setIsFormOpen(false);
    setEditingDepartment(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Departments</h1>
            <p className="text-sm text-muted-foreground">Overview of all academic departments.</p>
          </div>
          <Button onClick={handleAddDepartment}>
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => {
            const deptStudents = students.filter(s => s.departmentId === dept.id).length;
            const deptCourses = courses.filter(c => c.departmentId === dept.id).length;
            const deptFaculty = faculty.filter(f => f.departmentId === dept.id).length;
            
            return (
              <Card key={dept.id} className="relative group hover:shadow-lg transition-all duration-200">
                <CardContent className="p-5">
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditDepartment(dept)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteDepartment(dept)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{dept.departmentName}</h3>
                      <p className="text-xs text-muted-foreground">{dept.departmentCode}</p>
                    </div>
                  </div>
                  
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{dept.description}</p>
                  
                  <p className="mt-2 text-xs text-muted-foreground">
                    Head: <span className="font-medium text-foreground">{dept.headOfDepartment}</span>
                  </p>
                  
                  {dept.contactEmail && (
                    <p className="mt-1 text-xs text-muted-foreground truncate">
                      Email: {dept.contactEmail}
                    </p>
                  )}
                  
                  <div className="mt-4 flex gap-4 border-t pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <GraduationCap className="h-3.5 w-3.5" /> 
                      {deptStudents} Students
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" /> 
                      {deptCourses} Courses
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> 
                      {deptFaculty} Faculty
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <DepartmentForm 
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDepartment(null);
        }}
        onSubmit={handleSubmitDepartment}
        initialData={editingDepartment || {}}
        mode={editingDepartment ? "edit" : "add"}
      />

      <AlertDialog open={!!deletingDepartment} onOpenChange={() => setDeletingDepartment(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the department "{deletingDepartment?.departmentName}".
              {students.some(s => s.departmentId === deletingDepartment?.id) && 
                " This department has students assigned to it and cannot be deleted."}
              {courses.some(c => c.departmentId === deletingDepartment?.id) && 
                " This department has courses assigned to it and cannot be deleted."}
              {faculty.some(f => f.departmentId === deletingDepartment?.id) && 
                " This department has faculty members assigned to it and cannot be deleted."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}