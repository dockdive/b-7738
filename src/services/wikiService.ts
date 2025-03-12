
import { WikiEntry, WikiSearchResult } from '@/types/wiki';
import { apiLogger } from '@/utils/apiLogger';

// Temporary mock data
const mockWikiEntries: WikiEntry[] = [
  {
    id: 1,
    slug: 'maritime-industry-overview',
    title: 'Maritime Industry Overview',
    content: 'The maritime industry encompasses all enterprises engaged in the operation of ships...',
    created_at: '2023-01-15T08:00:00Z',
    category: { id: 1, name: 'general' },
    tags: ['industry', 'overview', 'maritime']
  },
  {
    id: 2,
    slug: 'vessel-maintenance',
    title: 'Vessel Maintenance Guidelines',
    content: 'Regular maintenance is critical for vessel operation and safety...',
    created_at: '2023-02-10T10:30:00Z',
    category: { id: 2, name: 'maintenance' },
    tags: ['maintenance', 'vessel', 'safety']
  }
];

/**
 * Get a wiki entry by its slug
 */
export const getEntry = async (slug: string): Promise<WikiEntry> => {
  apiLogger.log('Fetching wiki entry with slug:', slug);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const entry = mockWikiEntries.find(e => e.slug === slug);
      
      if (entry) {
        resolve(entry);
      } else {
        const error = new Error('Wiki entry not found');
        apiLogger.error('Wiki entry not found:', error);
        reject(error);
      }
    }, 500); // Simulate network delay
  });
};

/**
 * Search wiki entries by query string
 */
export const searchEntries = async (query: string): Promise<WikiSearchResult[]> => {
  apiLogger.log('Searching wiki entries with query:', query);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query) {
        resolve([]);
        return;
      }
      
      const results = mockWikiEntries
        .filter(entry => 
          entry.title.toLowerCase().includes(query.toLowerCase()) || 
          entry.content.toLowerCase().includes(query.toLowerCase())
        )
        .map(entry => ({
          id: entry.id,
          slug: entry.slug,
          title: entry.title,
          excerpt: entry.content.substring(0, 100) + '...',
          relevance: Math.random() * 100 // Mock relevance score
        }))
        .sort((a, b) => b.relevance - a.relevance);
      
      resolve(results);
    }, 500); // Simulate network delay
  });
};

/**
 * Get all wiki entries
 */
export const getEntries = async (): Promise<WikiEntry[]> => {
  apiLogger.log('Fetching all wiki entries');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockWikiEntries]);
    }, 500); // Simulate network delay
  });
};

// Get related entries based on category
export const getRelatedEntries = (currentEntry: WikiEntry): WikiEntry[] => {
  if (!currentEntry) return [];
  
  // If category is a string, find entries with the same category string
  if (typeof currentEntry.category === 'string') {
    return mockWikiEntries
      .filter(entry => 
        entry.id !== currentEntry.id && 
        typeof entry.category === 'string' && 
        entry.category === currentEntry.category
      )
      .slice(0, 3);
  }
  
  // If category is an object, find entries with the same category ID
  if (typeof currentEntry.category === 'object' && currentEntry.category) {
    return mockWikiEntries
      .filter(entry => 
        entry.id !== currentEntry.id && 
        typeof entry.category === 'object' && 
        entry.category && 
        entry.category.id === currentEntry.category.id
      )
      .slice(0, 3);
  }
  
  return [];
};

// Export the wikiService object with all methods
export const wikiService = {
  getEntry,
  searchEntries,
  getEntries,
  entries: mockWikiEntries,
  loading: false,
  error: null,
  getRelatedEntries,
  
  // Add stubs for the additional methods required by WikiContext
  canEditWiki: () => false,
  getAllCategories: async () => [],
  getAllPages: async () => [],
  searchPages: async (query: string) => [],
  getPageBySlug: async (slug: string) => ({
    id: 0,
    slug,
    title: '',
    content: '',
    category_id: 0
  }),
  getPagesByCategory: async (categoryId: number | string) => [],
  updatePage: async (page: any) => page,
  createPage: async (page: any) => ({
    id: 0,
    slug: '',
    title: '',
    content: '',
    category_id: 0,
    ...page
  }),
  getPageReviewStatus: async (pageId: number | string) => 'pending',
  deletePage: async (pageId: number | string) => {},
  reviewPage: async (pageId: number | string, status: string) => {},
  getPendingReviews: async () => []
};
