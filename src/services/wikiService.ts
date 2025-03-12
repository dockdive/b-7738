
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
    category: 'general',
    tags: ['industry', 'overview', 'maritime']
  },
  {
    id: 2,
    slug: 'vessel-maintenance',
    title: 'Vessel Maintenance Guidelines',
    content: 'Regular maintenance is critical for vessel operation and safety...',
    created_at: '2023-02-10T10:30:00Z',
    category: 'maintenance',
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

// Export the list of entries for direct access
export const entries = [...mockWikiEntries];
