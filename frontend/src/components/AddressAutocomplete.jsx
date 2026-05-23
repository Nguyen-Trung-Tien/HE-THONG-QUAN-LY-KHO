import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { cn } from "../utils/cn";
import { FiMapPin, FiLoader } from "react-icons/fi";

function AddressAutocomplete({ value, onChange, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (hasSelected) {
      setSuggestions([]);
      return;
    }

    if (!value || value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const viewbox = [106.4, 10.6, 106.9, 10.9].join(",");
        const res = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: value,
              format: "json",
              addressdetails: 1,
              limit: 5,
              viewbox,
              bounded: 1,
            },
          }
        );
        setSuggestions(res.data);
      } catch (err) {
        console.error("Autocomplete error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [value, hasSelected]);

  const handleChange = (e) => {
    onChange(e.target.value);
    setHasSelected(false); 
  };

  const handleSelect = (item) => {
    onSelect(item); 
    setSuggestions([]); 
    setHasSelected(true); 
  };

  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors z-10">
         <FiMapPin />
      </div>
      
      <input
        value={value}
        onChange={handleChange}
        placeholder="Số nhà, tên đường, phường/xã…"
        className="w-full pl-12 pr-12 py-3.5 bg-bg-subtle/30 dark:bg-dark-card/40 border border-border/50 dark:border-dark-border/60 text-text-primary text-xs rounded-2xl outline-none transition-all duration-300 focus:bg-white dark:focus:bg-dark-card focus:border-primary focus:ring-4 focus:ring-primary/5 font-bold shadow-inner-sm"
      />

      {loading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary animate-spin">
           <FiLoader size={16} />
        </div>
      )}

      {!hasSelected && suggestions.length > 0 && (
        <ul className="absolute z-[100] w-full bg-white dark:bg-dark-card border border-border/40 dark:border-dark-border/60 rounded-2xl mt-2 max-h-60 overflow-hidden shadow-soft-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="overflow-y-auto max-h-60 custom-scrollbar divide-y divide-border/20 dark:divide-white/5">
            {suggestions.map((s) => (
              <li
                key={s.place_id}
                className="px-5 py-3.5 hover:bg-primary/5 dark:hover:bg-white/[0.03] text-text-primary cursor-pointer text-[11px] font-bold transition-colors flex items-start gap-x-3 group/item"
                onClick={() => handleSelect(s)}
              >
                <FiMapPin className="mt-0.5 text-text-tertiary group-hover/item:text-primary transition-colors shrink-0" />
                <span className="leading-relaxed">{s.display_name}</span>
              </li>
            ))}
          </div>
        </ul>
      )}
    </div>
  );
}

export default AddressAutocomplete;
