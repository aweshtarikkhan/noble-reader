import React from "react";

interface ExitDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ExitDialog: React.FC<ExitDialogProps> = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-gold/20 rounded-2xl p-6 mx-6 max-w-sm w-full shadow-gold-lg animate-slide-up">
        <div className="text-center mb-6">
          <p className="font-arabic text-2xl text-gold mb-2">القرآن الكريم</p>
          <h2 className="text-lg font-semibold text-foreground mb-1">Exit App?</h2>
          <p className="text-sm text-muted-foreground">Are you sure you want to exit the app?</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-muted text-foreground text-sm font-medium transition-smooth hover:bg-accent"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium transition-smooth hover:opacity-90"
          >
            Yes, Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitDialog;
