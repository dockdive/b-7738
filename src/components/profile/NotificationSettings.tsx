
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NotificationSettings: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.notifications")}</CardTitle>
        <CardDescription>
          {t("profile.notificationsDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          {t("profile.notificationsComingSoon")}
        </p>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
