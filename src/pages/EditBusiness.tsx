
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfoStep from '@/components/business/BasicInfoStep';
import ContactDetailsStep from '@/components/business/ContactDetailsStep';
import AdditionalDetailsStep from '@/components/business/AdditionalDetailsStep';
import BusinessStepIndicator from '@/components/business/BusinessStepIndicator';
import AuthRequired from '@/components/auth/AuthRequired';
import logger from '@/services/loggerService';
import LoadingIndicator from '@/components/ui/loading-indicator';

const EditBusiness = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [currentTab, setCurrentTab] = useState('basic-info');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: null,
    address: '',
    city: '',
    country: '',
    postal_code: '',
    email: '',
    phone: '',
    website: '',
    opening_hours: {},
    services: [],
    logo_url: '',
  });
  
  // Fetch business data
  const { data: business, isLoading, error } = useQuery({
    queryKey: ['business-edit', id],
    queryFn: async () => {
      if (!id) throw new Error('Business ID is required');
      
      logger.info('Fetching business for editing', { businessId: id });
      
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        logger.error('Error fetching business for editing', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!id,
  });

  // Check if user is the owner of the business
  const { data: isOwner, isLoading: isCheckingOwner } = useQuery({
    queryKey: ['business-owner', id, user?.id],
    queryFn: async () => {
      if (!id || !user?.id) return false;
      
      logger.info('Checking business ownership', { businessId: id, userId: user.id });
      
      // Check if user is the owner or has admin role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        logger.error('Error checking user role', profileError);
        throw profileError;
      }
      
      if (profile?.role === 'admin') {
        logger.info('User is admin, allowing edit', { userId: user.id });
        return true;
      }
      
      const { data, error } = await supabase
        .from('businesses')
        .select('user_id')
        .eq('id', id)
        .single();
        
      if (error) {
        logger.error('Error checking business ownership', error);
        throw error;
      }
      
      return data.user_id === user.id;
    },
    enabled: !!id && !!user?.id,
  });

  // Populate form data from fetched business
  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || '',
        description: business.description || '',
        category_id: business.category_id || null,
        address: business.address || '',
        city: business.city || '',
        country: business.country || '',
        postal_code: business.postal_code || '',
        email: business.email || '',
        phone: business.phone || '',
        website: business.website || '',
        opening_hours: business.opening_hours || {},
        services: business.services || [],
        logo_url: business.logo_url || '',
      });
    }
  }, [business]);

  // Check if user has permission to edit
  useEffect(() => {
    if (!isCheckingOwner && isOwner === false) {
      logger.warn('Unauthorized business edit attempt', { businessId: id, userId: user?.id });
      toast.error(t('business.unauthorizedEdit') || 'You are not authorized to edit this business');
      navigate('/businesses/' + id);
    }
  }, [isOwner, isCheckingOwner, id, navigate, t, user?.id]);

  // Handle form updates
  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      logger.info('Submitting business edit', { businessId: id });
      
      const { error } = await supabase
        .from('businesses')
        .update(formData)
        .eq('id', id);
        
      if (error) {
        logger.error('Error updating business', error);
        toast.error(t('business.updateError') || 'Failed to update business');
        return;
      }
      
      logger.info('Business updated successfully', { businessId: id });
      toast.success(t('business.updateSuccess') || 'Business updated successfully');
      navigate('/businesses/' + id);
    } catch (error) {
      logger.error('Error in business update submission', error);
      toast.error(t('business.updateError') || 'Failed to update business');
    }
  };

  if (isLoading || isCheckingOwner) {
    return (
      <div className="container py-8 flex justify-center">
        <LoadingIndicator size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <h2 className="text-red-800 text-lg font-medium mb-2">
            {t('business.loadError') || 'Error loading business'}
          </h2>
          <p className="text-red-700">
            {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthRequired>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t('business.editBusiness') || 'Edit Business'}
          </h1>
          <p className="text-gray-600">
            {t('business.editDescription') || 'Update your business information in the Maritime Directory'}
          </p>
        </div>

        <BusinessStepIndicator 
          currentStep={
            currentTab === 'basic-info' ? 1 : 
            currentTab === 'contact-details' ? 2 : 3
          } 
          onStepClick={(step) => {
            setCurrentTab(
              step === 1 ? 'basic-info' : 
              step === 2 ? 'contact-details' : 'additional-details'
            );
          }}
        />

        <Tabs value={currentTab} onValueChange={handleTabChange} className="mt-8">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="basic-info">
              {t('business.basicInfo') || 'Basic Info'}
            </TabsTrigger>
            <TabsTrigger value="contact-details">
              {t('business.contactDetails') || 'Contact Details'}
            </TabsTrigger>
            <TabsTrigger value="additional-details">
              {t('business.additionalDetails') || 'Additional Details'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info">
            <BasicInfoStep 
              formData={formData}
              updateFormData={updateFormData}
              onNext={() => setCurrentTab('contact-details')}
            />
          </TabsContent>

          <TabsContent value="contact-details">
            <ContactDetailsStep 
              formData={formData}
              updateFormData={updateFormData}
              onBack={() => setCurrentTab('basic-info')}
              onNext={() => setCurrentTab('additional-details')}
            />
          </TabsContent>

          <TabsContent value="additional-details">
            <AdditionalDetailsStep 
              formData={formData}
              updateFormData={updateFormData}
              onBack={() => setCurrentTab('contact-details')}
              onSubmit={handleSubmit}
              isEditing={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AuthRequired>
  );
};

export default EditBusiness;
