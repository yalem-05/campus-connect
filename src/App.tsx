import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { UserRole } from "./types/models";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import FacultyDashboard from "./pages/dashboards/FacultyDashboard";
import StaffDashboard from "./pages/dashboards/StaffDashboard";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import FacultyPage from "./pages/FacultyPage";
import Staff from "./pages/Staff";
import Courses from "./pages/Courses";
import Departments from "./pages/Departments";
import Enrollments from "./pages/Enrollments";
import Grades from "./pages/Grades";
import Payments from "./pages/Payments";
import AttendancePage from "./pages/AttendancePage";
import Announcements from "./pages/Announcements";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles?: UserRole[] 
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role as UserRole)) {
    const rolePath = user.role.toLowerCase();
    return <Navigate to={`/${rolePath}`} replace />;
  }

  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    const from = location.state?.from?.pathname || `/${user.role.toLowerCase()}`;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />

      {/* ===================== STUDENT ROUTES ===================== */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={["Student"] as UserRole[]}>
          <AppLayout><StudentDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/courses" element={
        <ProtectedRoute allowedRoles={["Student"] as UserRole[]}>
          <AppLayout><Courses /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/grades" element={
        <ProtectedRoute allowedRoles={["Student"] as UserRole[]}>
          <AppLayout><Grades /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/attendance" element={
        <ProtectedRoute allowedRoles={["Student"] as UserRole[]}>
          <AppLayout><AttendancePage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/payments" element={
        <ProtectedRoute allowedRoles={["Student"] as UserRole[]}>
          <AppLayout><Payments /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/documents" element={
        <ProtectedRoute allowedRoles={["Student"] as UserRole[]}>
          <AppLayout><Announcements /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/announcements" element={
        <ProtectedRoute allowedRoles={["Student"] as UserRole[]}>
          <AppLayout><Announcements /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/schedule" element={
        <ProtectedRoute allowedRoles={["Student"] as UserRole[]}>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/profile" element={
        <ProtectedRoute allowedRoles={["Student"] as UserRole[]}>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/settings" element={
        <ProtectedRoute allowedRoles={["Student"] as UserRole[]}>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />

      {/* ===================== FACULTY ROUTES ===================== */}
      <Route path="/faculty" element={
        <ProtectedRoute allowedRoles={["Faculty"] as UserRole[]}>
          <AppLayout><FacultyDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/faculty/courses" element={
        <ProtectedRoute allowedRoles={["Faculty"] as UserRole[]}>
          <AppLayout><Courses /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/faculty/grades" element={
        <ProtectedRoute allowedRoles={["Faculty"] as UserRole[]}>
          <AppLayout><Grades /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/faculty/attendance" element={
        <ProtectedRoute allowedRoles={["Faculty"] as UserRole[]}>
          <AppLayout><AttendancePage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/faculty/documents" element={
        <ProtectedRoute allowedRoles={["Faculty"] as UserRole[]}>
          <AppLayout><Announcements /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/faculty/announcements" element={
        <ProtectedRoute allowedRoles={["Faculty"] as UserRole[]}>
          <AppLayout><Announcements /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/faculty/schedule" element={
        <ProtectedRoute allowedRoles={["Faculty"] as UserRole[]}>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/faculty/reports" element={
        <ProtectedRoute allowedRoles={["Faculty"] as UserRole[]}>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/faculty/profile" element={
        <ProtectedRoute allowedRoles={["Faculty"] as UserRole[]}>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/faculty/settings" element={
        <ProtectedRoute allowedRoles={["Faculty"] as UserRole[]}>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />

      {/* ===================== STAFF ROUTES ===================== */}
      <Route path="/staff" element={
        <ProtectedRoute allowedRoles={["Staff"] as UserRole[]}>
          <AppLayout><StaffDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff/students" element={
        <ProtectedRoute allowedRoles={["Staff", "Admin"] as UserRole[]}>
          <AppLayout><Students /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff/grades" element={
        <ProtectedRoute allowedRoles={["Staff", "Admin"] as UserRole[]}>
          <AppLayout><Grades /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff/attendance" element={
        <ProtectedRoute allowedRoles={["Staff", "Admin"] as UserRole[]}>
          <AppLayout><AttendancePage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff/payments" element={
        <ProtectedRoute allowedRoles={["Staff", "Admin"] as UserRole[]}>
          <AppLayout><Payments /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff/documents" element={
        <ProtectedRoute allowedRoles={["Staff", "Admin"] as UserRole[]}>
          <AppLayout><Announcements /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff/announcements" element={
        <ProtectedRoute allowedRoles={["Staff", "Admin"] as UserRole[]}>
          <AppLayout><Announcements /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff/reports" element={
        <ProtectedRoute allowedRoles={["Staff", "Admin"] as UserRole[]}>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff/settings" element={
        <ProtectedRoute allowedRoles={["Staff"] as UserRole[]}>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff/users" element={
        <ProtectedRoute allowedRoles={["Staff", "Admin"] as UserRole[]}>
          <AppLayout><Students /></AppLayout>
        </ProtectedRoute>
      } />

      {/* ===================== ADMIN ROUTES ===================== */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><AdminDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Students /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/students" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Students /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/faculty" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><FacultyPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/staff" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Staff /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/courses" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Courses /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/departments" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Departments /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/grades" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Grades /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/attendance" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><AttendancePage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/payments" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Payments /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/documents" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Announcements /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/announcements" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Announcements /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/enrollments" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Enrollments /></AppLayout>
        </ProtectedRoute>
      } />
      {/* ===================== SHARED ROUTES ===================== */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/students" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Students /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/faculty" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><FacultyPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/courses" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Courses /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/departments" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Departments /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/enrollments" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Enrollments /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/grades" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Grades /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/payments" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Payments /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/attendance" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><AttendancePage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/announcements" element={
        <ProtectedRoute allowedRoles={["Admin"] as UserRole[]}>
          <AppLayout><Announcements /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;