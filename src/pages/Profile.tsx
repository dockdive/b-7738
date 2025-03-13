
import React, { useState, useEffect } from "react";
import { useLanguage, LanguageCode } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchProfile, updateProfile, uploadImage } from "@/services/apiService";
import { Profile as ProfileType } from "@/types";
import { supportedLanguages } from "@/contexts/LanguageContext";

// Import our refactored components
import PersonalInfoForm from "@/components/profile/PersonalInfoForm";
import ProfilePicture from "@/components/profile/ProfilePicture";
import AccountSettings from "@/components/profile/AccountSettings";
import NotificationSettings from "@/components/profile/NotificationSettings";

const Profile = () => {
  const { t, language, changeLanguage } = useLanguage();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(language);
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  const [activeTab, setActiveTab] = useState("profile");
  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const userId = "current-user-id";
        const profileData = await fetchProfile(userId);
        setProfile(profileData);
        
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
  
  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    try {
      setIsUpdating(true);
      
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        avatarUrl = await uploadImage(profile.id, avatarFile);
      }
      
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
            <div className="md:col-span-2">
              <PersonalInfoForm
                firstName={firstName}
                lastName={lastName}
                companyName={companyName}
                phone={phone}
                country={country}
                selectedLanguage={selectedLanguage}
                supportedLanguages={supportedLanguages}
                isUpdating={isUpdating}
                onFirstNameChange={setFirstName}
                onLastNameChange={setLastName}
                onCompanyNameChange={setCompanyName}
                onPhoneChange={setPhone}
                onCountryChange={setCountry}
                onLanguageChange={setSelectedLanguage}
                onSubmit={handleSubmit}
              />
            </div>
            
            <div>
              <ProfilePicture
                firstName={firstName}
                lastName={lastName}
                profileAvatarUrl={profile?.avatar_url}
                onAvatarChange={handleAvatarChange}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
