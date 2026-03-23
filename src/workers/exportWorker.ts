import { Field } from '../store/useCertifyStore';
import { zipSync } from 'fflate';

interface GeneratePayload {
  imageBlob: Blob;
  fields: Field[];
  data: Record<string, string>[];
  templateDimensions: { width: number; height: number };
  stageDimensions: { width: number; height: number };
  isPreview?: boolean;
}

self.onmessage = async (e: MessageEvent<GeneratePayload>) => {
  const { imageBlob, fields, data, templateDimensions, stageDimensions, isPreview } = e.data;
  
  try {
    const bitmap = await self.createImageBitmap(imageBlob);
    
    // --- Load fonts dynamically for the OffscreenCanvas worker scope ---
    const uniqueFonts = Array.from(new Set(fields.map(f => f.fontFamily).filter(Boolean)));
    for (const font of uniqueFonts) {
      if (!font) continue;
      try {
        const url = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}&display=swap`;
        const cssRes = await fetch(url);
        const cssText = await cssRes.text();
        
        // Find Latin or generic WOFF2 block by parsing all urls and selecting the bottom-most robust one
        const urls = [...cssText.matchAll(/url\(([^)]+)\)/g)];
        if (urls.length > 0) {
           const fontUrlMatch = urls[urls.length - 1][1];
           const cleanUrl = fontUrlMatch.replace(/['"]/g, '');
           const fontFace = new FontFace(font, `url(${cleanUrl})`);
           await fontFace.load();
           (self as any).fonts.add(fontFace);
        }
      } catch (e) {
        console.warn(`Worker failed to load font ${font}`, e);
      }
    }
    // -----------------------------------------------------------------

    const scaleX = templateDimensions.width / stageDimensions.width;
    const scaleY = templateDimensions.height / stageDimensions.height;

    const canvas = new OffscreenCanvas(templateDimensions.width, templateDimensions.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get 2D context");

    const zipFiles: Record<string, Uint8Array> = {};
    const previewBlobs: Blob[] = [];

    let processedCount = 0;
    
    // Process only first 5 for preview, or all for zip
    const rowsToProcess = isPreview ? data.slice(0, 5) : data;

    for (const row of rowsToProcess) {
      // Draw background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      // Draw all fields
      for (const field of fields) {
        ctx.save();
        
        let text = row[field.mappedColumn] || '';
        if (!field.mappedColumn) {
           text = `[Static_${field.id}]`; 
        }
        
        const effX = field.autoCenterHorizontal ? (templateDimensions.width / 2 - field.width / 2) : field.x;
        const effY = field.autoCenterVertical ? (templateDimensions.height / 2 - field.height / 2) : field.y;

        const x = effX * scaleX;
        const y = effY * scaleY;
        const w = field.width * scaleX;
        const h = field.height * scaleY;

        let currentFontSize = field.fontSize * scaleY;
        const fontStyle = `${field.isItalic ? 'italic ' : ''}${field.isBold ? 'bold ' : ''}`;
        const fontFamily = field.fontFamily || '"Courier New", Courier, monospace';
        
        ctx.font = `${fontStyle}${currentFontSize}px ${fontFamily}, sans-serif`;
        ctx.fillStyle = field.color;

        // Auto shrink logic
        if (field.autoShrink) {
           let metrics = ctx.measureText(text);
           while (metrics.width > w && currentFontSize > 10) {
             currentFontSize -= 2;
             ctx.font = `${fontStyle}${currentFontSize}px ${fontFamily}, sans-serif`;
             metrics = ctx.measureText(text);
           }
        }

        ctx.textBaseline = field.verticalAlign === 'top' ? 'top' : (field.verticalAlign === 'middle' ? 'middle' : 'bottom');
        
        let drawX = x;
        let diffW = w - ctx.measureText(text).width;
        if (field.align === 'center') {
           drawX = x + diffW / 2;
        } else if (field.align === 'right') {
           drawX = x + diffW;
        }

        let drawY = y;
        if (field.verticalAlign === 'middle') {
          drawY = y + h / 2;
        } else if (field.verticalAlign === 'bottom') {
          drawY = y + h;
        }

        ctx.fillText(text, drawX, drawY);
        ctx.restore();
      }

      // Convert to blob
      const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: isPreview ? 0.7 : 1 });
      
      if (isPreview) {
        previewBlobs.push(blob);
      } else {
        const arrayBuffer = await blob.arrayBuffer();
        const fileName = `${data.indexOf(row) + 1}_${Object.values(row)[0] || 'cert'}.jpg`.replace(/[^a-z0-9_.-]/gi, '_');
        zipFiles[fileName] = new Uint8Array(arrayBuffer);
      }

      processedCount++;
      
      if (!isPreview && (processedCount % 5 === 0 || processedCount === data.length)) {
         self.postMessage({ type: 'PROGRESS', payload: { current: processedCount, total: rowsToProcess.length } });
      }
    }

    if (isPreview) {
      self.postMessage({ type: 'PREVIEW_COMPLETE', payload: { blobs: previewBlobs } });
    } else {
      self.postMessage({ type: 'PROGRESS_ZIP', payload: { status: 'Zipping files...' } });
      const zippedData = zipSync(zipFiles, { level: 6 });
      const zipBlob = new Blob([zippedData.buffer as ArrayBuffer], { type: 'application/zip' });
      self.postMessage({ type: 'COMPLETE', payload: { blob: zipBlob } });
    }
    
  } catch (error: any) {
    self.postMessage({ type: 'ERROR', payload: { error: error.message } });
  }
};
