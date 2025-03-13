
import React from "react";
import { useLanguage, LanguageCode } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonalInfoFormProps {
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  country: string;
  selectedLanguage: LanguageCode;
  supportedLanguages: ReadonlyArray<{ code: LanguageCode; name: string }>;
  isUpdating: boolean;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onLanguageChange: (value: LanguageCode) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  firstName,
  lastName,
  companyName,
  phone,
  country,
  selectedLanguage,
  supportedLanguages,
  isUpdating,
  onFirstNameChange,
  onLastNameChange,
  onCompanyNameChange,
  onPhoneChange,
  onCountryChange,
  onLanguageChange,
  onSubmit,
}) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.personalInfo")}</CardTitle>
        <CardDescription>
          {t("profile.personalInfoDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("profile.firstName")}</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => onFirstNameChange(e.target.value)}
                placeholder={t("profile.firstNamePlaceholder")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("profile.lastName")}</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => onLastNameChange(e.target.value)}
                placeholder={t("profile.lastNamePlaceholder")}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyName">{t("profile.companyName")}</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => onCompanyNameChange(e.target.value)}
              placeholder={t("profile.companyNamePlaceholder")}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">{t("profile.phone")}</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder={t("profile.phonePlaceholder")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">{t("profile.country")}</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => onCountryChange(e.target.value)}
                placeholder={t("profile.countryPlaceholder")}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="language">{t("profile.language")}</Label>
            <Select
              value={selectedLanguage}
              onValueChange={(value) => onLanguageChange(value as LanguageCode)}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder={t("profile.selectLanguage")} />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? t("general.saving") : t("general.saveChanges")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
