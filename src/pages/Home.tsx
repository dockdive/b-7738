
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MapPin, 
  Anchor, 
  Ship, 
  Package, 
  Wrench, 
  Sailboat 
} from 'lucide-react';
import { getBusinesses, getCategories } from '@/services/apiService';
import { Business, Category } from '@/types';

const Home = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch featured businesses
        const { businesses } = await getBusinesses({ featured: true }, 'ratingHigh', 1, 6);
        setFeaturedBusinesses(businesses);
        
        // Fetch categories
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Navigate to search results page with query
    window.location.href = `/businesses?search=${encodeURIComponent(searchQuery)}`;
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'ship':
        return <Ship className="h-12 w-12 mb-4 text-primary" />;
      case 'anchor':
        return <Anchor className="h-12 w-12 mb-4 text-primary" />;
      case 'package':
        return <Package className="h-12 w-12 mb-4 text-primary" />;
      case 'tool':
        return <Wrench className="h-12 w-12 mb-4 text-primary" />;
      default:
        return <Sailboat className="h-12 w-12 mb-4 text-primary" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('general.appName')}
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Find and connect with the best maritime businesses worldwide
            </p>
            
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
              <Input
                type="text"
                placeholder={t('search.byName')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-black"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Button 
                type="submit" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                {t('general.search')}
              </Button>
            </form>
            
            <div className="mt-6 text-sm">
              <span className="text-gray-300 mr-2">Popular:</span>
              <Link to="/businesses?category=1" className="text-white hover:underline mx-2">
                Shipping
              </Link>
              <Link to="/businesses?category=4" className="text-white hover:underline mx-2">
                Shipbuilding
              </Link>
              <Link to="/businesses?category=12" className="text-white hover:underline mx-2">
                Marinas
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {isLoading ? (
              Array(10).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mb-4" />
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                </div>
              ))
            ) : error ? (
              <div className="col-span-full text-center text-red-500">{error}</div>
            ) : (
              categories.slice(0, 10).map((category) => (
                <Link
                  key={category.id}
                  to={`/businesses?category=${category.id}`}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {getCategoryIcon(category.icon)}
                  <h3 className="text-lg font-semibold text-center">{category.name}</h3>
                </Link>
              ))
            )}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/businesses">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Businesses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Businesses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array(6).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
                    <div className="h-4 bg-gray-200 rounded mb-2 w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-4/6" />
                    <div className="mt-4 h-10 bg-gray-200 rounded" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-full text-center text-red-500">{error}</div>
            ) : featuredBusinesses.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">No featured businesses found.</div>
            ) : (
              featuredBusinesses.map((business) => (
                <div key={business.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="h-48 bg-gray-100 relative">
                    {business.logo_url ? (
                      <img
                        src={business.logo_url}
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sailboat className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                    <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{business.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {business.city}
                        {business.city && business.country && ', '}
                        {business.country}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {business.description || 'No description provided.'}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(business.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                              }`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-gray-500">({business.review_count})</span>
                      </div>
                    </div>
                    <Button asChild className="w-full mt-4">
                      <Link to={`/business/${business.id}`}>View Business</Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild size="lg">
              <Link to="/businesses">Explore All Businesses</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">List Your Maritime Business</h2>
            <p className="text-xl mb-8">
              Join our growing network of maritime businesses and reach customers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-800">
                <Link to="/auth?mode=signup">Register Now</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-blue-800 hover:bg-gray-200">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
