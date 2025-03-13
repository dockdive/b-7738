
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        {t("errors.pageNotFound")}
      </h2>
      <p className="text-gray-600 text-center max-w-md mb-8">
        {t("errors.pageNotFoundDescription")}
      </p>
      <Link to="/">
        <Button>
          <Home className="mr-2 h-4 w-4" />
          {t("navigation.home")}
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
