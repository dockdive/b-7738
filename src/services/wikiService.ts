
import { supabase } from '@/integrations/supabase/client';
import { WikiEntry } from '@/types/wiki';

// Fetch a single wiki entry by slug
export const getWikiEntryBySlug = async (slug: string): Promise<WikiEntry | null> => {
  const { data, error } = await supabase
    .from('wiki_entries')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error('Error fetching wiki entry:', error);
    return null;
  }
  
  return data as WikiEntry;
};

// Search wiki entries by query
export const searchWikiEntries = async (query: string): Promise<WikiEntry[]> => {
  if (!query.trim()) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('wiki_entries')
    .select('*')
    .ilike('title', `%${query}%`)
    .order('title');
  
  if (error) {
    console.error('Error searching wiki entries:', error);
    return [];
  }
  
  return data as WikiEntry[];
};

// Get all wiki entries
export const getAllWikiEntries = async (): Promise<WikiEntry[]> => {
  const { data, error } = await supabase
    .from('wiki_entries')
    .select('*')
    .order('title');
  
  if (error) {
    console.error('Error fetching all wiki entries:', error);
    return [];
  }
  
  return data as WikiEntry[];
};
