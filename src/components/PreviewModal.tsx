"use client";

import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  blobs: Blob[];
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, blobs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && blobs.length > 0) {
      const objectUrls = blobs.map(b => URL.createObjectURL(b));
      setUrls(objectUrls);
      setCurrentIndex(0);
      return () => objectUrls.forEach(u => URL.revokeObjectURL(u));
    }
  }, [isOpen, blobs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[300] flex flex-col justify-center items-center p-8 backdrop-blur-md">
       <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white hover:text-alert-red transition-colors bg-primary-black border-3 border-white p-2"
        >
          <X size={32} />
        </button>

        <h2 className="text-white font-mono text-3xl mb-4 font-bold tracking-widest uppercase">Batch Preview [{currentIndex + 1}/{urls.length}]</h2>

        <div className="relative w-full max-w-5xl aspect-video bg-primary-black border-3 border-primary-green shadow-[10px_10px_0px_#00c853] flex items-center justify-center p-2">
           {urls.length > 0 && (
             <img 
               src={urls[currentIndex]} 
               alt="Preview" 
               className="max-w-full max-h-full object-contain"
             />
           )}
           
           {urls.length > 1 && (
             <>
               <button 
                 onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                 disabled={currentIndex === 0}
                 className="absolute left-4 top-1/2 -translate-y-1/2 neo-button !p-3 disabled:opacity-50"
               >
                 <ChevronLeft size={32} />
               </button>
               <button 
                 onClick={() => setCurrentIndex(prev => Math.min(urls.length - 1, prev + 1))}
                 disabled={currentIndex === urls.length - 1}
                 className="absolute right-4 top-1/2 -translate-y-1/2 neo-button !p-3 disabled:opacity-50"
               >
                 <ChevronRight size={32} />
               </button>
             </>
           )}
        </div>
        
        <p className="text-gray-400 font-mono mt-6 text-sm">Showing the first {urls.length} certificates from your dataset.</p>
    </div>
  );
};
