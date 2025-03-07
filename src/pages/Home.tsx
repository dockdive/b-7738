
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchBusinesses, fetchCategories } from "@/services/apiService";
import { Ship, Anchor, Package, Sailboat, MapPin, Search } from "lucide-react";
import { Business, Category } from "@/types";

const Home = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch featured businesses
  const { data: featuredBusinesses = [] } = useQuery({
    queryKey: ['featuredBusinesses'],
    queryFn: () => fetchBusinesses({ is_featured: true } as any)
  });
  
  // Fetch all categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg overflow-hidden mb-12">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center"></div>
        <div className="relative z-10 px-6 py-16 md:py-24 md:px-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("home.hero.title")}
          </h1>
          <p className="text-xl mb-8 max-w-2xl">
            {t("home.hero.description")}
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8 md:mb-12">
            <div className="flex-1 bg-white rounded-lg p-4 text-center">
              <Ship className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-gray-800">{t("home.hero.stats.companies")}</p>
              <p className="text-2xl font-bold text-blue-600">2,500+</p>
            </div>
            <div className="flex-1 bg-white rounded-lg p-4 text-center">
              <Anchor className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-gray-800">{t("home.hero.stats.countries")}</p>
              <p className="text-2xl font-bold text-blue-600">75+</p>
            </div>
            <div className="flex-1 bg-white rounded-lg p-4 text-center">
              <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-gray-800">{t("home.hero.stats.services")}</p>
              <p className="text-2xl font-bold text-blue-600">150+</p>
            </div>
            <div className="flex-1 bg-white rounded-lg p-4 text-center">
              <Sailboat className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-gray-800">{t("home.hero.stats.satisfaction")}</p>
              <p className="text-2xl font-bold text-blue-600">98%</p>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder={t("home.hero.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-4 pr-12 rounded-lg text-gray-800 border-0 shadow-lg focus:ring-2 focus:ring-blue-400"
              />
              <Button
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => {}}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex justify-center mt-4 gap-2">
              <Link to="/businesses">
                <Button variant="outline" className="bg-white text-blue-600 hover:bg-blue-50">
                  {t("home.hero.browseAll")}
                </Button>
              </Link>
              <Link to="/add-business">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  {t("home.hero.addBusiness")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Businesses */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">
            {t("home.featured.title")}
          </h2>
          <Link to="/businesses" className="text-blue-600 hover:underline">
            {t("home.featured.viewAll")}
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBusinesses.slice(0, 3).map((business: Business) => (
            <Card key={business.id} className="h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-12 h-12 mr-3 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {business.logo_url ? (
                        <img 
                          src={business.logo_url} 
                          alt={business.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Sailboat className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{business.name}</CardTitle>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>
                          {[
                            business.city,
                            business.country
                          ].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                    <span className="font-bold mr-1">{business.rating.toFixed(1)}</span>
                    <span>★</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <p className="text-gray-600 line-clamp-3">{business.description}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link to={`/businesses/${business.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    {t("home.featured.viewBusiness")}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Categories */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          {t("home.categories.title")}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category: Category) => (
            <Link 
              to={`/businesses?category=${category.id}`} 
              key={category.id}
              className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-xl">{category.icon}</span>
              </div>
              <h3 className="font-medium text-gray-800">
                {t(`categories.${category.name.toLowerCase().replace(/\s+/g, '')}.name`) || category.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {t(`categories.${category.name.toLowerCase().replace(/\s+/g, '')}.count`, { count: "100+" })}
              </p>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">
          {t("home.cta.title")}
        </h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          {t("home.cta.description")}
        </p>
        <Link to="/add-business">
          <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
            {t("home.cta.button")}
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
