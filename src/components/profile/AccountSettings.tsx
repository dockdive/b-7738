
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AccountSettings: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.accountSettings")}</CardTitle>
        <CardDescription>
          {t("profile.accountSettingsDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">{t("profile.email")}</Label>
          <Input
            id="email"
            type="email"
            value="user@example.com"
            disabled
          />
          <p className="text-sm text-gray-500">
            {t("profile.emailChangeDescription")}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label>{t("profile.password")}</Label>
          <Button variant="outline">
            {t("profile.changePassword")}
          </Button>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">{t("profile.dangerZone")}</h3>
          <Button variant="destructive">
            {t("profile.deleteAccount")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
