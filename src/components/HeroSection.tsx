
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/businesses?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/9be2d89e-5e3b-4b58-8870-f0de61618465.png" 
          alt="Sailing boats" 
          className="w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.5)' }}
        />
      </div>
      
      {/* Wave background SVG */}
      <div className="absolute bottom-0 left-0 right-0 z-1">
        <svg
          className="w-full h-48 fill-current text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
          />
        </svg>
      </div>
      
      {/* Hero content */}
      <div className="container mx-auto px-4 py-16 relative z-10 text-center text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          {t("home.hero.title")}
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
          {t("home.hero.subtitle")}
        </p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder={t("search.businessOrService")}
              className="pl-10 h-12 text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" className="h-12 px-6">
            {t("search.search")}
          </Button>
        </form>
        
        <div className="mt-12">
          <p className="mb-3 text-sm uppercase tracking-wide opacity-80">
            {t("home.hero.trustedBy")}
          </p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {/* Company logos as white silhouettes */}
            {/* Removed for simplicity */}
          </div>
        </div>
      </div>
      
      {/* Animation styles */}
      <style>
        {`
          @keyframes wave {
            0% { transform: translateX(0); }
            50% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .wave-animation {
            animation: wave 15s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default HeroSection;
