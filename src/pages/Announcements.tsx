import { announcements } from "@/data/mockData";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Announcements() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-sm text-muted-foreground">Campus news and notifications.</p>
        </div>
      </div>
      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a.id} className="rounded-xl border bg-card p-5 shadow-card hover:shadow-elevated transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="rounded-lg bg-primary/10 p-2 mt-0.5">
                  <Megaphone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.content}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{a.author}</span>
                    <span>·</span>
                    <span>{new Date(a.publishDate).toLocaleDateString()}</span>
                    <Badge variant="outline" className="text-[10px]">{a.targetAudience}</Badge>
                  </div>
                </div>
              </div>
              <StatusBadge status={a.announcementType} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
