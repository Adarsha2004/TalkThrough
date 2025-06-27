import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { AgentForm } from "./agent-form";
import { AgentGetOne } from "../../types";

interface UpdateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
  agent: AgentGetOne;
}

export function UpdateAgentDialog({ open, onOpenChange, isMobile, agent }: UpdateAgentDialogProps) {
  return isMobile ? (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Update Agent</DrawerTitle>
        </DrawerHeader>
        <AgentForm initialValues={agent} onSuccess={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Agent</DialogTitle>
        </DialogHeader>
        <AgentForm initialValues={agent} onSuccess={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
} 