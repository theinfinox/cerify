import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-bg-color text-primary-black font-main">
      <nav className="sticky top-0 z-50 bg-primary-black text-white p-4 md:p-6 border-b-4 border-white flex justify-between items-center neo-card rounded-none">
         <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-3xl font-mono font-bold text-primary-green uppercase tracking-widest drop-shadow-[2px_2px_0_#ffffff]">Docs & Guides</h1>
         </div>
         <Link href="/">
           <button className="neo-button bg-white text-primary-black text-xs md:text-sm px-4 py-2 hover:bg-gray-100 shadow-[4px_4px_0_#ffffff] hover:shadow-[6px_6px_0_#ffffff] transition-all">
              RETURN TO HOME
           </button>
         </Link>
      </nav>

      <main className="max-w-4xl mx-auto space-y-12 p-6 md:p-12 pb-24">
         
         {/* Demo Video Section */}
         <section className="neo-card bg-white p-6 md:p-10 border-4 border-primary-black">
            <h2 className="text-2xl md:text-3xl font-black mb-6 uppercase tracking-tighter shadow-[2px_2px_0_#0d0d0d] bg-primary-green inline-block px-4 py-2 border-2 border-primary-black">Video Walkthrough</h2>
            <div className="text-base md:text-lg leading-relaxed space-y-4">
               <p>
                  Watch this quick video tutorial to easily understand how to map your CSV variables and aggressively generate thousands of heavy certificates locally in seconds.
               </p>
               <div className="w-full aspect-video border-4 border-primary-black shadow-[6px_6px_0_#0d0d0d] bg-primary-black relative mt-6">
                 <iframe 
                   className="absolute top-0 left-0 w-full h-full"
                   src="https://www.youtube.com/embed/U1GBDmYsXI4" 
                   title="CertifyBulk Demo Tutorial" 
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowFullScreen
                 ></iframe>
               </div>
            </div>
         </section>

         {/* Step 1 */}
         <section className="neo-card bg-white p-6 md:p-10 border-4 border-primary-black">
            <h2 className="text-2xl md:text-3xl font-black mb-6 uppercase tracking-tighter shadow-[2px_2px_0_#0d0d0d] bg-primary-green inline-block px-4 py-2 border-2 border-primary-black">1. Prepare Your CSV Data</h2>
            <div className="text-base md:text-lg leading-relaxed space-y-4">
               <p>
                  Before generating any certificates, you must organize your variable data into a <strong className="bg-primary-black text-primary-green px-2 py-1 uppercase rounded-sm border border-primary-green shadow-[2px_2px_0_#00C853]">.CSV</strong> (Comma-Separated Values) format. 
               </p>
               <p>
                  The <span className="bg-yellow-300 font-bold px-1 border border-black">FIRST ROW</span> of your CSV file MUST contain column headers. These exact headers will be used to map the text! 
               </p>
               <div className="bg-gray-100 p-4 border-2 border-primary-black font-mono text-sm shadow-[4px_4px_0_#0d0d0d]">
                  <p className="text-gray-500 mb-2">// Example format (data.csv)</p>
                  <p className="font-bold text-primary-green bg-black px-2 pb-1 inline-block">FullName, CertificateID, DateOfIssue</p>
                  <p>John Doe, CERT-101, 10/12/2026</p>
                  <p>Jane Smith, CERT-102, 10/12/2026</p>
               </div>
            </div>
         </section>

         {/* Step 2 */}
         <section className="neo-card bg-white p-6 md:p-10 border-4 border-primary-black">
            <h2 className="text-2xl md:text-3xl font-black mb-6 uppercase tracking-tighter shadow-[2px_2px_0_#0d0d0d] bg-primary-green inline-block px-4 py-2 border-2 border-primary-black">2. Upload Template</h2>
            <div className="text-base md:text-lg leading-relaxed space-y-4">
               <p>
                  Upload a high-resolution <span className="underline decoration-wavy decoration-alert-red font-bold">Base Image Template</span>. This image should be completely blank where the text is supposed to go.
               </p>
               <p>
                  The canvas workspace will dynamically scale this template onto your screen, but the final generated ZIP will export natively at the exact resolution of the original template you uploaded!
               </p>
            </div>
         </section>

         {/* Step 3 */}
         <section className="neo-card bg-white p-6 md:p-10 border-4 border-primary-black">
            <h2 className="text-2xl md:text-3xl font-black mb-6 uppercase tracking-tighter shadow-[2px_2px_0_#0d0d0d] bg-primary-green inline-block px-4 py-2 border-2 border-primary-black">3. Mapping Fields</h2>
            <div className="text-base md:text-lg leading-relaxed space-y-4">
               <p>
                  Click the <strong className="bg-primary-black text-white px-2 py-1 text-sm">+ ADD FIELD</strong> button to drop a new text bounding box onto the template.
               </p>
               <ul className="list-disc leading-loose pl-6 font-mono text-sm space-y-4">
                  <li><span className="bg-gray-200 border border-black px-1 font-bold">DRAG & DROP</span> to position the text accurately.</li>
                  <li><span className="bg-gray-200 border border-black px-1 font-bold">RESIZE BOX</span> by dragging the corners. The text will automatically shrink if <span className="bg-primary-green text-black px-1">Auto-Shrink</span> is enabled!</li>
                  <li><span className="bg-gray-200 border border-black px-1 font-bold">MAPPED COLUMN</span>: Click the dropdown next to the field controller and attach it to a specific header from your CSV. Every certificate will inject that exact column!</li>
                  <li><span className="bg-gray-200 border border-black px-1 font-bold">AUTO-ALIGN</span>: Inside the DataMapper settings for the text, check the boxes to perfectly force the bounding box to center horizontally or vertically relative to your entire template.</li>
               </ul>
            </div>
         </section>

         {/* Step 4 */}
         <section className="neo-card bg-white p-6 md:p-10 border-4 border-primary-black">
            <h2 className="text-2xl md:text-3xl font-black mb-6 uppercase tracking-tighter shadow-[2px_2px_0_#0d0d0d] bg-primary-green inline-block px-4 py-2 border-2 border-primary-black">4. Generating</h2>
            <div className="text-base md:text-lg leading-relaxed space-y-4">
               <p>
                  To make sure everything is perfect without rendering hundreds of images, click the <strong className="bg-white border-2 border-black px-2 py-1 text-sm shadow-[2px_2px_0_#000]">PREVIEW</strong> button on the header to render the first 5 rows instantly!
               </p>
               <p>
                  Once completely satisfied, aggressively click the <strong className="bg-primary-green border-2 border-black px-2 py-1 text-sm shadow-[2px_2px_0_#000]">GENERATE</strong> button. The app will utilize local processor threads via a WebWorker to process your thousands of files entirely offline, and generate a `.ZIP` file.
               </p>
            </div>
         </section>
      </main>

      <footer className="w-full pb-8 text-center font-mono font-bold flex flex-wrap items-center justify-center gap-2 text-sm bg-bg-color z-10 relative">
         MADE WITH <Heart size={16} fill="currentColor" className="text-alert-red animate-pulse" /> BY 
         <a href="https://govindsr.me" target="_blank" rel="noopener noreferrer" className="bg-primary-black text-white px-2 py-1 mx-1 hover:-translate-y-1 shadow-[2px_2px_0px_#00C853] hover:shadow-[4px_4px_0px_#00C853] transition-all border-2 border-primary-black cursor-pointer">@theinfinox</a>
      </footer>
    </div>
  );
}
