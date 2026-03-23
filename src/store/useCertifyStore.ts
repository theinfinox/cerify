import { create } from 'zustand';

export interface Field {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  align: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'middle' | 'bottom';
  fontSize: number;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  color: string;
  mappedColumn: string;
  autoShrink: boolean;
  autoCenterHorizontal: boolean;
  autoCenterVertical: boolean;
}

interface AppState {
  templateImage: string | null;
  templateDimensions: { width: number; height: number } | null;
  fields: Field[];
  csvData: Record<string, string>[];
  csvHeaders: string[];
  selectedFieldId: string | null;
  gridLevel: 'off' | 'low' | 'medium' | 'high';
  gridColor: 'dark' | 'light';
  
  // Actions
  setTemplateImage: (url: string, width: number, height: number) => void;
  addField: (field: Field) => void;
  updateField: (id: string, updates: Partial<Field>) => void;
  removeField: (id: string) => void;
  setCsvData: (data: Record<string, string>[], headers: string[]) => void;
  setSelectedField: (id: string | null) => void;
  setGridLevel: (level: 'off' | 'low' | 'medium' | 'high') => void;
  setGridColor: (color: 'dark' | 'light') => void;
  resetAll: () => void;
}

export const useCertifyStore = create<AppState>((set) => ({
  templateImage: null,
  templateDimensions: null,
  fields: [],
  csvData: [],
  csvHeaders: [],
  selectedFieldId: null,
  gridLevel: 'off',
  gridColor: 'dark',

  setTemplateImage: (url, width, height) => set({
    templateImage: url,
    templateDimensions: { width, height }
  }),

  addField: (field) => set((state) => ({
    fields: [...state.fields, field]
  })),

  updateField: (id, updates) => set((state) => ({
    fields: state.fields.map(f => f.id === id ? { ...f, ...updates } : f)
  })),

  removeField: (id) => set((state) => ({
    fields: state.fields.filter(f => f.id !== id)
  })),

  setCsvData: (data, headers) => set({
    csvData: data,
    csvHeaders: headers
  }),
  
  setSelectedField: (id) => set({
    selectedFieldId: id
  }),
  
  setGridLevel: (level) => set({
    gridLevel: level
  }),
  
  setGridColor: (color) => set({
    gridColor: color
  }),

  resetAll: () => set({
    templateImage: null,
    templateDimensions: null,
    fields: [],
    csvData: [],
    csvHeaders: [],
    selectedFieldId: null,
    gridLevel: 'off',
    gridColor: 'dark'
  })
}));
