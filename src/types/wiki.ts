
export interface WikiEntry {
  id: number;
  title: string;
  content: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
  author_id?: string;
  category?: string;
  tags?: string[];
}

export interface WikiContextType {
  entries: WikiEntry[];
  loading: boolean;
  error: Error | null;
  getEntry: (slug: string) => Promise<WikiEntry | null>;
  searchEntries: (query: string) => Promise<WikiEntry[]>;
}
