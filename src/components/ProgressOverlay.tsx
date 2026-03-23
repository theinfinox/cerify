"use client";

import React from "react";
import { Terminal, XCircle } from "lucide-react";

interface ProgressOverlayProps {
  isOpen: boolean;
  current: number;
  total: number;
  statusText: string;
  onCancel: () => void;
}

export const ProgressOverlay: React.FC<ProgressOverlayProps> = ({ isOpen, current, total, statusText, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary-black z-[200] flex justify-center items-center p-6">
      <div className="neo-card w-full max-w-2xl bg-black text-primary-green border-[6px] border-primary-green rounded-none shadow-[10px_10px_0px_#00c853]">
        <div className="flex justify-between items-center mb-6 pb-4 border-b-3 border-primary-green">
           <div className="flex items-center gap-4 text-primary-green">
             <Terminal size={32} />
             <h2 className="text-3xl font-mono uppercase tracking-widest font-bold m-0 leading-none">SYS_PROCESS</h2>
           </div>
           
           <button 
             onClick={onCancel}
             className="text-alert-red hover:text-white transition-colors"
           >
             <XCircle size={32} />
           </button>
        </div>

        <div className="flex flex-col gap-4 font-mono font-bold text-xl">
           <p className="text-primary-green">{`> ${statusText}`}</p>
           {total > 0 && <p className="text-primary-green">{`> BATCH: [${current}/${total}] GENERATED...`}</p>}

           {total > 0 && (
              <div className="w-full h-8 border-3 border-primary-green p-1 mt-4">
                 <div 
                   className="h-full bg-primary-green transition-all duration-300"
                   style={{ width: `${(current / total) * 100}%` }}
                 />
              </div>
           )}
           <p className="text-xs text-gray-500 mt-4 blink_me">_DO NOT CLOSE THE BROWSER</p>
        </div>
      </div>

      <style jsx global>{`
        .blink_me {
          animation: blinker 1s linear infinite;
        }
        @keyframes blinker {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};
