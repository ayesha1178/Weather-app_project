import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, X, Loader2 } from "lucide-react";

const POPULAR_CITIES = [
  "London", "New York", "Tokyo", "Paris", "Sydney",
  "Dubai", "Singapore", "Mumbai", "Toronto", "Berlin",
  "Los Angeles", "Chicago", "Bangkok", "Istanbul", "Seoul",
];

export function SearchBar({ onSearch, onLocate, loading, locating }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (query.length >= 2) {
      const filtered = POPULAR_CITIES.filter((c) =>
        c.toLowerCase().startsWith(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setSuggestions([]);
      setFocused(false);
      inputRef.current?.blur();
    }
  }

  function handleSuggestion(city) {
    setQuery(city);
    onSearch(city);
    setSuggestions([]);
    setFocused(false);
    inputRef.current?.blur();
  }

  function handleClear() {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  }

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit}>
        <motion.div
          className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-3 shadow-lg"
          animate={{
            boxShadow: focused
              ? "0 0 0 2px rgba(255,255,255,0.5), 0 8px 32px rgba(0,0,0,0.2)"
              : "0 4px 16px rgba(0,0,0,0.15)",
          }}
          transition={{ duration: 0.2 }}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 text-white/70 animate-spin shrink-0" />
          ) : (
            <Search className="w-5 h-5 text-white/70 shrink-0" />
          )}
          <input
            ref={inputRef}
            data-testid="input-city-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search city..."
            className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-base font-medium"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                type="button"
                onClick={handleClear}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-white/60 hover:text-white transition-colors"
                data-testid="button-clear-search"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
          <div className="w-px h-5 bg-white/20 mx-1" />
          <motion.button
            type="button"
            onClick={onLocate}
            whileTap={{ scale: 0.95 }}
            disabled={locating}
            className="text-white/70 hover:text-white transition-colors disabled:opacity-50"
            title="Use my location"
            data-testid="button-locate"
          >
            {locating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <MapPin className="w-5 h-5" />
            )}
          </motion.button>
        </motion.div>
      </form>

      <AnimatePresence>
        {focused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden shadow-2xl z-50"
          >
            {suggestions.map((city, i) => (
              <motion.button
                key={city}
                type="button"
                onClick={() => handleSuggestion(city)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors text-left"
                data-testid={`suggestion-${city.toLowerCase().replace(/\s/g, "-")}`}
              >
                <Search className="w-4 h-4 text-white/50" />
                <span className="font-medium">{city}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
