
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, User, Upload } from 'lucide-react';
import { uploadImage } from '@/services/apiService';
import { Profile as ProfileType, Language } from '@/types';

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
  { code: 'nl', name: 'Dutch' },
];

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();
  const { t, language, changeLanguage } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileType>>({
    first_name: '',
    last_name: '',
    company_name: '',
    phone: '',
    country: '',
    language: 'en',
    avatar_url: null,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user) {
      navigate('/auth?mode=signin');
      return;
    }
    
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        company_name: profile.company_name || '',
        phone: profile.phone || '',
        country: profile.country || '',
        language: profile.language || language,
        avatar_url: profile.avatar_url,
      });
    }
  }, [user, profile, navigate, language]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'language') {
      changeLanguage(value as Language);
    }
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let avatarUrl = formData.avatar_url;
      
      // Upload avatar if a new one is selected
      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile, 'businesses', 'avatars');
      }
      
      // Update profile with all form data and new avatar URL
      await updateProfile({
        ...formData,
        avatar_url: avatarUrl,
      });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user || !profile) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('navigation.profile')}</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {avatarPreview || formData.avatar_url ? (
                      <img
                        src={avatarPreview || formData.avatar_url || ''}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <label
                    htmlFor="avatar"
                    className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">{t('profile.firstName')}</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last_name">{t('profile.lastName')}</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company_name">{t('profile.companyName')}</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">{t('profile.phone')}</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">{t('profile.country')}</Label>
                  <Select
                    value={formData.country || ''}
                    onValueChange={(value) => handleSelectChange('country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">{t('profile.language')}</Label>
                  <Select
                    value={formData.language || language}
                    onValueChange={(value) => handleSelectChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
