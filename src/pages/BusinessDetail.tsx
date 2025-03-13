import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Link as LinkIcon,
  Calendar,
  Star,
  MessageSquare,
  Building,
  Clock,
  ChevronLeft
} from "lucide-react";
import { fetchBusinessById, fetchReviewsByBusinessId, fetchCategories } from "@/services/apiService";
import { assertArray, assertObject } from "@/utils/typeGuards";
import { Business, Review, Category } from "@/types";
import { format } from "date-fns";

const BusinessDetail = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  
  const [activeTab, setActiveTab] = useState("overview");
  
  // Increment view count when page loads
  useEffect(() => {
    // We'd normally call an API to increment view count
    console.log(`Viewing business with ID: ${id}`);
  }, [id]);
  
  // Fetch business details
  const { 
    data: businessData, 
    isLoading: isLoadingBusiness,
    error: businessError
  } = useQuery({
    queryKey: ['business', id],
    queryFn: () => fetchBusinessById(id as string),
    enabled: !!id
  });
  
  // Apply type assertion
  const business = assertObject<Business>(businessData);
  
  // Fetch reviews for this business
  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => fetchReviewsByBusinessId(id as string),
    enabled: !!id
  });
  
  // Apply type assertion
  const reviews = assertArray<Review>(reviewsData);
  
  // Fetch categories for category name
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  // Apply type assertion
  const categories = assertArray<Category>(categoriesData);
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  // Get category name
  const getCategoryName = (categoryId?: number) => {
    if (!categoryId || !categories) return "-";
    const category = categories.find((c: Category) => c.id === categoryId);
    return category ? (t(`categories.${category.name.toLowerCase().replace(/\s+/g, '')}.name`) || category.name) : "-";
  };
  
  // Loading state
  if (isLoadingBusiness) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-600">{t("general.loading")}</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (businessError || !business) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("errors.businessNotFound")}</h2>
          <p className="text-gray-600 mb-6">{t("errors.businessNotFoundDescription")}</p>
          <Link to="/businesses">
            <Button variant="default">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t("navigation.backToBusinesses")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back link */}
      <div className="mb-6">
        <Link to="/businesses" className="flex items-center text-primary hover:underline">
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t("navigation.backToBusinesses")}
        </Link>
      </div>
      
      {/* Business Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {business.logo_url ? (
              <img src={business.logo_url} alt={business.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary/10">
                <Building className="h-10 w-10 text-primary/50" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
              {business.is_featured && (
                <Badge className="bg-amber-500">
                  {t("business.featured")}
                </Badge>
              )}
              <Badge variant="outline" className="border-primary text-primary">
                {getCategoryName(business.category_id)}
              </Badge>
            </div>
            <div className="flex items-center mt-2">
              {business.city && business.country && (
                <div className="flex items-center text-gray-600 mr-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{business.city}, {business.country}</span>
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{t("business.memberSince")}: {formatDate(business.created_at)}</span>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
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
                <span className="ml-2 text-gray-600">
                  {business.rating.toFixed(1)} ({business.review_count} {t("business.reviews")})
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 w-full md:w-auto">
          {business.website && (
            <Button
              variant="default"
              className="w-full md:w-auto"
              onClick={() => window.open(business.website, "_blank")}
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              {t("business.visitWebsite")}
            </Button>
          )}
          <Button variant="outline" className="w-full md:w-auto">
            <MessageSquare className="mr-2 h-4 w-4" />
            {t("business.contactBusiness")}
          </Button>
        </div>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">{t("business.overview")}</TabsTrigger>
          <TabsTrigger value="reviews">{t("business.reviews")}</TabsTrigger>
          <TabsTrigger value="services">{t("business.services")}</TabsTrigger>
          <TabsTrigger value="gallery">{t("business.gallery")}</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Business Description */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("business.aboutBusiness")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">{business.description}</p>
                </CardContent>
              </Card>
              
              {business.services && business.services.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("business.keyServices")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {business.services.map((service: string, index: number) => (
                        <div key={index} className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Star className="h-4 w-4 text-primary" />
                          </div>
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Right column - Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("business.contactInformation")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {business.address && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-700">{t("business.address")}</p>
                        <p className="text-gray-600">{business.address}</p>
                        {business.city && <p className="text-gray-600">{business.city}</p>}
                        {business.zip && <p className="text-gray-600">{business.zip}</p>}
                        {business.country && <p className="text-gray-600">{business.country}</p>}
                      </div>
                    </div>
                  )}
                  
                  {business.phone && (
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-700">{t("business.phone")}</p>
                        <a href={`tel:${business.phone}`} className="text-gray-600 hover:text-primary">
                          {business.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {business.email && (
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-700">{t("business.email")}</p>
                        <a href={`mailto:${business.email}`} className="text-gray-600 hover:text-primary">
                          {business.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {business.website && (
                    <div className="flex items-start">
                      <LinkIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-700">{t("business.website")}</p>
                        <a 
                          href={business.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-600 hover:text-primary break-all"
                        >
                          {business.website}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {business.opening_hours && (
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-700">{t("business.openingHours")}</p>
                        {/* <p className="text-gray-600 whitespace-pre-line">{business.opening_hours}</p> */}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("business.customerReviews")}</CardTitle>
              <CardDescription>
                {business.review_count} {t("business.reviews")} | {t("business.averageRating")}: {business.rating.toFixed(1)}/5
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review: Review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>{review.user_name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{review.user_name || t("business.anonymousUser")}</p>
                            <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < review.rating 
                                  ? "text-yellow-400 fill-yellow-400" 
                                  : "text-gray-300"
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      
                      {/* Business Reply */}
                      {review.reply && (
                        <div className="mt-4 ml-6 bg-gray-50 p-4 rounded-md">
                          <div className="flex items-center mb-2">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>
                                {business.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{business.name}</p>
                              <p className="text-xs text-gray-500">{t("business.ownerResponse")}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">{review.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t("business.noReviews")}</p>
                  <Button className="mt-4">
                    {t("business.writeFirstReview")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("business.servicesOffered")}</CardTitle>
            </CardHeader>
            <CardContent>
              {business.services && business.services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {business.services.map((service: string, index: number) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                            <Star className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{service}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {t("business.serviceDescription")}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t("business.noServicesListed")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("business.photoGallery")}</CardTitle>
            </CardHeader>
            <CardContent>
              {business.images && business.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {business.images.map((image: string, index: number) => (
                    <div key={index} className="aspect-square rounded-md overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${business.name} - ${index + 1}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t("business.noPhotosAvailable")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessDetail;
