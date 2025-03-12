
import { WikiEntry, WikiSearchResult, WikiServiceInterface, WikiPage, WikiCategory } from '@/types/wiki';

// Mock data for development
const mockWikiEntries: WikiEntry[] = [
  {
    id: 1,
    slug: 'mooring-techniques',
    title: 'Essential Mooring Techniques for Beginners',
    content: '# Essential Mooring Techniques\n\nMooring a boat properly is a fundamental skill for any mariner. This article covers the basics of secure mooring techniques.\n\n## Basic Mooring Equipment\n\n- Dock lines\n- Fenders\n- Cleats\n- Chocks\n\n## Step-by-Step Mooring Process\n\n1. Prepare your lines and fenders before approaching the dock\n2. Approach slowly against wind or current\n3. Secure the bow line first, then the stern line\n4. Add spring lines to prevent forward and backward movement',
    category: { id: 1, name: 'Seamanship' },
    tags: ['mooring', 'beginner', 'docking'],
    created_at: '2023-06-15T10:30:00Z',
    updated_at: '2023-07-20T14:45:00Z'
  },
  {
    id: 2,
    slug: 'weather-prediction',
    title: 'Marine Weather Prediction Fundamentals',
    content: '# Marine Weather Prediction\n\nUnderstanding weather patterns is crucial for safe boating. This guide explains how to interpret marine forecasts and predict changing conditions at sea.\n\n## Key Weather Indicators\n\n- Barometric pressure trends\n- Cloud formations\n- Wind shifts\n- Sea state\n\n## Reliable Weather Resources\n\n- NOAA Marine Forecast\n- Windy.com\n- Predictwind\n- Local coast guard advisories',
    category: { id: 2, name: 'Navigation' },
    tags: ['weather', 'safety', 'planning'],
    created_at: '2023-05-10T08:15:00Z',
    updated_at: '2023-08-05T11:20:00Z'
  },
  {
    id: 3,
    slug: 'boat-maintenance',
    title: 'Seasonal Boat Maintenance Checklist',
    content: '# Seasonal Boat Maintenance\n\nRegular maintenance is essential for keeping your vessel seaworthy and extending its lifespan. This checklist covers the most important seasonal maintenance tasks.\n\n## Spring Preparation\n\n- Check and service the engine\n- Inspect the hull for damage\n- Test all electronics\n- Replace worn dock lines\n\n## Fall Winterization\n\n- Drain water systems\n- Add fuel stabilizer\n- Change engine oil\n- Cover and secure the vessel',
    category: { id: 3, name: 'Maintenance' },
    tags: ['maintenance', 'seasonal', 'engine'],
    created_at: '2023-03-22T15:45:00Z',
    updated_at: '2023-09-12T09:30:00Z'
  }
];

// Function to get a wiki entry by slug
const getEntry = async (slug: string): Promise<WikiEntry> => {
  const entry = mockWikiEntries.find(e => e.slug === slug);
  if (!entry) {
    throw new Error(`Wiki entry not found: ${slug}`);
  }
  return entry;
};

// Function to get all wiki entries
const getEntries = async (): Promise<WikiEntry[]> => {
  return mockWikiEntries;
};

// Function to search wiki entries
const searchEntries = async (query: string): Promise<WikiSearchResult[]> => {
  const lowercaseQuery = query.toLowerCase();
  return mockWikiEntries
    .filter(entry => 
      entry.title.toLowerCase().includes(lowercaseQuery) || 
      entry.content.toLowerCase().includes(lowercaseQuery)
    )
    .map(entry => ({
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      excerpt: entry.content.substring(0, 150) + '...',
      relevance: entry.title.toLowerCase().includes(lowercaseQuery) ? 2 : 1
    }))
    .sort((a, b) => b.relevance - a.relevance);
};

// Function to get related entries based on the same category
const getRelatedEntries = (currentEntry: WikiEntry): WikiEntry[] => {
  if (!currentEntry) return [];
  
  // Handle category which can be a string or an object
  const getCategoryId = (entry: WikiEntry) => {
    if (typeof entry.category === 'object' && entry.category) {
      return entry.category.id;
    }
    return entry.category; // Return the string category directly
  };
  
  const currentCategoryId = getCategoryId(currentEntry);
  
  return mockWikiEntries
    .filter(entry => {
      // Skip the current entry
      if (entry.id === currentEntry.id) return false;
      
      // Compare categories
      const entryCategoryId = getCategoryId(entry);
      
      return entryCategoryId === currentCategoryId;
    })
    .slice(0, 3); // Limit to 3 related entries
};

// Mock categories
const mockWikiCategories: WikiCategory[] = [
  { id: 1, name: 'Seamanship', slug: 'seamanship', description: 'All about seamanship and sailing techniques' },
  { id: 2, name: 'Navigation', slug: 'navigation', description: 'Navigation, charts, and route planning' },
  { id: 3, name: 'Maintenance', slug: 'maintenance', description: 'Boat maintenance and repair guides' }
];

// Export the service with all required methods
export const wikiService: WikiServiceInterface = {
  getEntry,
  searchEntries,
  getEntries,
  entries: mockWikiEntries,
  loading: false,
  error: null,
  getRelatedEntries,
  
  // Add implementations for the additional methods required by WikiContext
  canEditWiki: () => false,
  getAllCategories: async () => mockWikiCategories,
  getAllPages: async () => mockWikiEntries.map(entry => ({
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    content: entry.content,
    category_id: typeof entry.category === 'object' ? entry.category.id : entry.category || 0,
    created_at: entry.created_at,
    updated_at: entry.updated_at
  })),
  searchPages: async (query: string) => searchEntries(query),
  getPageBySlug: async (slug: string) => {
    const entry = await getEntry(slug);
    return {
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      content: entry.content,
      category_id: typeof entry.category === 'object' ? entry.category.id : entry.category || 0,
      created_at: entry.created_at,
      updated_at: entry.updated_at
    };
  },
  getPagesByCategory: async (categoryId: number | string) => mockWikiEntries
    .filter(entry => {
      const entryCategoryId = typeof entry.category === 'object' ? entry.category.id : entry.category;
      return entryCategoryId === categoryId;
    })
    .map(entry => ({
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      content: entry.content,
      category_id: typeof entry.category === 'object' ? entry.category.id : entry.category || 0,
      created_at: entry.created_at,
      updated_at: entry.updated_at
    })),
  updatePage: async (page: WikiPage) => page,
  createPage: async (page: Partial<WikiPage>) => ({
    id: Date.now(), // Generate a new ID
    slug: page.slug || '',
    title: page.title || '',
    content: page.content || '',
    category_id: page.category_id || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }),
  getPageReviewStatus: async (pageId: number | string) => 'pending',
  deletePage: async (pageId: number | string) => {},
  reviewPage: async (pageId: number | string, status: string) => {},
  getPendingReviews: async () => []
};
