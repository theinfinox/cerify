import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WarningModal: React.FC<WarningModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex justify-center items-center backdrop-blur-sm p-4">
      <div className="neo-card max-w-md w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-primary-black hover:text-alert-red transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="flex flex-col items-center text-center gap-4 mt-4">
          <div className="bg-alert-red text-white p-4 rounded-full border-3 border-primary-black">
            <AlertTriangle size={32} />
          </div>
          
          <h2 className="text-2xl text-alert-red uppercase">Auto-Shrink Warning</h2>
          
          <p className="font-mono font-bold text-sm text-gray-700 leading-relaxed">
            Warning: Text will scale down to fit the box if it overflows. Ensure the box width is sufficient for legibility of long names, otherwise the text may become completely unreadable unrendered output.
          </p>
          
          <button 
            className="neo-button w-full mt-4" 
            onClick={onClose}
          >
            I UNDERSTAND
          </button>
        </div>
      </div>
    </div>
  );
};
