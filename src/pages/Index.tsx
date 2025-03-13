
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentTitle from "@/components/DocumentTitle";
import CategoryLinks from "@/components/CategoryLinks";
import logger from "@/services/loggerService";

const Index = () => {
  const { t, language } = useLanguage();
  
  // Log for debugging translation issues
  useEffect(() => {
    logger.debug(`Index page rendered with language: ${language}`);
  }, [language]);

  return (
    <>
      <DocumentTitle
        translationPrefix="home.hero"
        title={t("home.hero.title")}
        description={t("home.hero.subtitle")}
      />

      <HeroSection
        title={t("home.hero.title")}
        subtitle={t("home.hero.subtitle")}
        ctaText={t("home.hero.cta")}
        ctaUrl="/businesses"
      />

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {t("home.categories.title")}
        </h2>
        
        <CategoryLinks />

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {t("home.features.title")}
          </h2>

          <Tabs defaultValue="business" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="business">
                {t("home.features.tabs.business")}
              </TabsTrigger>
              <TabsTrigger value="owners">
                {t("home.features.tabs.owners")}
              </TabsTrigger>
              <TabsTrigger value="community">
                {t("home.features.tabs.community")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="business" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("home.features.business.exposure.title")}</CardTitle>
                    <CardDescription>
                      {t("home.features.business.exposure.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link to="/add-business" className="w-full">
                      <Button variant="outline" className="w-full">
                        {t("home.features.business.exposure.action")}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("home.features.business.insights.title")}</CardTitle>
                    <CardDescription>
                      {t("home.features.business.insights.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link to="/dashboard" className="w-full">
                      <Button variant="outline" className="w-full">
                        {t("home.features.business.insights.action")}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("home.features.business.tools.title")}</CardTitle>
                    <CardDescription>
                      {t("home.features.business.tools.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link to="/bulk-upload" className="w-full">
                      <Button variant="outline" className="w-full">
                        {t("home.features.business.tools.action")}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="owners" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("home.features.owners.search.title")}</CardTitle>
                    <CardDescription>
                      {t("home.features.owners.search.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link to="/businesses" className="w-full">
                      <Button variant="outline" className="w-full">
                        {t("home.features.owners.search.action")}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("home.features.owners.reviews.title")}</CardTitle>
                    <CardDescription>
                      {t("home.features.owners.reviews.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link to="/businesses" className="w-full">
                      <Button variant="outline" className="w-full">
                        {t("home.features.owners.reviews.action")}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("home.features.owners.resources.title")}</CardTitle>
                    <CardDescription>
                      {t("home.features.owners.resources.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link to="/businesses" className="w-full">
                      <Button variant="outline" className="w-full">
                        {t("home.features.owners.resources.action")}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="community" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("home.features.community.events.title")}</CardTitle>
                    <CardDescription>
                      {t("home.features.community.events.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      {t("home.features.community.events.action")}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("home.features.community.forums.title")}</CardTitle>
                    <CardDescription>
                      {t("home.features.community.forums.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      {t("home.features.community.forums.action")}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("home.features.community.newsletter.title")}</CardTitle>
                    <CardDescription>
                      {t("home.features.community.newsletter.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      {t("home.features.community.newsletter.action")}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Index;
