
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, MapPin, Building, Ship, Anchor } from "lucide-react";
import { assertArray } from "@/utils/typeGuards";
import { fetchFeaturedBusinesses, fetchCategories } from "@/services/apiService";
import { Category, Business } from "@/types";
import HeroSection from "@/components/HeroSection";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";

const Index = () => {
  const { t } = useLanguage();
  
  // Fetch featured businesses
  const { data: featuredBusinesses } = useQuery({
    queryKey: ['featuredBusinesses'],
    queryFn: fetchFeaturedBusinesses
  });
  
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  // Use type guard to ensure we're working with arrays
  const safeCategories = assertArray<Category>(categories);
  const safeFeaturedBusinesses = assertArray<Business>(featuredBusinesses);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Content */}
      <main className="flex-grow">
        {/* Category Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t("home.categories.title")}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t("home.categories.subtitle")}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {safeCategories.map((category) => (
                <Link to={`/businesses?category=${category.id}`} key={category.id}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        {/* Use a fallback icon if the specific one isn't available */}
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
            
            <div className="text-center mt-10">
              <Button asChild>
                <Link to="/businesses">
                  {t("home.categories.viewAll")}
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
              <h2 className="text-3xl font-bold mb-4">{t("home.featured.title")}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t("home.featured.subtitle")}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safeFeaturedBusinesses.slice(0, 6).map((business) => (
                <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-100 relative">
                    {business.logo_url ? (
                      <img 
                        src={business.logo_url} 
                        alt={business.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        <Building className="w-12 h-12 text-primary/50" />
                      </div>
                    )}
                    <Badge className="absolute top-4 right-4 bg-primary">
                      {t("business.featured")}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle>{business.name}</CardTitle>
                    {business.city && business.country && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{`${business.city}, ${business.country}`}</span>
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3">{business.description}</p>
                    <div className="flex items-center mt-4">
                      <div className="flex">
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
                      <span className="ml-2 text-sm text-gray-500">
                        ({business.review_count})
                      </span>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/businesses/${business.id}`}>
                        {t("business.viewDetails")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button asChild>
                <Link to="/businesses">
                  {t("home.featured.viewAllBusinesses")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Call-to-Action Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">{t("home.cta.title")}</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              {t("home.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link to="/add-business">
                  {t("home.cta.addBusiness")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent text-white hover:bg-white/10">
                <Link to="/businesses">
                  {t("home.cta.exploreBusiness")}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
