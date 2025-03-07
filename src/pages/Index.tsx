
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Ship, Anchor, Building, Package, Compass, Sailboat, MapPin, Star, 
  ArrowRight, Search, UserPlus, Briefcase, GraduationCap, Scale, 
  Wrench, ExternalLink
} from "lucide-react";
import { fetchFeaturedBusinesses, fetchCategories } from "@/services/apiService";
import { Category } from "@/types";

const Index = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch featured businesses
  const { data: featuredBusinesses, isLoading: isLoadingBusinesses } = useQuery({
    queryKey: ['featuredBusinesses'],
    queryFn: fetchFeaturedBusinesses
  });
  
  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to businesses page with search term
    window.location.href = `/businesses?search=${encodeURIComponent(searchTerm)}`;
  };
  
  // Function to get icon based on category name
  const getCategoryIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'ship':
        return <Ship className="h-12 w-12 mb-4 text-primary" />;
      case 'anchor':
        return <Anchor className="h-12 w-12 mb-4 text-primary" />;
      case 'building':
        return <Building className="h-12 w-12 mb-4 text-primary" />;
      case 'compass':
        return <Compass className="h-12 w-12 mb-4 text-primary" />;
      case 'briefcase':
        return <Briefcase className="h-12 w-12 mb-4 text-primary" />;
      case 'graduation-cap':
        return <GraduationCap className="h-12 w-12 mb-4 text-primary" />;
      case 'scale':
        return <Scale className="h-12 w-12 mb-4 text-primary" />;
      case 'package':
        return <Package className="h-12 w-12 mb-4 text-primary" />;
      case 'tool':
        return <Wrench className="h-12 w-12 mb-4 text-primary" />;
      default:
        return <Sailboat className="h-12 w-12 mb-4 text-primary" />;
    }
  };
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("home.hero.title")}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("home.hero.subtitle")}
          </p>
          
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto relative">
            <Input
              type="text"
              placeholder={t("search.byName")}
              className="pl-10 pr-32 h-14 text-lg rounded-full shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Button 
              type="submit" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full"
            >
              {t("search.search")}
            </Button>
          </form>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/businesses">
              <Button variant="outline" size="lg" className="rounded-full">
                {t("navigation.businesses")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/add-business">
              <Button size="lg" className="rounded-full">
                <UserPlus className="mr-2 h-4 w-4" />
                {t("business.addBusiness")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("categories.title")}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {isLoadingCategories ? (
              // Skeleton loading
              Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg text-center animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))
            ) : (
              categories?.map((category: Category) => (
                <Link 
                  to={`/businesses?category=${category.id}`} 
                  key={category.id}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  {getCategoryIcon(category.icon)}
                  <h3 className="font-semibold text-lg">
                    {t(`categories.${category.name.toLowerCase().replace(/\s+/g, '')}.name`) || category.name}
                  </h3>
                </Link>
              ))
            )}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/businesses">
              <Button variant="outline">
                {t("home.viewAllCategories")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Businesses Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("home.featuredBusinesses")}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingBusinesses ? (
              // Skeleton loading
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))
            ) : (
              featuredBusinesses?.slice(0, 6).map((business) => (
                <div key={business.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-100 relative">
                    {business.logo_url ? (
                      <img 
                        src={business.logo_url} 
                        alt={business.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Sailboat className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded text-xs font-semibold">
                      {t("business.featured")}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-xl mb-2">{business.name}</h3>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex mr-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(business.rating) 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300"
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        ({business.review_count})
                      </span>
                    </div>
                    
                    {business.city && business.country && (
                      <div className="flex items-center mb-3 text-gray-500 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{business.city}, {business.country}</span>
                      </div>
                    )}
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {business.description}
                    </p>
                    
                    <Link to={`/businesses/${business.id}`}>
                      <Button variant="outline" className="w-full">
                        {t("business.viewBusiness")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/businesses">
              <Button variant="default">
                {t("home.viewAllBusinesses")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            {t("home.cta.title")}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {t("home.cta.subtitle")}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/add-business">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white text-primary hover:bg-gray-100 hover:text-primary border-white"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {t("business.addBusiness")}
              </Button>
            </Link>
            <a href="https://dockdive.com" target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white hover:bg-white hover:text-primary"
              >
                <Sailboat className="mr-2 h-4 w-4" />
                {t("navigation.sellYourBoat")}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
