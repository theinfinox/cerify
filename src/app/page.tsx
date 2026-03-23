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
import { DownloadCloud, Eye } from "lucide-react";

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
    <main className="min-h-screen p-4 md:p-8 flex flex-col gap-8 max-w-[2400px] mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-primary-black text-white p-6 neo-card rounded-none">
        <div className="text-center md:text-left">
           <h1 className="text-2xl md:text-3xl m-0 leading-none text-primary-green tracking-widest font-mono uppercase font-bold">CertifyBulk</h1>
           <p className="font-mono text-xs md:text-sm uppercase mt-2">Production-Ready High Resolution Exporter</p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-4 w-full md:w-auto">
           <button 
              className="neo-button bg-white text-primary-black hover:bg-white border-white shadow-[6px_6px_0px_#ffffff] hover:shadow-[10px_10px_0px_#ffffff] text-xs md:text-base px-4 py-2"
              onClick={() => handleProcess(true)}
           >
              <Eye className="inline mr-2" size={18} /> PREVIEW
           </button>
           <button 
              className="neo-button bg-primary-green text-primary-black hover:bg-primary-green border-white shadow-[6px_6px_0px_#ffffff] hover:shadow-[10px_10px_0px_#ffffff] text-xs md:text-base px-4 py-2"
              onClick={() => handleProcess(false)}
           >
              <DownloadCloud className="inline mr-2" size={18} /> GENERATE
           </button>
        </div>
      </header>

      <div className="flex flex-col xl:flex-row gap-8 items-start h-auto xl:h-[calc(100vh-200px)]">
         {/* Sidebar */}
         <div className="flex flex-col gap-6 w-full xl:w-[400px] flex-shrink-0 h-auto xl:h-full xl:overflow-y-auto pb-8 xl:pr-2 custom-scrollbar">
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
    </main>
    </>
  );
}
