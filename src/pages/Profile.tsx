
import React, { useState, useEffect } from "react";
import { useLanguage, LanguageCode } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchProfile, updateProfile, uploadImage } from "@/services/apiService";
import { Profile as ProfileType } from "@/types";
import { supportedLanguages } from "@/contexts/LanguageContext";

const Profile = () => {
  const { t, language, changeLanguage } = useLanguage();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(language);
  
  // Avatar upload
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Active tab
  const [activeTab, setActiveTab] = useState("profile");
  
  // Fetch profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        // In a real app, you'd get the user ID from auth context
        const userId = "current-user-id";
        const profileData = await fetchProfile(userId);
        setProfile(profileData);
        
        // Initialize form values
        setFirstName(profileData.first_name || "");
        setLastName(profileData.last_name || "");
        setCompanyName(profileData.company_name || "");
        setPhone(profileData.phone || "");
        setCountry(profileData.country || "");
        setSelectedLanguage(profileData.language || language);
        
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: t("profile.loadError"),
          description: t("profile.loadErrorDescription"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [t, language, toast]);
  
  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    try {
      setIsUpdating(true);
      
      // Upload avatar if selected
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        avatarUrl = await uploadImage(profile.id, avatarFile);
      }
      
      // Update profile
      const updatedProfile = await updateProfile(profile.id, {
        first_name: firstName,
        last_name: lastName,
        company_name: companyName,
        phone,
        country,
        language: selectedLanguage,
        avatar_url: avatarUrl,
      });
      
      setProfile(updatedProfile);
      
      // Update language in the app if changed
      if (selectedLanguage !== language) {
        changeLanguage(selectedLanguage);
      }
      
      toast({
        title: t("profile.updateSuccess"),
        description: t("profile.updateSuccessDescription"),
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t("profile.updateError"),
        description: t("profile.updateErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-600">{t("general.loading")}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("profile.title")}</h1>
      
      <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">{t("profile.personalInfo")}</TabsTrigger>
          <TabsTrigger value="account">{t("profile.accountSettings")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("profile.notifications")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("profile.personalInfo")}</CardTitle>
                  <CardDescription>
                    {t("profile.personalInfoDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t("profile.firstName")}</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder={t("profile.firstNamePlaceholder")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t("profile.lastName")}</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder={t("profile.lastNamePlaceholder")}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyName">{t("profile.companyName")}</Label>
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={t("profile.companyNamePlaceholder")}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("profile.phone")}</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={t("profile.phonePlaceholder")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">{t("profile.country")}</Label>
                        <Input
                          id="country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder={t("profile.countryPlaceholder")}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">{t("profile.language")}</Label>
                      <Select
                        value={selectedLanguage}
                        onValueChange={(value) => setSelectedLanguage(value as Language)}
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
            </div>
            
            {/* Profile Picture */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{t("profile.profilePicture")}</CardTitle>
                  <CardDescription>
                    {t("profile.profilePictureDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="mb-6">
                    <Avatar className="h-32 w-32">
                      <AvatarImage 
                        src={avatarPreview || profile?.avatar_url || ""} 
                        alt={`${firstName} ${lastName}`} 
                      />
                      <AvatarFallback className="text-2xl">
                        {firstName && lastName 
                          ? `${firstName[0]}${lastName[0]}`
                          : profile?.first_name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="space-y-4 w-full">
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById("avatar-upload")?.click()}
                    >
                      {t("profile.uploadNewPicture")}
                    </Button>
                    
                    {avatarPreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(null);
                        }}
                      >
                        {t("general.cancel")}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="account">
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
                  value="user@example.com" // In a real app, this would come from auth
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
        </TabsContent>
        
        <TabsContent value="notifications">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
