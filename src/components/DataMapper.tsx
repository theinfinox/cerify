"use client";

import React from "react";
import { useCertifyStore } from "../store/useCertifyStore";
import { PlusCircle, Trash2, Grid } from "lucide-react";

export const DataMapper: React.FC = () => {
  const { fields, addField, updateField, removeField, csvHeaders, templateDimensions, gridLevel, setGridLevel } = useCertifyStore();

  const handleAddField = () => {
    const x = templateDimensions ? templateDimensions.width / 2 - 150 : 100;
    const y = templateDimensions ? templateDimensions.height / 2 - 25 : 100;

    addField({
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      width: 300,
      height: 50,
      align: 'center',
      verticalAlign: 'middle',
      fontSize: 40,
      fontFamily: 'Inter',
      isBold: true,
      isItalic: false,
      color: '#0d0d0d',
      mappedColumn: csvHeaders[0] || 'Text',
      autoShrink: false,
    });
  };

  const fonts = ['Inter', 'Courier New', 'Roboto', 'Open Sans', 'Montserrat', 'Lato', 'Oswald', 'Raleway', 'Playfair Display'];

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
          <select 
            className="neo-input w-full text-sm font-mono"
            value={gridLevel}
            onChange={(e) => setGridLevel(e.target.value as any)}
          >
            <option value="off">OFF</option>
            <option value="low">LOW (Center + Golden Ratio)</option>
            <option value="medium">MEDIUM (Low + Quarters)</option>
            <option value="high">HIGH (10x10 Grid)</option>
          </select>
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

              <div className="flex gap-2">
                <div className="flex flex-col gap-1 w-2/3">
                  <label className="text-[10px] font-mono font-bold">FONT</label>
                  <select 
                    className="neo-input w-full text-sm h-[46px]"
                    value={field.fontFamily || 'Inter'}
                    onChange={(e) => updateField(field.id, { fontFamily: e.target.value })}
                  >
                    {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
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
