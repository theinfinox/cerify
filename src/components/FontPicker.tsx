import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const PRIORITY_FONTS = [
  "Playfair Display",
  "Libre Baskerville", 
  "Montserrat",
  "Alex Brush",
  "La Belle Aurore",
  "Pinyon Script",
  "Merriweather",
  "Raleway",
  "Great Vibes",
  "Lobster",
  "Roboto"
];

const OTHER_FONTS = [
  "Inter", "Open Sans", "Lato", "Oswald", "Source Sans Pro", "Slabo 27px", "PT Sans", 
  "Roboto Condensed", "Noto Sans", "Nunito", "Ubuntu", "PT Serif", "Roboto Slab", 
  "Mukta", "Poppins", "Work Sans", "Anton", "Fira Sans", "Inconsolata", "Lora", 
  "Dosis", "Titillium Web", "Bitter", "Crimson Text", "Varela Round", "Hind", 
  "Pacifico", "Josefin Sans", "Arimo", "Cabin", "Asap", "Oxygen", "Vollkorn", 
  "Ubuntu Condensed", "Dancing Script", "Cuprum", "Noto Serif", "Abhaya Libre", 
  "EB Garamond", "Exo 2", "Questrial", "Catamaran", "Signika",
  "Caveat", "Satisfy", "Courgette", "Cookie", "Sacramento", "Yellowtail", "Parisienne"
];

const GOOGLE_FONTS = Array.from(new Set([...PRIORITY_FONTS, ...OTHER_FONTS]));

let loadedFonts = new Set<string>();

const loadFontCSS = (families: string[]) => {
  const toLoad = families.filter(f => !loadedFonts.has(f) && f.trim() !== '');
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
  const isCustomFont = search.trim().length > 0 && !filtered.some(f => f.toLowerCase() === search.trim().toLowerCase());

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
      if (isCustomFont) {
         loadFontCSS([search.trim()]);
      }
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
        className="neo-input w-full h-[36px] flex justify-between items-center text-xs overflow-hidden"
        onClick={() => setOpen(!open)}
        style={{ fontFamily: value || 'Inter' }}
      >
        <span className="truncate">{value || 'Inter'}</span>
        <ChevronDown size={14} className="flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border-3 border-primary-black shadow-neo-base flex flex-col max-h-60 overflow-hidden">
          <div className="p-2 border-b-3 border-primary-black flex items-center gap-2 bg-gray-50">
            <Search size={14} className="text-gray-400" />
            <input 
              type="text" 
              className="w-full bg-transparent outline-none text-xs font-mono"
              placeholder="Search or type custom font..."
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <ul className="overflow-y-auto custom-scrollbar flex-grow">
            {filtered.map(f => (
              <li 
                key={f}
                className={`px-2 py-2 text-xs xl:text-sm cursor-pointer hover:bg-primary-green hover:text-white transition-colors border-b last:border-0 border-gray-100 ${value === f ? 'bg-black text-white' : 'text-black'}`}
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
            
            {isCustomFont && (
              <li 
                className="px-2 py-3 text-xs xl:text-sm cursor-pointer bg-primary-green text-primary-black font-bold border-t-2 border-primary-black"
                style={{ fontFamily: search.trim() }}
                onClick={() => {
                  onChange(search.trim());
                  setOpen(false);
                  setSearch('');
                }}
              >
                Use custom: "{search.trim()}"
              </li>
            )}

            {filtered.length === 0 && !isCustomFont && (
              <li className="p-3 text-center text-gray-400 text-xs font-mono font-bold">Type to load custom font</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
