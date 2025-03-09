
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CSVUploader from '@/components/CSVUploader';
import { AlertCircle, FileSpreadsheet, Upload, Info, Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Function to check if email is from allowed domains
const isAllowedEmail = (email: string | null): boolean => {
  if (!email) return false;
  
  const allowedDomains = ['atalio.com', 'dockdive.com'];
  const emailDomain = email.split('@')[1]?.toLowerCase();
  
  return allowedDomains.some(domain => emailDomain === domain);
};

const BulkUpload = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [uploadStats, setUploadStats] = useState({
    businesses: { count: 0, success: false },
    categories: { count: 0, success: false },
    reviews: { count: 0, success: false }
  });

  useEffect(() => {
    // Check if user is authorized (has an email with allowed domain)
    const checkAuthorization = async () => {
      try {
        // Simulating getting the user's email from auth system
        // In a real app, this would come from your auth provider
        // Replace this with your actual auth implementation
        const userEmail = localStorage.getItem('user-email');
        
        if (!isAllowedEmail(userEmail)) {
          toast({
            title: "Access Restricted",
            description: "Only users with atalio.com or dockdive.com email domains can access this page.",
            variant: "destructive",
          });
          
          // Redirect unauthorized users to home page
          navigate('/');
          return;
        }
        
        setIsAuthorized(true);
      } catch (error) {
        console.error("Authorization check failed:", error);
        navigate('/');
      }
    };
    
    checkAuthorization();
  }, [navigate]);

  const handleUploadComplete = (
    type: 'business' | 'category' | 'review',
    success: boolean,
    count: number
  ) => {
    setUploadStats(prev => ({
      ...prev,
      [type === 'business' ? 'businesses' : `${type}s`]: { count, success }
    }));
  };

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center justify-center">
          <Lock className="w-16 h-16 mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-8">
            Only users with atalio.com or dockdive.com email domains can access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('bulkUpload.title')}</h1>
      <p className="text-gray-600 mb-8">{t('bulkUpload.subtitle')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <FileSpreadsheet className="h-5 w-5 mr-2 text-primary" />
              {t('bulkUpload.prepareCSV')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ol className="list-decimal pl-5 space-y-2">
              <li>{t('bulkUpload.steps.download')}</li>
              <li>{t('bulkUpload.steps.fill')}</li>
              <li>{t('bulkUpload.steps.validate')}</li>
              <li>{t('bulkUpload.steps.save')}</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <Upload className="h-5 w-5 mr-2 text-primary" />
              {t('bulkUpload.uploadCSV')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ol className="list-decimal pl-5 space-y-2">
              <li>{t('bulkUpload.steps.select')}</li>
              <li>{t('bulkUpload.steps.review')}</li>
              <li>{t('bulkUpload.steps.upload')}</li>
              <li>{t('bulkUpload.steps.confirm')}</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <Info className="h-5 w-5 mr-2 text-primary" />
              {t('bulkUpload.requirements')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-disc pl-5 space-y-2">
              <li>{t('bulkUpload.reqDetails.format')}</li>
              <li>{t('bulkUpload.reqDetails.headers')}</li>
              <li>{t('bulkUpload.reqDetails.required')}</li>
              <li>{t('bulkUpload.reqDetails.size')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Restricted Access</AlertTitle>
        <AlertDescription>
          Bulk upload functionality is only available for users with atalio.com or dockdive.com email domains.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="businesses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="businesses">{t('bulkUpload.tabs.businesses')}</TabsTrigger>
          <TabsTrigger value="categories">{t('bulkUpload.tabs.categories')}</TabsTrigger>
          <TabsTrigger value="reviews">{t('bulkUpload.tabs.reviews')}</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="businesses">
            <CSVUploader 
              entityType="business" 
              onComplete={(success, count) => handleUploadComplete('business', success, count)}
            />
          </TabsContent>
          
          <TabsContent value="categories">
            <CSVUploader 
              entityType="category" 
              onComplete={(success, count) => handleUploadComplete('category', success, count)}
            />
          </TabsContent>
          
          <TabsContent value="reviews">
            <CSVUploader 
              entityType="review" 
              onComplete={(success, count) => handleUploadComplete('review', success, count)}
            />
          </TabsContent>
        </div>
      </Tabs>

      {(uploadStats.businesses.count > 0 || uploadStats.categories.count > 0 || uploadStats.reviews.count > 0) && (
        <div className="mt-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('bulkUpload.uploadSummary')}</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {uploadStats.businesses.count > 0 && (
                  <li>
                    {t('bulkUpload.uploadedItems', { 
                      count: uploadStats.businesses.count.toString(),
                      type: t('bulkUpload.entityTypes.businesses') 
                    })}
                  </li>
                )}
                {uploadStats.categories.count > 0 && (
                  <li>
                    {t('bulkUpload.uploadedItems', { 
                      count: uploadStats.categories.count.toString(),
                      type: t('bulkUpload.entityTypes.categories') 
                    })}
                  </li>
                )}
                {uploadStats.reviews.count > 0 && (
                  <li>
                    {t('bulkUpload.uploadedItems', { 
                      count: uploadStats.reviews.count.toString(),
                      type: t('bulkUpload.entityTypes.reviews') 
                    })}
                  </li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
