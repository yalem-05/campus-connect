import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  Building2,
  ClipboardList,
  Award,
  CreditCard,
  CalendarCheck,
  Megaphone,
  FileText,
  Clock,
  DollarSign,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  User,
  BarChart3,
  Shield,
  AlertCircle,
  FolderOpen,
  Mail,
  Clipboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

interface MenuItem {
  title: string;
  url?: string;
  icon: React.ElementType;
  badge?: number;
  children?: MenuItem[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (url?: string) => {
    if (!url) return false;
    return location.pathname === url || location.pathname.startsWith(url + "/");
  };

  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSubmenus.includes(item.title);
    const active = isActive(item.url);

    return (
      <div key={item.title}>
        {hasChildren ? (
          <button
            onClick={() => toggleSubmenu(item.title)}
            className={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              depth > 0 && "ml-4"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </div>
            {!collapsed && (
              <div className="flex items-center gap-1">
                {item.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-medium text-white">
                    {item.badge}
                  </span>
                )}
                {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </div>
            )}
          </button>
        ) : (
          <button
            onClick={() => item.url && navigate(item.url)}
            className={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              depth > 0 && "ml-4"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </div>
            {!collapsed && item.badge && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-medium text-white">
                {item.badge}
              </span>
            )}
          </button>
        )}
        {hasChildren && isOpen && !collapsed && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderMenuGroup = (group: MenuGroup) => (
    <div key={group.title} className="mb-4">
      {!collapsed && (
        <div className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/40">
          {group.title}
        </div>
      )}
      <div className="space-y-0.5">
        {group.items.map((item) => renderMenuItem(item))}
      </div>
    </div>
  );

  const getMenus = (): MenuGroup[] => {
    switch (user?.role) {
      case "Student":
        return studentMenus;
      case "Faculty":
        return facultyMenus;
      case "Staff":
        return staffMenus;
      case "Admin":
      default:
        return adminMenus;
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="px-4 py-5">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-sidebar-accent-foreground">EduManage</h1>
              <p className="text-[11px] text-sidebar-foreground/60">{user?.role} Dashboard</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2">
        <ScrollArea className="h-[calc(100vh-180px)]">
          {getMenus().map(renderMenuGroup)}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-destructive hover:text-destructive-foreground"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

const studentMenus: MenuGroup[] = [
  {
    title: "Main",
    items: [
      { title: "Dashboard", url: "/student", icon: LayoutDashboard },
      { title: "My Courses", url: "/student/courses", icon: BookOpen },
      { title: "Grades & Results", url: "/student/grades", icon: Award },
      { title: "Attendance", url: "/student/attendance", icon: CalendarCheck },
      { title: "Payments", url: "/student/payments", icon: CreditCard },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Documents", url: "/student/documents", icon: FileText },
      { title: "Announcements", url: "/student/announcements", icon: Megaphone },
      { title: "Class Schedule", url: "/student/schedule", icon: Clock },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Profile", url: "/student/profile", icon: User },
      { title: "Settings", url: "/student/settings", icon: Settings },
    ],
  },
];

const facultyMenus: MenuGroup[] = [
  {
    title: "Dashboard",
    items: [
      { title: "Overview", url: "/faculty", icon: LayoutDashboard },
      { title: "My Schedule", url: "/faculty/schedule", icon: Clock },
    ],
  },
  {
    title: "Academic",
    items: [
      { title: "My Courses", url: "/faculty/courses", icon: BookOpen },
      { title: "Grade Management", url: "/faculty/grades", icon: Award },
      { title: "Attendance", url: "/faculty/attendance", icon: CalendarCheck },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Documents", url: "/faculty/documents", icon: FileText },
      { title: "Announcements", url: "/faculty/announcements", icon: Megaphone },
      { title: "Reports", url: "/faculty/reports", icon: BarChart3 },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Profile", url: "/faculty/profile", icon: User },
      { title: "Settings", url: "/faculty/settings", icon: Settings },
    ],
  },
];

const staffMenus: MenuGroup[] = [
  {
    title: "Dashboard",
    items: [
      { title: "Overview", url: "/staff", icon: LayoutDashboard },
      { title: "Reports", url: "/staff/reports", icon: BarChart3 },
    ],
  },
  {
    title: "Student Services",
    items: [
      { title: "Students", url: "/staff/students", icon: GraduationCap },
      { title: "Users", url: "/staff/users", icon: Users },
    ],
  },
  {
    title: "Academic",
    items: [
      { title: "Grades", url: "/staff/grades", icon: Award },
      { title: "Attendance", url: "/staff/attendance", icon: CalendarCheck },
      { title: "Payments", url: "/staff/payments", icon: CreditCard },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Documents", url: "/staff/documents", icon: FolderOpen },
      { title: "Announcements", url: "/staff/announcements", icon: Megaphone },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Settings", url: "/staff/settings", icon: Settings },
    ],
  },
];

const adminMenus: MenuGroup[] = [
  {
    title: "Dashboard",
    items: [
      { title: "Overview", url: "/admin", icon: LayoutDashboard },
      { title: "Reports", url: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    title: "User Management",
    items: [
      { title: "All Users", url: "/admin/users", icon: Users },
      { title: "Students", url: "/admin/students", icon: GraduationCap },
      { title: "Faculty", url: "/admin/faculty", icon: Users },
      { title: "Staff", url: "/admin/staff", icon: Users },
    ],
  },
  {
    title: "Academic",
    items: [
      { title: "Courses", url: "/admin/courses", icon: BookOpen },
      { title: "Departments", url: "/admin/departments", icon: Building2 },
      { title: "Enrollments", url: "/admin/enrollments", icon: ClipboardList },
      { title: "Grades", url: "/admin/grades", icon: Award },
      { title: "Attendance", url: "/admin/attendance", icon: CalendarCheck },
    ],
  },
  {
    title: "Financial",
    items: [
      { title: "Payments", url: "/admin/payments", icon: CreditCard },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Documents", url: "/admin/documents", icon: FolderOpen },
      { title: "Announcements", url: "/admin/announcements", icon: Megaphone },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Settings", url: "/admin/settings", icon: Settings },
      { title: "Security", url: "/admin/settings", icon: Shield },
    ],
  },
];