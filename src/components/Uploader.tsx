"use client";

import React, { useRef } from "react";
import Papa from "papaparse";
import { useCertifyStore } from "../store/useCertifyStore";
import { UploadCloud, FileSpreadsheet, Trash2 } from "lucide-react";

export const Uploader: React.FC = () => {
  const { setTemplateImage, setCsvData, templateImage, csvHeaders, resetAll } = useCertifyStore();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Error: Image exceeds 10MB memory limit.");
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setTemplateImage(url, img.width, img.height);
    };
    img.src = url;
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.meta.fields) {
          setCsvData(results.data as Record<string, string>[], results.meta.fields);
        }
      },
      error: () => {
        alert("Failed to parse CSV. Please ensure it is a valid format.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="neo-card flex flex-col gap-4">
        <h2 className="text-xl">RESOURCES</h2>
        
        <div className="flex flex-col gap-2">
           <input 
             type="file" 
             accept="image/png, image/jpeg" 
             className="hidden" 
             ref={imageInputRef}
             onChange={handleImageUpload}
           />
           <button 
             className="neo-button flex justify-center items-center gap-2"
             onClick={() => imageInputRef.current?.click()}
           >
             <UploadCloud size={20} />
             {templateImage ? "CHANGE TEMPLATE" : "UPLOAD IMAGE (MAX 10MB)"}
           </button>
        </div>

        <div className="flex flex-col gap-2 mt-2">
           <input 
             type="file" 
             accept=".csv" 
             className="hidden" 
             ref={csvInputRef}
             onChange={handleCsvUpload}
           />
           <button 
             className="neo-button flex justify-center items-center gap-2 bg-white text-primary-black hover:bg-white"
             onClick={() => csvInputRef.current?.click()}
           >
             <FileSpreadsheet size={20} />
             {csvHeaders.length > 0 ? `${csvHeaders.length} COLUMNS LOADED` : "UPLOAD DATA CSV"}
           </button>
        </div>

        <button 
          className="neo-button neo-button-danger flex justify-center items-center gap-2 mt-4"
          onClick={resetAll}
        >
          <Trash2 size={20} />
          CLEAR ALL
        </button>
      </div>
    </div>
  );
};
