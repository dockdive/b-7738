
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfilePictureProps {
  firstName: string;
  lastName: string;
  profileAvatarUrl?: string;
  onAvatarChange: (file: File | null) => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  firstName,
  lastName,
  profileAvatarUrl,
  onAvatarChange,
}) => {
  const { t } = useLanguage();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onAvatarChange(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
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
              src={avatarPreview || profileAvatarUrl || ""} 
              alt={`${firstName} ${lastName}`} 
            />
            <AvatarFallback className="text-2xl">
              {firstName && lastName 
                ? `${firstName[0]}${lastName[0]}`
                : "U"}
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
                onAvatarChange(null);
                setAvatarPreview(null);
              }}
            >
              {t("general.cancel")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePicture;
