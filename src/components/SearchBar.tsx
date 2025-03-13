
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceTime?: number;
}

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder, 
  debounceTime = 300 
}: SearchBarProps) => {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState(value);
  
  // Use a local state to prevent excessive filtering during typing
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  // Debounce the search to improve performance
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue !== value) {
        onChange(inputValue);
      }
    }, debounceTime);
    
    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, value, onChange, debounceTime]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleClear = () => {
    setInputValue('');
    onChange('');
  };
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder || t('search.businessOrService')}
        value={inputValue}
        onChange={handleChange}
        className="pl-10 pr-10 w-full"
      />
      {inputValue && (
        <button 
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
