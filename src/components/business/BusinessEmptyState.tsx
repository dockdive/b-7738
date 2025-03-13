
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Anchor, Building, Plus, Search } from 'lucide-react';
import LoadingIndicator from '@/components/ui/loading-indicator';

interface BusinessEmptyStateProps {
  searchQuery?: string;
  isLoading: boolean;
}

const BusinessEmptyState: React.FC<BusinessEmptyStateProps> = ({ searchQuery, isLoading }) => {
  const { t } = useLanguage();

  // Fetch a few sample businesses to suggest
  const { data: suggestedBusinesses, isLoading: suggestionsLoading } = useQuery({
    queryKey: ['suggested-businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name, category_id')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error('Error fetching suggested businesses:', error);
        return [];
      }
      
      return data || [];
    },
    // Only fetch suggestions if no search query (we're showing no results for a search)
    enabled: !searchQuery && !isLoading,
  });

  if (isLoading) {
    return <LoadingIndicator message={t('general.loading')} />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {searchQuery ? (
        // No results for search query
        <div className="max-w-md mx-auto">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {t('search.noResults') || 'No results found'}
          </h3>
          <p className="text-gray-500 mb-6">
            {t('search.tryDifferentTerms') || `We couldn't find any businesses matching "${searchQuery}". Try different keywords or browse all businesses.`}
          </p>
          <div className="space-y-4">
            <Button asChild variant="default">
              <Link to="/businesses">
                {t('search.viewAllBusinesses') || 'View All Businesses'}
              </Link>
            </Button>
            <div className="mt-2">
              <Button asChild variant="outline">
                <Link to="/add-business">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('business.addNew') || 'Add New Business'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // No businesses at all
        <div className="max-w-md mx-auto">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {t('business.noBusinessesYet') || 'No businesses yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {t('business.beTheFirstToAdd') || 'Be the first to add a business to our directory!'}
          </p>
          
          <Button asChild size="lg" className="mb-8">
            <Link to="/add-business">
              <Plus className="w-4 h-4 mr-2" />
              {t('business.addBusiness') || 'Add Business'}
            </Link>
          </Button>
          
          {suggestedBusinesses && suggestedBusinesses.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h4 className="font-medium mb-4">{t('business.popularBusinesses') || 'Popular Businesses'}</h4>
              <ul className="space-y-2">
                {suggestedBusinesses.map((business) => (
                  <li key={business.id}>
                    <Button asChild variant="link">
                      <Link to={`/businesses/${business.id}`}>
                        <Anchor className="w-4 h-4 mr-2" />
                        {business.name}
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessEmptyState;
