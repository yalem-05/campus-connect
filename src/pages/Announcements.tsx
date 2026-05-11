import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { announcementService, AnnouncementDto } from "@/services/announcementService";
import { useAuth } from "@/context/AuthContext";
import { Megaphone, Calendar, User, Building2, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

const typeColors: Record<string, string> = {
  General: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Academic: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Event: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Emergency: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const announcementTypes = ["General", "Academic", "Event", "Emergency"];
const audienceOptions = ["All", "Students", "Faculty", "Staff"];

export default function Announcements() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "", announcementType: "General", targetAudience: "All", author: "" });
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: announcementService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: announcementService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast({ title: "Announcement Created", description: "The announcement has been published." });
      setIsFormOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create announcement.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: announcementService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast({ title: "Announcement Deleted", description: "The announcement has been removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete announcement.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title: formData.title,
      content: formData.content,
      announcementType: formData.announcementType,
      targetAudience: formData.targetAudience,
      author: formData.author || user?.firstName + " " + user?.lastName || "Admin",
    });
  };

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading announcements...</div>;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Announcements</h1>
            <p className="text-sm text-muted-foreground">Stay updated with the latest announcements.</p>
          </div>
          <Button onClick={() => { setFormData({ title: "", content: "", announcementType: "General", targetAudience: "All", author: user?.firstName + " " + user?.lastName || "" }); setIsFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Button>
        </div>
        <div className="space-y-4">
          {announcements.map((a: AnnouncementDto) => (
            <div key={a.id} className="rounded-xl border bg-card p-5 shadow-card relative group">
              <button
                onClick={() => setDeletingId(a.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-red-100 text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Announcement</DialogTitle>
            <DialogDescription>Create a new announcement for your institution.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="Announcement title" required />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea value={formData.content} onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))} placeholder="Write your announcement..." rows={4} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.announcementType} onValueChange={(v) => setFormData(p => ({ ...p, announcementType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {announcementTypes.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select value={formData.targetAudience} onValueChange={(v) => setFormData(p => ({ ...p, targetAudience: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {audienceOptions.map(a => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit">Publish</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deletingId) deleteMutation.mutate(deletingId); setDeletingId(null); }} className="bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
