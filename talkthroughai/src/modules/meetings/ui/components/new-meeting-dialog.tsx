import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { MeetingForm } from "./meeting-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";

interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
}

export function NewMeetingDialog({ open, onOpenChange, isMobile }: NewMeetingDialogProps) {
  const router = useRouter();
  const [newAgentOpen, setNewAgentOpen] = useState(false);

  const handleCreateAgent = () => {
    setNewAgentOpen(true);
  };

  return (
    <>
      <NewAgentDialog open={newAgentOpen} onOpenChange={setNewAgentOpen} isMobile={isMobile} />
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>New Meeting</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <MeetingForm
                onSuccess={(id) => {
                  onOpenChange(false);
                  router.push(`/dashboard/meetings/${id}`);
                }}
                onCancel={() => onOpenChange(false)}
                onCreateAgent={handleCreateAgent}
              />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Meeting</DialogTitle>
            </DialogHeader>
            <MeetingForm
              onSuccess={(id) => {
                onOpenChange(false);
                router.push(`/dashboard/meetings/${id}`);
              }}
              onCancel={() => onOpenChange(false)}
              onCreateAgent={handleCreateAgent}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
} 