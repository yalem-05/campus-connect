import { useQuery } from "@tanstack/react-query";
import { announcementService, AnnouncementDto } from "@/services/announcementService";
import { Megaphone, Calendar, User, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const typeColors: Record<string, string> = {
  General: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Academic: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Event: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Emergency: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function Announcements() {
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: announcementService.getAll,
  });

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading announcements...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Announcements</h1>
        <p className="text-sm text-muted-foreground">Stay updated with the latest announcements.</p>
      </div>
      <div className="space-y-4">
        {announcements.map((a: AnnouncementDto) => (
          <div key={a.id} className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Megaphone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{a.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${typeColors[a.announcementType] || "bg-gray-100 text-gray-800"}`}>
                    {a.announcementType}
                  </span>
                  <Badge variant="outline" className="text-[10px]">{a.targetAudience}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{a.content}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {a.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(a.publishDate).toLocaleDateString()}</span>
                  {a.departmentName && (
                    <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {a.departmentName}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No announcements yet.</p>
        )}
      </div>
    </div>
  );
}
