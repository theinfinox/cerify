import React from "react";
import { useCertifyStore } from "../store/useCertifyStore";
import { PlusCircle, Trash2, Grid, AlignCenterHorizontal, AlignCenterVertical, AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd } from "lucide-react";
import { FontPicker } from "./FontPicker";

export const DataMapper: React.FC = () => {
  const { fields, addField, updateField, removeField, csvHeaders, templateDimensions, gridLevel, setGridLevel } = useCertifyStore();

  const handleAddField = () => {
    // Perfectly scaled bounds according to template!
    const w = templateDimensions ? templateDimensions.width * 0.6 : 300;
    const h = templateDimensions ? templateDimensions.height * 0.1 : 50;
    const defaultFontSize = templateDimensions ? Math.max(20, Math.floor(templateDimensions.height * 0.05)) : 40;
    
    const x = templateDimensions ? templateDimensions.width / 2 - w / 2 : 100;
    const y = templateDimensions ? templateDimensions.height / 2 - h / 2 : 100;

    addField({
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      width: w,
      height: h,
      align: 'center',
      verticalAlign: 'middle',
      fontSize: defaultFontSize,
      fontFamily: 'Inter',
      isBold: true,
      isItalic: false,
      color: '#0d0d0d',
      mappedColumn: csvHeaders[0] || 'Text',
      autoShrink: false,
      autoCenterHorizontal: false,
      autoCenterVertical: false,
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="neo-card flex flex-col gap-4">
        <h2 className="text-xl">DATA MAPPER</h2>
        <p className="font-mono text-xs text-gray-500">
          Map CSV columns to Canvas Text fields.
        </p>

        <div className="flex flex-col gap-2 mt-4 bg-gray-50 p-3 border-3 border-primary-black">
          <label className="text-xs font-mono font-bold flex items-center gap-2">
            <Grid size={16} /> GRID OVERLAY
          </label>
          <div className="flex gap-2">
            <select 
              className="neo-input w-2/3 text-sm font-mono"
              value={gridLevel}
              onChange={(e) => setGridLevel(e.target.value as any)}
            >
              <option value="off">OFF / NONE</option>
              <option value="low">LOW (Golden Ratio)</option>
              <option value="medium">MEDIUM (Quarters)</option>
              <option value="high">HIGH (10x10)</option>
            </select>
            <select 
              className="neo-input w-1/3 text-xs font-mono"
              value={useCertifyStore.getState().gridColor}
              onChange={(e) => useCertifyStore.getState().setGridColor(e.target.value as any)}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-2">
          {fields.map((field) => (
            <div key={field.id} className="border-3 border-primary-black p-3 flex flex-col gap-3 bg-gray-50 relative group">
              <button 
                className="absolute -top-3 -right-3 bg-alert-red text-white p-1 rounded-full border-3 border-primary-black hover:scale-110 transition-transform hidden group-hover:block z-10"
                onClick={() => removeField(field.id)}
              >
                <Trash2 size={16} />
              </button>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono font-bold">MAPPED COLUMN</label>
                <select 
                  className="neo-input w-full text-sm"
                  value={field.mappedColumn}
                  onChange={(e) => updateField(field.id, { mappedColumn: e.target.value })}
                >
                  <option value="">[Static Text]</option>
                  {csvHeaders.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                  {csvHeaders.length === 0 && <option disabled>No CSV Uploaded</option>}
                </select>
              </div>

              <div className="flex gap-2 relative">
                <div className="flex flex-col gap-1 w-2/3">
                  <label className="text-[10px] font-mono font-bold">FONT</label>
                  <FontPicker 
                    value={field.fontFamily}
                    onChange={(val) => updateField(field.id, { fontFamily: val })}
                  />
                </div>
                <div className="flex flex-col gap-1 w-1/3">
                  <label className="text-[10px] font-mono font-bold">STYLE</label>
                  <div className="flex gap-1 h-[46px]">
                    <button 
                      className={`flex-1 border-3 border-primary-black font-bold font-serif ${field.isBold ? 'bg-primary-green translate-x-[-2px] translate-y-[-2px] shadow-neo-sm' : 'bg-white'}`}
                      onClick={() => updateField(field.id, { isBold: !field.isBold })}
                    >B</button>
                    <button 
                       className={`flex-1 border-3 border-primary-black italic font-serif ${field.isItalic ? 'bg-primary-green translate-x-[-2px] translate-y-[-2px] shadow-neo-sm' : 'bg-white'}`}
                      onClick={() => updateField(field.id, { isItalic: !field.isItalic })}
                    >I</button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-2">
                 <div className="flex flex-col gap-1 w-1/2">
                    <label className="text-[10px] font-mono font-bold">COLOR</label>
                    <input 
                      type="color" 
                      className="w-full h-[46px] border-3 border-primary-black p-0 cursor-pointer"
                      value={field.color}
                      onChange={(e) => updateField(field.id, { color: e.target.value })}
                    />
                 </div>
                 <div className="flex flex-col gap-1 w-1/2">
                    <label className="text-[10px] font-mono font-bold">SIZE</label>
                    <input 
                      type="number" 
                      className="neo-input w-full text-sm h-[46px]"
                      value={field.fontSize}
                      onChange={(e) => updateField(field.id, { fontSize: Number(e.target.value) })}
                    />
                 </div>
              </div>

              <div className="flex gap-2 w-full mt-1">
                <div className="flex flex-col gap-1 w-1/3">
                  <label className="text-[8px] font-mono font-bold truncate">TEXT ALIGN</label>
                  <div className="flex h-[36px]">
                    <button className={`flex-1 border-2 border-primary-black flex items-center justify-center ${field.align === 'left' ? 'bg-primary-green' : 'bg-white'}`} onClick={() => updateField(field.id, { align: 'left' })}><AlignLeft size={14} /></button>
                    <button className={`flex-1 border-y-2 border-r-2 border-primary-black flex items-center justify-center ${field.align === 'center' ? 'bg-primary-green' : 'bg-white'}`} onClick={() => updateField(field.id, { align: 'center' })}><AlignCenter size={14} /></button>
                    <button className={`flex-1 border-y-2 border-r-2 border-primary-black flex items-center justify-center ${field.align === 'right' ? 'bg-primary-green' : 'bg-white'}`} onClick={() => updateField(field.id, { align: 'right' })}><AlignRight size={14} /></button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 w-1/3">
                  <label className="text-[8px] font-mono font-bold truncate">VERT. ALIGN</label>
                  <div className="flex h-[36px]">
                    <button className={`flex-1 border-2 border-primary-black flex items-center justify-center ${field.verticalAlign === 'top' ? 'bg-primary-green' : 'bg-white'}`} onClick={() => updateField(field.id, { verticalAlign: 'top' })}><AlignVerticalJustifyStart size={14} /></button>
                    <button className={`flex-1 border-y-2 border-r-2 border-primary-black flex items-center justify-center ${field.verticalAlign === 'middle' ? 'bg-primary-green' : 'bg-white'}`} onClick={() => updateField(field.id, { verticalAlign: 'middle' })}><AlignVerticalJustifyCenter size={14} /></button>
                    <button className={`flex-1 border-y-2 border-r-2 border-primary-black flex items-center justify-center ${field.verticalAlign === 'bottom' ? 'bg-primary-green' : 'bg-white'}`} onClick={() => updateField(field.id, { verticalAlign: 'bottom' })}><AlignVerticalJustifyEnd size={14} /></button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 w-1/3">
                  <label className="text-[8px] font-mono font-bold truncate text-center text-alert-red">AUTO-SHRINK</label>
                  <button 
                    className={`h-[36px] border-2 border-primary-black font-bold font-mono text-[10px] transition-colors ${field.autoShrink ? 'bg-alert-red text-white' : 'bg-white text-black'}`}
                    onClick={() => updateField(field.id, { autoShrink: !field.autoShrink })}
                  >
                    {field.autoShrink ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 bg-gray-200 p-2 border-3 border-primary-black mt-1">
                <label className="text-[10px] font-mono font-bold flex items-center gap-1">
                  <AlignCenterHorizontal size={12} /> AUTO ALIGN POSITION
                </label>
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-2 text-xs font-mono font-bold cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-primary-black cursor-pointer"
                      checked={field.autoCenterHorizontal} 
                      onChange={e => updateField(field.id, { autoCenterHorizontal: e.target.checked })} 
                    />
                    Horizontal Center
                  </label>
                  <label className="flex items-center gap-2 text-xs font-mono font-bold cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-primary-black cursor-pointer"
                      checked={field.autoCenterVertical} 
                      onChange={e => updateField(field.id, { autoCenterVertical: e.target.checked })} 
                    />
                    Vertical Center
                  </label>
                </div>
              </div>

            </div>
          ))}

          <button className="neo-button flex justify-center items-center gap-2 mt-2" onClick={handleAddField}>
            <PlusCircle size={20} />
            ADD TEXT FIELD
          </button>
        </div>
      </div>
    </div>
  );
};
