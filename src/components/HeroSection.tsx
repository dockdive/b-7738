
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Ship, Anchor, Search, Building, Users } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700 text-white">
      {/* Wave SVG background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,192L48,170.7C96,149,192,107,288,112C384,117,480,171,576,186.7C672,203,768,181,864,154.7C960,128,1056,96,1152,106.7C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
      
      {/* Floating boat illustrations */}
      <div className="absolute top-1/4 left-1/6 animate-float-slow z-0 opacity-30">
        <Ship className="text-white h-24 w-24" />
      </div>
      <div className="absolute bottom-1/4 right-1/6 animate-float z-0 opacity-20">
        <Anchor className="text-white h-16 w-16" />
      </div>
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t("home.heroTitle")}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            {t("home.heroSubtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/businesses">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Search className="h-5 w-5" />
                {t("home.findBusiness")}
              </Button>
            </Link>
            <Link to="/add-business">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 bg-white/10 text-white border-white/30 hover:bg-white/20">
                <Building className="h-5 w-5" />
                {t("home.listBusiness")}
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <Building className="h-12 w-12 mx-auto mb-4 text-blue-300" />
            <h3 className="text-3xl md:text-4xl font-bold mb-2">1,200+</h3>
            <p className="text-blue-100">{t("home.businessesRegistered")}</p>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <Users className="h-12 w-12 mx-auto mb-4 text-blue-300" />
            <h3 className="text-3xl md:text-4xl font-bold mb-2">25,000+</h3>
            <p className="text-blue-100">{t("home.monthlyUsers")}</p>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <Search className="h-12 w-12 mx-auto mb-4 text-blue-300" />
            <h3 className="text-3xl md:text-4xl font-bold mb-2">150,000+</h3>
            <p className="text-blue-100">{t("home.monthlySearches")}</p>
          </div>
        </div>
      </div>
      
      {/* Adding maritime-themed custom styling */}
      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
