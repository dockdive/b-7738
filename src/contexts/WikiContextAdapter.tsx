
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WikiEntry, WikiPage, WikiCategory } from '@/types';

// This adapter helps fix type issues in the original WikiContext
interface WikiContextAdapterProps {
  children: React.ReactNode;
}

// The adapter creates a safe context that converts string IDs to numbers when needed
export const WikiContextAdapter: React.FC<WikiContextAdapterProps> = ({ children }) => {
  // Safely convert string to number for comparisons
  const safeNumberConversion = (value: string | number): number => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return value;
  };

  // Patch window object to provide safe conversion function
  if (typeof window !== 'undefined') {
    (window as any).safeNumberConversion = safeNumberConversion;
  }

  return <>{children}</>;
};

// Helper functions to manage string/number comparisons
export const compareIds = (id1: string | number, id2: string | number): boolean => {
  const num1 = typeof id1 === 'string' ? parseInt(id1, 10) : id1;
  const num2 = typeof id2 === 'string' ? parseInt(id2, 10) : id2;
  return num1 === num2;
};

export const getWikiEntryById = (entries: WikiEntry[], id: string | number): WikiEntry | undefined => {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  return entries.find(entry => entry.id === numId);
};

export const getWikiCategoryById = (categories: WikiCategory[], id: string | number): WikiCategory | undefined => {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  return categories.find(category => category.id === numId);
};

export default WikiContextAdapter;
