import React from "react";

const LoadingSpinner: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
    <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    <p className="font-arabic text-gold text-lg">بِسْمِ اللَّهِ</p>
    {message && <p className="text-muted-foreground text-sm">{message}</p>}
  </div>
);

export default LoadingSpinner;
