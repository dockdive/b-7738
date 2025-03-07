
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Star,
  MapPin,
  Building,
  Phone,
  Mail,
  Link as LinkIcon,
  Filter,
  ArrowUpDown,
  Eye,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchBusinesses, fetchCategories, fetchSubcategories } from "@/services/apiService";
import { Business, BusinessFilter, Category, Subcategory } from "@/types";
import { format } from "date-fns";

const BusinessDirectory = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial filters from URL params
  const initialFilters: BusinessFilter = {
    search: searchParams.get("search") || "",
    category_id: searchParams.get("category") ? Number(searchParams.get("category")) : undefined,
    subcategory_id: searchParams.get("subcategory") ? Number(searchParams.get("subcategory")) : undefined,
    country: searchParams.get("country") || undefined,
    city: searchParams.get("city") || undefined,
    rating: searchParams.get("rating") ? Number(searchParams.get("rating")) : undefined,
    sort: (searchParams.get("sort") as BusinessFilter["sort"]) || "name_asc",
  };
  
  const [filters, setFilters] = useState<BusinessFilter>(initialFilters);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  
  // Fetch businesses with filters
  const { 
    data: businesses, 
    isLoading: isLoadingBusinesses,
    refetch: refetchBusinesses
  } = useQuery({
    queryKey: ['businesses', filters],
    queryFn: () => fetchBusinesses(filters)
  });
  
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  // Fetch subcategories based on selected category
  const { data: subcategories, refetch: refetchSubcategories } = useQuery({
    queryKey: ['subcategories', filters.category_id],
    queryFn: () => fetchSubcategories(filters.category_id),
    enabled: !!filters.category_id
  });
  
  // Country and city options from businesses
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  
  // Extract unique countries and cities from businesses data
  useEffect(() => {
    if (businesses) {
      const uniqueCountries = [...new Set(businesses.map(b => b.country).filter(Boolean))];
      setCountries(uniqueCountries as string[]);
      
      const uniqueCities = [...new Set(businesses.map(b => b.city).filter(Boolean))];
      setCities(uniqueCities as string[]);
    }
  }, [businesses]);
  
  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set("search", filters.search);
    if (filters.category_id) params.set("category", filters.category_id.toString());
    if (filters.subcategory_id) params.set("subcategory", filters.subcategory_id.toString());
    if (filters.country) params.set("country", filters.country);
    if (filters.city) params.set("city", filters.city);
    if (filters.rating) params.set("rating", filters.rating.toString());
    if (filters.sort) params.set("sort", filters.sort);
    
    setSearchParams(params);
  }, [filters, setSearchParams]);
  
  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setFilters({
      ...filters,
      category_id: categoryId ? Number(categoryId) : undefined,
      subcategory_id: undefined // Reset subcategory when category changes
    });
    refetchSubcategories();
  };
  
  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetchBusinesses();
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: "",
      category_id: undefined,
      subcategory_id: undefined,
      country: undefined,
      city: undefined,
      rating: undefined,
      sort: "name_asc"
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("navigation.businesses")}</h1>
      
      {/* Search and Filter Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={t("search.byName")}
              className="pl-10"
              value={filters.search || ""}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="md:w-auto"
          >
            <Filter className="mr-2 h-4 w-4" />
            {t("search.filterBy")}
          </Button>
          
          <Button type="submit" className="md:w-auto">
            <Search className="mr-2 h-4 w-4" />
            {t("search.search")}
          </Button>
        </form>
      </div>
      
      {/* Filters Section */}
      {isFiltersVisible && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("search.filterByCategory")}
            </label>
            <Select
              value={filters.category_id?.toString() || ""}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("categories.allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("categories.allCategories")}</SelectItem>
                {categories?.map((category: Category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {t(`categories.${category.name.toLowerCase().replace(/\s+/g, '')}.name`) || category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {filters.category_id && subcategories && subcategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("search.filterBySubcategory")}
              </label>
              <Select
                value={filters.subcategory_id?.toString() || ""}
                onValueChange={(value) => setFilters({ ...filters, subcategory_id: value ? Number(value) : undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("categories.allSubcategories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("categories.allSubcategories")}</SelectItem>
                  {subcategories.map((subcategory: Subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("search.filterByCountry")}
            </label>
            <Select
              value={filters.country || ""}
              onValueChange={(value) => setFilters({ ...filters, country: value || undefined })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("search.allCountries")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("search.allCountries")}</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {filters.country && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("search.filterByCity")}
              </label>
              <Select
                value={filters.city || ""}
                onValueChange={(value) => setFilters({ ...filters, city: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("search.allCities")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("search.allCities")}</SelectItem>
                  {cities
                    .filter(city => {
                      const cityBusinesses = businesses?.filter(b => b.city === city && b.country === filters.country);
                      return cityBusinesses && cityBusinesses.length > 0;
                    })
                    .map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("search.filterByRating")}
            </label>
            <Select
              value={filters.rating?.toString() || ""}
              onValueChange={(value) => setFilters({ ...filters, rating: value ? Number(value) : undefined })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("search.anyRating")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("search.anyRating")}</SelectItem>
                <SelectItem value="4">★★★★ & up</SelectItem>
                <SelectItem value="3">★★★ & up</SelectItem>
                <SelectItem value="2">★★ & up</SelectItem>
                <SelectItem value="1">★ & up</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("search.sortBy")}
            </label>
            <Select
              value={filters.sort || "name_asc"}
              onValueChange={(value) => setFilters({ ...filters, sort: value as BusinessFilter["sort"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("search.sortBy.default")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name_asc">{t("search.sortBy.nameAsc")}</SelectItem>
                <SelectItem value="name_desc">{t("search.sortBy.nameDesc")}</SelectItem>
                <SelectItem value="rating_high">{t("search.sortBy.ratingHigh")}</SelectItem>
                <SelectItem value="rating_low">{t("search.sortBy.ratingLow")}</SelectItem>
                <SelectItem value="newest">{t("search.sortBy.newest")}</SelectItem>
                <SelectItem value="oldest">{t("search.sortBy.oldest")}</SelectItem>
                <SelectItem value="most_reviewed">{t("search.sortBy.mostReviewed")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2 lg:col-span-5 flex justify-end">
            <Button variant="outline" onClick={resetFilters} className="w-full sm:w-auto">
              {t("search.resetFilters")}
            </Button>
          </div>
        </div>
      )}
      
      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        {businesses && (
          <p>
            {t("search.resultsCount", { count: businesses.length.toString() })}
          </p>
        )}
      </div>
      
      {/* Businesses Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableCaption>{t("search.resultsDescription")}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">{t("business.name")}</TableHead>
              <TableHead>{t("business.category")}</TableHead>
              <TableHead>{t("business.location")}</TableHead>
              <TableHead>{t("business.contact")}</TableHead>
              <TableHead>{t("business.rating")}</TableHead>
              <TableHead>{t("business.views")}</TableHead>
              <TableHead>{t("business.listed")}</TableHead>
              <TableHead>{t("business.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingBusinesses ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                  </div>
                  <p className="mt-2 text-gray-600">{t("general.loading")}</p>
                </TableCell>
              </TableRow>
            ) : businesses && businesses.length > 0 ? (
              businesses.map((business: Business) => (
                <TableRow key={business.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-md mr-3 flex-shrink-0 overflow-hidden">
                        {business.logo_url ? (
                          <img 
                            src={business.logo_url} 
                            alt={business.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building className="w-6 h-6 m-2 text-gray-400" />
                        )}
                      </div>
                      <Link 
                        to={`/businesses/${business.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {business.name}
                      </Link>
                      {business.is_featured && (
                        <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                          {t("business.featured")}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {business.category_id && categories ? (
                      categories.find(c => c.id === business.category_id)?.name || "-"
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {business.city && business.country ? (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{business.city}, {business.country}</span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {business.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          <a href={`tel:${business.phone}`} className="hover:underline">
                            {business.phone}
                          </a>
                        </div>
                      )}
                      {business.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          <a href={`mailto:${business.email}`} className="hover:underline">
                            {business.email}
                          </a>
                        </div>
                      )}
                      {business.website && (
                        <div className="flex items-center text-sm">
                          <LinkIcon className="h-3 w-3 mr-1 text-gray-400" />
                          <a 
                            href={business.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:underline"
                          >
                            {new URL(business.website).hostname}
                          </a>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
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
                      <span className="ml-1 text-sm text-gray-500">
                        ({business.review_count})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{business.views}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{formatDate(business.created_at)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link to={`/businesses/${business.id}`}>
                      <Button variant="outline" size="sm">
                        {t("business.viewBusiness")}
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-gray-500">{t("search.noResults")}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={resetFilters}
                  >
                    {t("search.resetFilters")}
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BusinessDirectory;
