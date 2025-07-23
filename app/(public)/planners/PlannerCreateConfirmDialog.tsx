import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PlannerCreateConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  plannerName: string;
}

const PlannerCreateConfirmDialog: React.FC<PlannerCreateConfirmDialogProps> = ({ open, onConfirm, onCancel, plannerName }) => {
  return (
    <Dialog open={open} onOpenChange={open => { if (!open) onCancel(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>¿Confirmar creación?</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-gray-700 dark:text-gray-200">
          ¿Estás seguro de que deseas crear el planner <b>"{plannerName}"</b>? Podrás editarlo después.
        </div>
        <DialogFooter className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={onConfirm} autoFocus>Crear Planner</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlannerCreateConfirmDialog;
