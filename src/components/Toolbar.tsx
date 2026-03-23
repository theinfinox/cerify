"use client";

import React from "react";
import { AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyCenter, AlignVerticalJustifyStart, AlignVerticalJustifyEnd, Settings } from "lucide-react";
import { useCertifyStore } from "../store/useCertifyStore";

interface ToolbarProps {
  selectedFieldId: string | null;
  onOpenSafetyModal: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ selectedFieldId, onOpenSafetyModal }) => {
  const { fields, updateField } = useCertifyStore();

  if (!selectedFieldId) return null;

  const field = fields.find(f => f.id === selectedFieldId);
  if (!field) return null;

  return (
    <div className="fixed top-4 right-4 bg-card-bg border-3 border-primary-black shadow-neo-base rounded-[0px] p-4 flex flex-col gap-4 z-50">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono font-bold">TEXT ALIGN</label>
        <div className="flex gap-2">
          <button 
            className={`p-2 border-3 border-primary-black ${field.align === 'left' ? 'bg-primary-green text-primary-black translate-x-[-2px] translate-y-[-2px] shadow-neo-sm' : 'bg-white hover:bg-gray-100'}`}
            onClick={() => updateField(field.id, { align: 'left' })}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button 
             className={`p-2 border-3 border-primary-black ${field.align === 'center' ? 'bg-primary-green text-primary-black translate-x-[-2px] translate-y-[-2px] shadow-neo-sm' : 'bg-white hover:bg-gray-100'}`}
            onClick={() => updateField(field.id, { align: 'center' })}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button 
             className={`p-2 border-3 border-primary-black ${field.align === 'right' ? 'bg-primary-green text-primary-black translate-x-[-2px] translate-y-[-2px] shadow-neo-sm' : 'bg-white hover:bg-gray-100'}`}
            onClick={() => updateField(field.id, { align: 'right' })}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono font-bold">VERTICAL ALIGN</label>
        <div className="flex gap-2">
          <button 
             className={`p-2 border-3 border-primary-black ${field.verticalAlign === 'top' ? 'bg-primary-green text-primary-black translate-x-[-2px] translate-y-[-2px] shadow-neo-sm' : 'bg-white hover:bg-gray-100'}`}
            onClick={() => updateField(field.id, { verticalAlign: 'top' })}
            title="Align Top"
          >
            <AlignVerticalJustifyStart size={16} />
          </button>
          <button 
             className={`p-2 border-3 border-primary-black ${field.verticalAlign === 'middle' ? 'bg-primary-green text-primary-black translate-x-[-2px] translate-y-[-2px] shadow-neo-sm' : 'bg-white hover:bg-gray-100'}`}
            onClick={() => updateField(field.id, { verticalAlign: 'middle' })}
            title="Align Middle"
          >
            <AlignVerticalJustifyCenter size={16} />
          </button>
          <button 
             className={`p-2 border-3 border-primary-black ${field.verticalAlign === 'bottom' ? 'bg-primary-green text-primary-black translate-x-[-2px] translate-y-[-2px] shadow-neo-sm' : 'bg-white hover:bg-gray-100'}`}
            onClick={() => updateField(field.id, { verticalAlign: 'bottom' })}
            title="Align Bottom"
          >
            <AlignVerticalJustifyEnd size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono font-bold">AUTO-SHRINK</label>
        <button 
           className={`p-2 border-3 border-primary-black flex justify-center items-center gap-2 font-mono text-sm font-bold ${field.autoShrink ? 'bg-alert-red text-white' : 'bg-white text-primary-black'}`}
          onClick={() => {
            const willBeEnabled = !field.autoShrink;
            if (willBeEnabled) {
              onOpenSafetyModal();
            }
            updateField(field.id, { autoShrink: willBeEnabled });
          }}
        >
          <Settings size={16} />
          {field.autoShrink ? "ON" : "OFF"}
        </button>
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono font-bold">FONT SIZE</label>
        <input 
          type="number" 
          className="neo-input w-24"
          value={field.fontSize}
          onChange={(e) => updateField(field.id, { fontSize: Number(e.target.value) })}
        />
      </div>
    </div>
  );
};
