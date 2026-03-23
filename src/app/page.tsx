"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Toolbar } from "../components/Toolbar";
import { DataMapper } from "../components/DataMapper";
import { Uploader } from "../components/Uploader";
import { PreviewModal } from "../components/PreviewModal";
import { WarningModal } from "../components/WarningModal";
import { ProgressOverlay } from "../components/ProgressOverlay";
import { useCertifyStore } from "../store/useCertifyStore";
import { DownloadCloud, Eye, Heart } from "lucide-react";

import Link from 'next/link';
import { SplashScreen } from "../components/SplashScreen";

// Dynamically import CanvasEditor to prevent SSR issues with react-konva / canvas
const CanvasEditor = dynamic(
  () => import("../components/CanvasEditor").then((mod) => mod.CanvasEditor),
  { ssr: false }
);

export default function Home() {
  const { csvData, fields, templateImage, templateDimensions } = useCertifyStore();
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewBlobs, setPreviewBlobs] = useState<Blob[]>([]);
  
  const [workerState, setWorkerState] = useState({
    isExecuting: false,
    current: 0,
    total: 0,
    statusText: ""
  });
  
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // We clean up worker on unmount
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleProcess = async (isPreview: boolean) => {
    if (!templateImage || !templateDimensions) {
      alert("Please upload a template image first.");
      return;
    }
    
    if (csvData.length === 0 && !isPreview) {
      alert("Please upload CSV data for generating certificates.");
      return;
    }

    const dataToProcess = csvData.length > 0 ? csvData : [{}]; // Dummy data for preview if no CSV

    setWorkerState({
      isExecuting: true,
      current: 0,
      total: isPreview ? Math.min(5, dataToProcess.length) : dataToProcess.length,
      statusText: isPreview ? "GENERATING PREVIEWS..." : "STARTING ZIP GENERATION..."
    });

    const config = {
      imageBlob: await fetch(templateImage).then(r => r.blob()),
      fields: fields,
      data: dataToProcess,
      templateDimensions,
      isPreview
    };

    workerRef.current = new Worker(new URL('../workers/exportWorker', import.meta.url), { type: 'module' });
    
    workerRef.current.onmessage = (e) => {
      const { type, payload } = e.data;
      if (type === 'PROGRESS') {
        setWorkerState(prev => ({ ...prev, current: payload.current, total: payload.total }));
      } else if (type === 'PROGRESS_ZIP') {
        setWorkerState(prev => ({ ...prev, statusText: payload.status }));
      } else if (type === 'PREVIEW_COMPLETE') {
        setWorkerState({ isExecuting: false, current: 0, total: 0, statusText: "DONE" });
        setPreviewBlobs(payload.blobs);
        setPreviewModalOpen(true);
        workerRef.current?.terminate();
      } else if (type === 'COMPLETE') {
        setWorkerState({ isExecuting: false, current: 0, total: 0, statusText: "DONE" });
        
        const blobUrl = URL.createObjectURL(payload.blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = "certificates.zip";
        a.click();
        
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        workerRef.current?.terminate();
      } else if (type === 'ERROR') {
         alert("Generator Error: " + payload.error);
         setWorkerState({ isExecuting: false, current: 0, total: 0, statusText: "" });
         workerRef.current?.terminate();
      }
    };

    const absoluteDimensions = { width: templateDimensions.width, height: templateDimensions.height };

    workerRef.current.postMessage({
      ...config,
      stageDimensions: absoluteDimensions
    });
  };

  const handleCancelExport = () => {
    workerRef.current?.terminate();
    setWorkerState({ isExecuting: false, current: 0, total: 0, statusText: "CANCELLED" });
  };

  return (
    <>
    <SplashScreen />
    <main className="min-h-screen xl:h-screen xl:overflow-hidden p-4 md:p-6 flex flex-col gap-4 xl:gap-6 max-w-[2400px] mx-auto">
      <header className="flex-shrink-0 flex flex-col md:flex-row justify-between items-center gap-4 bg-primary-black text-white p-4 md:p-6 neo-card rounded-none">
        <div className="text-center md:text-left">
           <h1 className="text-xl md:text-3xl m-0 leading-none text-primary-green tracking-widest font-mono uppercase font-bold">CertifyBulk v1.0</h1>
           <p className="font-mono text-[10px] md:text-sm uppercase mt-1 md:mt-2">Make certificates in bulk with ease</p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-4 w-full md:w-auto">
           <Link href="/guides">
             <button className="neo-button bg-transparent text-white border-white shadow-[4px_4px_0px_#ffffff] md:shadow-[6px_6px_0px_#ffffff] hover:shadow-[8px_8px_0px_#ffffff] text-xs md:text-base px-3 py-2 md:px-4 uppercase">
                DOCS
             </button>
           </Link>
           <button 
              className="neo-button bg-white text-primary-black hover:bg-white border-white shadow-[4px_4px_0px_#ffffff] md:shadow-[6px_6px_0px_#ffffff] hover:shadow-[8px_8px_0px_#ffffff] text-xs md:text-base px-3 py-2 md:px-4"
              onClick={() => handleProcess(true)}
           >
              <Eye className="inline mr-2" size={16} /> PREVIEW
           </button>
           <button 
              className="neo-button bg-primary-green text-primary-black hover:bg-primary-green border-white shadow-[4px_4px_0px_#ffffff] md:shadow-[6px_6px_0px_#ffffff] hover:shadow-[8px_8px_0px_#ffffff] text-xs md:text-base px-3 py-2 md:px-4"
              onClick={() => handleProcess(false)}
           >
              <DownloadCloud className="inline mr-2" size={16} /> GENERATE
           </button>
        </div>
      </header>

      <div className="flex-grow flex flex-col xl:flex-row gap-6 items-start min-h-0 w-full mb-2">
         {/* Sidebar */}
         <div className="flex flex-col gap-6 w-full xl:w-[400px] flex-shrink-0 h-auto xl:h-full xl:overflow-y-auto pb-4 xl:pr-2 custom-scrollbar">
           <Uploader />
           <DataMapper />
         </div>

         {/* Editor Area */}
         <div className="w-full xl:flex-grow h-[60vh] xl:h-full bg-gray-200 border-3 border-primary-black shadow-neo-base relative flex items-center justify-center overflow-auto custom-scrollbar">
           <CanvasEditor />
         </div>
      </div>

      <WarningModal isOpen={safetyModalOpen} onClose={() => setSafetyModalOpen(false)} />
      
      <PreviewModal 
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        blobs={previewBlobs}
      />
      
      <ProgressOverlay 
         isOpen={workerState.isExecuting} 
         current={workerState.current}
         total={workerState.total}
         statusText={workerState.statusText}
         onCancel={handleCancelExport}
       />
       
       <footer className="w-full flex-shrink-0 mt-auto pt-3 pb-1 border-t-4 border-primary-black text-center font-mono font-bold flex flex-wrap items-center justify-center gap-2 text-[10px] md:text-sm bg-bg-color z-10 relative">
         MADE WITH <Heart size={14} fill="currentColor" className="text-alert-red animate-pulse" /> BY 
         <a href="https://govindsr.me" target="_blank" rel="noopener noreferrer" className="bg-primary-black text-white px-2 py-1 mx-1 hover:-translate-y-1 shadow-[2px_2px_0px_#00C853] hover:shadow-[4px_4px_0px_#00C853] transition-all border-2 border-primary-black cursor-pointer">@theinfinox</a>
       </footer>
    </main>
    </>
  );
}
