
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CSVUploader from '@/components/CSVUploader';
import { AlertCircle, FileSpreadsheet, Upload, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const BulkUpload = () => {
  const { t } = useLanguage();
  const [uploadStats, setUploadStats] = useState({
    businesses: { count: 0, success: false },
    categories: { count: 0, success: false },
    reviews: { count: 0, success: false }
  });

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
