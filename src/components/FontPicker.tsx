import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const GOOGLE_FONTS = [
  "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Source Sans Pro", 
  "Slabo 27px", "Raleway", "PT Sans", "Merriweather", "Roboto Condensed", "Noto Sans", 
  "Nunito", "Playfair Display", "Ubuntu", "PT Serif", "Roboto Slab", "Mukta", "Poppins", 
  "Work Sans", "Anton", "Fira Sans", "Inconsolata", "Lora", "Dosis", "Titillium Web", 
  "Bitter", "Crimson Text", "Varela Round", "Hind", "Pacifico", "Josefin Sans", "Arimo", 
  "Cabin", "Asap", "Oxygen", "Vollkorn", "Ubuntu Condensed", "Dancing Script", "Cuprum", 
  "Noto Serif", "Abhaya Libre", "EB Garamond", "Exo 2", "Questrial", "Catamaran", "Signika"
];

let loadedFonts = new Set<string>();

const loadFontCSS = (families: string[]) => {
  const toLoad = families.filter(f => !loadedFonts.has(f));
  if (toLoad.length === 0) return;
  toLoad.forEach(f => loadedFonts.add(f));

  // Combine to max 10 to avoid URI too long
  for (let i = 0; i < toLoad.length; i += 10) {
    const chunk = toLoad.slice(i, i + 10);
    const familyQuery = chunk.map(f => `family=${f.replace(/ /g, '+')}`).join('&');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${familyQuery}&display=swap`;
    document.head.appendChild(link);
  }
};

interface FontPickerProps {
  value: string;
  onChange: (val: string) => void;
}

export const FontPicker: React.FC<FontPickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = GOOGLE_FONTS.filter(f => f.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    // Load initial font if not loaded
    if (value && !loadedFonts.has(value)) {
      loadFontCSS([value]);
    }
  }, [value]);

  useEffect(() => {
    if (open) {
      // Lazy load only the filtered list visible to user so they can preview it
      loadFontCSS(filtered.slice(0, 20));
    }
  }, [open, search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button 
        className="neo-input w-full h-[46px] flex justify-between items-center text-sm overflow-hidden"
        onClick={() => setOpen(!open)}
        style={{ fontFamily: value || 'Inter' }}
      >
        <span className="truncate">{value || 'Inter'}</span>
        <ChevronDown size={16} className="flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border-3 border-primary-black shadow-neo-base flex flex-col max-h-60 overflow-hidden">
          <div className="p-2 border-b-3 border-primary-black flex items-center gap-2 bg-gray-50">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              className="w-full bg-transparent outline-none text-sm font-mono"
              placeholder="Search Google Fonts..."
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <ul className="overflow-y-auto custom-scrollbar flex-grow">
            {filtered.map(f => (
              <li 
                key={f}
                className={`px-3 py-2 cursor-pointer hover:bg-primary-green hover:text-white transition-colors border-b last:border-0 border-gray-100 ${value === f ? 'bg-black text-white' : 'text-black'}`}
                style={{ fontFamily: f }}
                onClick={() => {
                  onChange(f);
                  setOpen(false);
                  setSearch('');
                }}
              >
                {f}
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="p-3 text-center text-gray-400 text-xs font-mono font-bold">No fonts found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
