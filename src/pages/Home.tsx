import React from 'react';
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, MapPin, Wrench, Search, Building, Ship, Anchor } from "lucide-react";
import { fetchFeaturedBusinesses, fetchCategories } from "@/services/apiService";
import { assertArray } from "@/utils/typeGuards";
import { Category, Business } from "@/types";
import HeroSection from "@/components/HeroSection";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import ToolCard from "@/components/ToolCard";

const Home = () => {
  const { t } = useLanguage();
  
  // Fetch featured businesses
  const { data: featuredBusinesses, isLoading: isLoadingBusinesses } = useQuery({
    queryKey: ['featured-businesses'],
    queryFn: () => fetchFeaturedBusinesses(6) // Limit to 6 featured businesses
  });
  
  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories()
  });
  
  // Map of category icons
  const categoryIcons: Record<string, React.ReactNode> = {
    'Shipping': <Ship className="h-6 w-6" />,
    'Equipment': <Wrench className="h-6 w-6" />,
    'Navigation': <Compass className="h-6 w-6" />,
    'Safety': <Shield className="h-6 w-6" />,
    'Training': <GraduationCap className="h-6 w-6" />,
    'Services': <Headphones className="h-6 w-6" />
  };
  
  // Default icon if category doesn't match
  const defaultCategoryIcon = <Anchor className="h-6 w-6" />;
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <HeroSection />
      
      {/* Search section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder={t('home.searchPlaceholder')}
                className="pl-10 pr-4 py-6 text-lg h-auto"
              />
              <Button className="absolute right-1 top-1/2 transform -translate-y-1/2">
                {t('general.search')}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {t('home.popularSearches')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Featured businesses section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{t('home.featuredBusinesses')}</h2>
            <Link to="/businesses">
              <Button variant="ghost" className="flex items-center gap-1">
                {t('home.viewAllBusinesses')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingBusinesses ? (
              // Loading placeholders
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-4">
                    <div className="h-6 bg-gray-200 w-3/4 mb-2 rounded"></div>
                    <div className="h-4 bg-gray-200 w-1/2 mb-2 rounded"></div>
                    <div className="h-4 bg-gray-200 w-full mb-2 rounded"></div>
                    <div className="h-4 bg-gray-200 w-full rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : featuredBusinesses && featuredBusinesses.length > 0 ? (
              featuredBusinesses.map(business => (
                <Link key={business.id} to={`/businesses/${business.id}`}>
                  <Card className="overflow-hidden card-hover h-full">
                    <div className="h-48 bg-gray-100 relative">
                      {business.logo_url ? (
                        <img 
                          src={business.logo_url} 
                          alt={business.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Ship className="h-16 w-16 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 text-xs rounded">
                        {t('business.featured')}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-1">{business.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {business.city && business.country ? 
                          `${business.city}, ${business.country}` : 
                          business.country || business.city || t('business.locationUnknown')
                        }
                      </p>
                      <p className="text-sm line-clamp-2 text-gray-700">
                        {business.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">{t('home.noFeaturedBusinesses')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Categories section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center">{t('home.categories')}</h2>
            <p className="text-gray-500 text-center mt-2">
              {t('home.browseByCategory')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {isLoadingCategories ? (
              // Loading placeholders
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="h-16 w-16 bg-gray-200 rounded-full mb-3"></div>
                    <div className="h-4 bg-gray-200 w-20 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : categories && categories.length > 0 ? (
              categories.slice(0, 6).map(category => (
                <Link key={category.id} to={`/businesses?category=${category.id}`}>
                  <Card className="card-hover">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                        {categoryIcons[category.name] || defaultCategoryIcon}
                      </div>
                      <h3 className="font-medium">
                        {t(`categories.${category.name.toLowerCase()}.name`) || category.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-6 text-center py-8">
                <p className="text-gray-500">{t('home.noCategories')}</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/businesses">
              <Button variant="outline">
                {t('home.viewAllCategories')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Call to action */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('home.joinDirectory')}</h2>
          <p className="max-w-2xl mx-auto mb-8 text-primary-foreground/90">
            {t('home.joinDescription')}
          </p>
          <Link to="/add-business">
            <Button size="lg" variant="outline" className="bg-white text-primary border-white hover:bg-white/90">
              {t('home.joinCTA')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
