
import { useLanguage } from "@/contexts/LanguageContext";
import { Sailboat } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <Sailboat className="h-6 w-6 mr-2 text-primary" />
              <span className="text-lg font-bold">{t("general.appName")}</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              {t("footer.description")}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-primary">
                  {t("navigation.home")}
                </Link>
              </li>
              <li>
                <Link to="/businesses" className="text-sm text-gray-600 hover:text-primary">
                  {t("navigation.businesses")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-primary">
                  {t("navigation.about")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-primary">
                  {t("navigation.contact")}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t("footer.categories")}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/businesses?category=shipping" className="text-sm text-gray-600 hover:text-primary">
                  {t("categories.shipping.name")}
                </Link>
              </li>
              <li>
                <Link to="/businesses?category=marinas" className="text-sm text-gray-600 hover:text-primary">
                  {t("categories.marinas.name")}
                </Link>
              </li>
              <li>
                <Link to="/businesses?category=equipment" className="text-sm text-gray-600 hover:text-primary">
                  {t("categories.equipment.name")}
                </Link>
              </li>
              <li>
                <Link to="/businesses?category=brokers" className="text-sm text-gray-600 hover:text-primary">
                  {t("categories.brokers.name")}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">{t("footer.legal")}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-primary">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm text-gray-600 hover:text-primary">
                  {t("footer.cookies")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {currentYear} {t("general.appName")}. {t("footer.allRightsReserved")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
