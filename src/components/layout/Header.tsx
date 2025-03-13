import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Sailboat,
  UserCircle,
  Globe,
  LogIn,
  Menu,
  Home,
  Building2,
  Info,
  MessageCircle,
  LayoutDashboard,
  Plus,
  Ship,
  BookOpen,
  Users
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useState as useReactState, useEffect as useReactEffect } from "react";

const Header = () => {
  const { t, language, setLanguage, supportedLanguages } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  // Check for session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Ship className="h-8 w-8 mr-2 text-primary" />
              <span className="text-xl font-bold">{t("general.appName")}</span>
            </Link>

            <nav className="hidden md:flex ml-10 space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center"
              >
                <Home className="h-4 w-4 mr-2" />
                {t("navigation.home")}
              </Link>
              <Link
                to="/businesses"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center"
              >
                <Building2 className="h-4 w-4 mr-2" />
                {t("navigation.businesses")}
              </Link>
              {/* <a
                href="https://dockdive.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center"
              >
                <Info className="h-4 w-4 mr-2" />
                {t("navigation.about")}
              </a> */}
              <a
                href="https://blog.dockdive.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {t("navigation.blog")}
              </a>
              <a
                href="https://dockdive.com/wiki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {t("navigation.wiki")}
              </a>
              <a
                href="https://dockdive.com/match"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center"
              >
                <Users className="h-4 w-4 mr-2" />
                {t("navigation.crew")}
              </a>
              <a
                href="https://dockdive.com/boats"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center"
              >
                <Sailboat className="h-4 w-4 mr-2" />
                {t("navigation.buyBoats")}
              </a>
              <a
                href="https://dockdive.com/sell"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center"
              >
                <Ship className="h-4 w-4 mr-2" />
                {t("navigation.sellBoats")}
              </a>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  {supportedLanguages.find((lang) => lang.code === language)?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {supportedLanguages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* <a
              href="https://dockdive.com/sell"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center"
            >
              <Sailboat className="h-4 w-4 mr-1" />
              {t("navigation.sellBoats")}
            </a> */}

            {session ? (
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <UserCircle className="h-4 w-4 mr-2" />
                  {t("navigation.profile")}
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  {t("auth.signIn")}
                </Button>
              </Link>
            )}

            {session && (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    {t("navigation.dashboard")}
                  </Button>
                </Link>
                <Link to="/add-business">
                  <Button variant="default" size="sm" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("business.addBusiness")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4 mr-2" />
                {t("navigation.home")}
              </Link>
              <Link
                to="/businesses"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Building2 className="h-4 w-4 mr-2" />
                {t("navigation.businesses")}
              </Link>
              <a
                href="https://dockdive.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Info className="h-4 w-4 mr-2" />
                {t("navigation.about")}
              </a>
              <a
                href="https://blog.dockdive.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {t("navigation.blog")}
              </a>
              <a
                href="https://dockdive.com/wiki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {t("navigation.wiki")}
              </a>
              <a
                href="https://dockdive.com/match"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="h-4 w-4 mr-2" />
                {t("navigation.crew")}
              </a>
              <a
                href="https://dockdive.com/boats"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Sailboat className="h-4 w-4 mr-2" />
                {t("navigation.buyBoats")}
              </a>
              <a
                href="https://dockdive.com/sell"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Ship className="h-4 w-4 mr-2" />
                {t("navigation.sellBoats")}
              </a>
              <div className="py-2 border-t border-gray-200 mt-2">
                <div className="flex items-center space-x-2 px-3 py-2">
                  <Globe className="h-4 w-4" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="text-sm bg-transparent"
                  >
                    {supportedLanguages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <a
                  href="https://dockdive.com/sell"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline px-3 py-2"
                >
                  <Sailboat className="h-4 w-4 mr-2" />
                  {t("navigation.sellBoats")}
                </a>
                {session ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      {t("navigation.profile")}
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      {t("navigation.dashboard")}
                    </Link>
                    <Link
                      to="/add-business"
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t("business.addBusiness")}
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center px-3 py-2 text-gray-700 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    {t("auth.signIn")}
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
