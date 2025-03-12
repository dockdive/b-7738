
declare module '@/types/wiki' {
  export interface WikiEntry {
    id: number;
    slug: string;
    title: string;
    content: string;
    created_at?: string;
    updated_at?: string;
    category?: string;
    tags?: string[];
  }

  export interface WikiSearchResult {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    relevance: number;
  }

  export interface WikiServiceInterface {
    getEntry: (slug: string) => Promise<WikiEntry>;
    searchEntries: (query: string) => Promise<WikiSearchResult[]>;
    entries: WikiEntry[];
    loading: boolean;
    error: Error | null;
  }
}
