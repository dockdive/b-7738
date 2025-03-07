import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { Category, Business } from '@/types';
import { 
  Compass, 
  Shield, 
  GraduationCap, 
  Headphones, 
  Search
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedBusinesses, fetchCategories } from '@/services/apiService';
import { assertArray } from '@/utils/typeGuards';

const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const { data: featuredBusinesses } = useQuery({
    queryKey: ['featuredBusinesses'],
    queryFn: fetchFeaturedBusinesses
  });
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  // Sample services with their respective icons
  const services = [
    { 
      name: 'Navigation',
      description: 'Find your way with our tools',
      icon: <Compass className="h-8 w-8" /> 
    },
    { 
      name: 'Security',
      description: 'Protect your maritime assets',
      icon: <Shield className="h-8 w-8" /> 
    },
    { 
      name: 'Training',
      description: 'Maritime education and certification',
      icon: <GraduationCap className="h-8 w-8" /> 
    },
    { 
      name: 'Support',
      description: '24/7 assistance for maritime businesses',
      icon: <Headphones className="h-8 w-8" /> 
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-16">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{t("home.categories")}</h2>
          <p className="text-gray-600 max-w-2xl">{t("home.findBusiness")}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardHeader className="flex flex-col items-center">
                <div className="p-3 bg-blue-100 rounded-full mb-4">
                  {service.icon}
                </div>
                <CardTitle>{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">{service.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" onClick={() => navigate('/businesses')}>
                  {t("home.viewAllBusinesses")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      
      <Separator className="my-16" />

      <section className="mb-16">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{t("home.featuredBusinesses")}</h2>
          <p className="text-gray-600 max-w-2xl">{t("home.heroSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assertArray<Business>(featuredBusinesses).map((business) => (
            <Card key={business.id} className="transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle>{business.name}</CardTitle>
                <CardDescription>{business.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Rating: {business.rating}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate(`/businesses/${business.id}`)}>{t("general.view")}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button onClick={() => navigate('/businesses')}>{t("home.viewAllBusinesses")}</Button>
        </div>
      </section>

      <Separator className="my-16" />

      <section>
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{t("home.categories")}</h2>
          <p className="text-gray-600 max-w-2xl">{t("home.findBusiness")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assertArray<Category>(categories).map((category) => (
            <Card key={category.id} className="transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Icon: {category.icon}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate(`/businesses?category=${category.id}`)}>{t("general.view")}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button onClick={() => navigate('/businesses')}>{t("home.viewAllCategories")}</Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
