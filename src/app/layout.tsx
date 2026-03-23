import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CertifyBulk | High-Res Bulk Certificate Generator",
  description: "A lightning-fast, entirely client-side PWA for generating mass high-resolution certificates locally using dynamic CSV data mappings. Engineered with Neo-Brutalist aesthetics.",
  keywords: "bulk certificate generator, CSV to certificates, PWA, client-side exporter, automate certificates, generate dynamic images, neo-brutalism, React canvas editor, high resolution",
  authors: [{ name: "Govind SR", url: "https://govindsr.me" }],
  creator: "Govind SR (@theinfinox)",
  openGraph: {
    title: "CertifyBulk | High-Res Bulk Generator",
    description: "Map your CSV data directly onto High-Res templates and instantly export ZIP bundles right in your browser.",
    siteName: "CertifyBulk PWA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CertifyBulk | Mass Certificate Engine",
    description: "Generate 100s of crisp certificates entirely offline securely in your browser.",
    creator: "@theinfinox"
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%2300C853%22 rx=%2220%22 stroke=%22%230d0d0d%22 stroke-width=%228%22/><text y=%2250%22 x=%2250%22 fill=%22%230d0d0d%22 font-family=%22monospace%22 font-weight=%22900%22 font-size=%2255%22 text-anchor=%22middle%22 dominant-baseline=%22central%22>CB</text></svg>",
  },
  manifest: "/manifest.json",
  themeColor: "#0d0d0d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;800&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <div 
          id="global-loader-container"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
             __html: `
               <div id="global-loader" style="position: fixed; inset: 0; z-index: 9999; background-color: #f8f9fa; color: #0d0d0d; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: transform 0.6s cubic-bezier(0.87, 0, 0.13, 1);">
                  <div style="display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 28rem; padding: 0 2rem;">
                    
                    <h1 style="font-size: 4rem; font-family: 'Inter', sans-serif; font-weight: 800; letter-spacing: -2px; line-height: 1; color: #00C853; text-transform: uppercase; margin-bottom: 3rem; text-align: center; text-shadow: 6px 6px 0px #0d0d0d, -2px -2px 0px #0d0d0d, 2px -2px 0px #0d0d0d, -2px 2px 0px #0d0d0d, 2px 2px 0px #0d0d0d; animation: floatLoader 2s ease-in-out infinite;">
                      Certify<br/>Bulk
                    </h1>
                    
                    <div style="width: 100%; height: 3rem; border: 3px solid #0d0d0d; background-color: #ffffff; box-shadow: 8px 8px 0px #0d0d0d; border-radius: 12px; position: relative; margin-bottom: 2rem; overflow: hidden;">
                      <div id="global-loader-bar" style="position: absolute; top: -3px; left: -3px; bottom: -3px; background-color: #00C853; width: 0%; border-right: 3px solid #0d0d0d; transition: width 0.15s ease-out;"></div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; width: 100%; font-family: 'Courier New', Courier, monospace; font-size: 1.5rem; font-weight: bold; color: #0d0d0d;">
                      <span id="global-loader-text">LOADING<span id="loader-dots">...</span></span>
                      <span id="global-loader-percent">0%</span>
                    </div>
                  </div>
                  
                  <style>
                    @keyframes floatLoader {
                      0%, 100% { transform: translateY(0) scale(1) rotate(-1deg); }
                      50% { transform: translateY(-15px) scale(1.02) rotate(1deg); }
                    }
                  </style>
               </div>
               <script>
                  (function() {
                    var bar = document.getElementById('global-loader-bar');
                    var pct = document.getElementById('global-loader-percent');
                    var txt = document.getElementById('global-loader-text');
                    var dots = document.getElementById('loader-dots');
                    var loader = document.getElementById('global-loader');
                    var progress = 0;
                    var dotCount = 0;
                    
                    var dotInterval = setInterval(function() {
                       dotCount = (dotCount + 1) % 4;
                       var d = '';
                       for(var i=0; i<dotCount; i++) d += '.';
                       if(dots) dots.innerText = d;
                    }, 400);

                    var interval = setInterval(function() {
                       if (progress < 90) {
                          progress += Math.random() * 5 + 1;
                       }
                       if (progress > 90) progress = 90;
                       
                       bar.style.width = Math.floor(progress) + '%';
                       pct.innerText = Math.floor(progress) + '%';
                       
                       if (window.__certify_hydrated) {
                          progress = 100;
                          bar.style.width = '100%';
                          pct.innerText = '100%';
                          txt.innerHTML = 'READY<span id="loader-dots"></span>';
                          clearInterval(interval);
                          clearInterval(dotInterval);
                          
                          setTimeout(function() {
                            loader.style.transform = 'translateY(-100%)';
                            setTimeout(function() {
                               var container = document.getElementById('global-loader-container');
                               if(container) container.remove();
                            }, 600);
                          }, 400);
                       }
                    }, 50);
                  })();
               </script>
             `
          }}
        />
        {children}
      </body>
    </html>
  );
}
