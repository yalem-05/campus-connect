import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentService, DepartmentDto, CreateDepartmentDto, UpdateDepartmentDto } from "@/services/departmentService";
import { studentService, StudentDto } from "@/services/studentService";
import { courseService, CourseDto } from "@/services/courseService";
import { facultyService, FacultyDto } from "@/services/facultyService";
import { Building2, GraduationCap, BookOpen, Users, Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DepartmentForm, DepartmentFormData } from "./departments/DepartmentForm";
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentDto | null>(null);
  const [deletingDepartment, setDeletingDepartment] = useState<DepartmentDto | null>(null);
  const queryClient = useQueryClient();

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentService.getAll,
  });
  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: studentService.getAll,
  });
  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: courseService.getAll,
  });
  const { data: faculties = [] } = useQuery({
    queryKey: ["faculty"],
    queryFn: facultyService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: departmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast({ title: "Department Created", description: "The department has been added successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create department.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDepartmentDto }) => departmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast({ title: "Department Updated", description: "The department has been updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update department.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: departmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast({ title: "Department Deleted", description: "The department has been removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete department.", variant: "destructive" });
    },
  });

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setIsFormOpen(true);
  };

  const handleEditDepartment = (department: DepartmentDto) => {
    setEditingDepartment(department);
    setIsFormOpen(true);
  };

  const handleDeleteDepartment = (department: DepartmentDto) => {
    setDeletingDepartment(department);
  };

  const confirmDelete = () => {
    if (deletingDepartment) {
      const hasStudents = students.some((s: StudentDto) => s.departmentId === deletingDepartment.id);
      const hasCourses = courses.some((c: CourseDto) => c.departmentId === deletingDepartment.id);
      const hasFaculty = faculties.some((f: FacultyDto) => f.departmentId === deletingDepartment.id);

      if (hasStudents || hasCourses || hasFaculty) {
        toast({
          title: "Cannot Delete Department",
          description: `This department has ${hasStudents ? 'students' : ''}${hasStudents && hasCourses ? ', ' : ''}${hasCourses ? 'courses' : ''}${(hasStudents || hasCourses) && hasFaculty ? ' and ' : ''}${hasFaculty ? 'faculty' : ''} assigned. Remove or reassign them first.`,
          variant: "destructive",
        });
      } else {
        deleteMutation.mutate(deletingDepartment.id);
      }
      setDeletingDepartment(null);
    }
  };

  const handleSubmitDepartment = (data: DepartmentFormData) => {
    if (editingDepartment) {
      updateMutation.mutate({
        id: editingDepartment.id,
        data: {
          description: data.description,
          headOfDepartment: data.headOfDepartment,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
        },
      });
    } else {
      createMutation.mutate({
        departmentCode: data.departmentCode,
        departmentName: data.departmentName,
        description: data.description || undefined,
        headOfDepartment: data.headOfDepartment || undefined,
        contactEmail: data.contactEmail || undefined,
        contactPhone: data.contactPhone || undefined,
      });
    }
    setIsFormOpen(false);
    setEditingDepartment(null);
  };

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading departments...</div>;

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
            const deptStudents = students.filter((s: StudentDto) => s.departmentId === dept.id).length;
            const deptCourses = courses.filter((c: CourseDto) => c.departmentId === dept.id).length;
            const deptFaculty = faculties.filter((f: FacultyDto) => f.departmentId === dept.id).length;

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
