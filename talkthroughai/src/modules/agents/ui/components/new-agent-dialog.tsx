import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { AgentForm } from "./agent-form";

interface NewAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
}

export function NewAgentDialog({ open, onOpenChange, isMobile }: NewAgentDialogProps) {
  return isMobile ? (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New Agent</DrawerTitle>
        </DrawerHeader>
        <AgentForm onSuccess={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Agent</DialogTitle>
        </DialogHeader>
        <AgentForm onSuccess={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
} 