
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Ship, Anchor } from "lucide-react";
import { fetchFeaturedBusinesses, fetchCategories } from "@/services/apiService";
import HeroSection from "@/components/HeroSection";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import logger from "@/services/loggerService";
import { logMissingTranslations } from "@/utils/translationUtils";
import { Business, Category } from "@/types";

const Home = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    logger.info("Home component mounted");
    // Debug: log what translations are missing
    logMissingTranslations();
  }, []);
  
  // Fetch featured businesses with proper error handling
  const { 
    data: featuredBusinesses = [], 
    isLoading: isLoadingBusinesses,
    error: businessError
  } = useQuery({
    queryKey: ['featuredBusinesses'],
    queryFn: fetchFeaturedBusinesses,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (error: Error) => {
        logger.error("Error fetching featured businesses:", error);
      }
    }
  });
  
  // Fetch categories with proper error handling
  const { 
    data: categories = [], 
    isLoading: isLoadingCategories,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (error: Error) => {
        logger.error("Error fetching categories:", error);
      }
    }
  });

  if (businessError || categoriesError) {
    logger.error("Errors in Home component:", { businessError, categoriesError });
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with new background */}
      <section 
        className="relative bg-cover bg-center h-[80vh] flex items-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/lovable-uploads/f8cdc322-ff7c-4b48-b0fe-d63dbde4601d.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t("home.hero.title") || "Discover Maritime Excellence"}
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
            {t("home.hero.subtitle") || "Connect with the best maritime businesses worldwide"}
          </p>
          <div className="max-w-3xl mx-auto glass-card p-4 rounded-lg">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
            />
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="button-primary">
              <Link to="/businesses">
                {t("home.hero.exploreBusiness") || "Explore Directory"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/add-business">
                {t("home.hero.addBusiness") || "List Your Business"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="flex-grow">
        {/* Category Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {t("home.categories.title") || "Browse by Category"}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t("home.categories.subtitle") || "Find maritime businesses by their specialization"}
              </p>
            </div>
            
            {isLoadingCategories ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
                <p>{t("general.loading") || "Loading categories..."}</p>
              </div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {categories.slice(0, 10).map((category) => (
                  <Link to={`/businesses?category=${category.id}`} key={category.id}>
                    <Card className="hover-card">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Anchor className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-medium">
                          {t(`categories.${category.name.toLowerCase().replace(/\s+/g, '')}.name`) || 
                           category.name}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  {t("home.categories.noCategories") || "No categories available"}
                </p>
              </div>
            )}
            
            <div className="text-center mt-10">
              <Button asChild>
                <Link to="/businesses">
                  {t("home.categories.viewAll") || "View All Categories"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Featured Businesses Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {t("business.featured") || "Featured Businesses"}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t("home.featured.subtitle") || "Discover top-rated maritime businesses"}
              </p>
            </div>
            
            {isLoadingBusinesses ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
                <p>{t("general.loading") || "Loading featured businesses..."}</p>
              </div>
            ) : featuredBusinesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredBusinesses.slice(0, 6).map((business) => (
                  <Card key={business.id} className="hover-card overflow-hidden">
                    <div className="h-48 bg-gray-100 relative">
                      {business.logo_url ? (
                        <img 
                          src={business.logo_url} 
                          alt={business.name} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <Ship className="w-12 h-12 text-primary/50" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-primary text-white px-2 py-1 rounded text-sm font-medium">
                        {t("business.businessCard.featured") || "Featured"}
                      </div>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-xl">{business.name}</CardTitle>
                      {business.city && business.country && (
                        <p className="text-sm text-gray-500">
                          {`${business.city}, ${business.country}`}
                        </p>
                      )}
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-600 line-clamp-3">
                        {business.description}
                      </p>
                    </CardContent>
                    
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full">
                        <Link to={`/businesses/${business.id}`}>
                          {t("business.viewDetails") || "View Details"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  {t("home.featured.noBusinesses") || "No featured businesses available"}
                </p>
              </div>
            )}
            
            <div className="text-center mt-10">
              <Button asChild>
                <Link to="/businesses">
                  {t("business.viewAllBusinesses") || "View All Businesses"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Call-to-Action Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              {t("home.cta.title") || "Ready to Join Maritime Directory?"}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              {t("home.cta.subtitle") || "List your business today and connect with customers worldwide"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link to="/add-business">
                  {t("home.cta.addBusiness") || "Add Your Business"}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent text-white hover:bg-white/10">
                <Link to="/businesses">
                  {t("home.cta.exploreBusiness") || "Explore Businesses"}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
