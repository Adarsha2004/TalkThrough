import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { MeetingForm } from "./meeting-form";
import { useState } from "react";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { MeetingGetOne } from "../../types";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
  initialValues: MeetingGetOne;
}

export function UpdateMeetingDialog({ open, onOpenChange, isMobile, initialValues }: UpdateMeetingDialogProps) {
  const queryClient = useQueryClient();
  const [newAgentOpen, setNewAgentOpen] = useState(false);

  const handleCreateAgent = () => {
    setNewAgentOpen(true);
  };

  const handleSuccess = () => {
    onOpenChange(false);
    // Instead of router.refresh(), invalidate the specific query
    queryClient.invalidateQueries({ 
      queryKey: ['meetings.getOne', { id: initialValues.id }]
    });
  };

  return (
    <>
      <NewAgentDialog open={newAgentOpen} onOpenChange={setNewAgentOpen} isMobile={isMobile} />
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Update Meeting</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <MeetingForm
                initialValues={initialValues}
                onSuccess={handleSuccess}
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
              <DialogTitle>Update Meeting</DialogTitle>
            </DialogHeader>
            <MeetingForm
              initialValues={initialValues}
              onSuccess={handleSuccess}
              onCancel={() => onOpenChange(false)}
              onCreateAgent={handleCreateAgent}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
} 