"use client"
import React, { createContext, useContext, useState } from 'react';

interface SearchContextType {
  search: string;
  setSearch: (q: string) => void;
  searching: boolean;
  setSearching: (v: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  return (
    <SearchContext.Provider value={{ search, setSearch, searching, setSearching }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}
