
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Share, Printer, Mail, Phone, Save, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import logger from '@/services/loggerService';

/**
 * Content component for business sharing tools
 * This component is designed to work with BusinessSharingTools
 * but can be loaded separately to avoid modifying protected files
 */
const BusinessSharingToolsContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [isCopying, setIsCopying] = useState(false);

  // Fetch business data
  const { data: business, isLoading } = useQuery({
    queryKey: ['business', id],
    queryFn: async () => {
      if (!id) return null;
      
      logger.info('Fetching business details for sharing tools', { businessId: id });
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        logger.error('Error fetching business details for sharing tools', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!id,
  });

  // Handle share action
  const handleShare = async () => {
    if (!business) return;
    
    try {
      logger.info('Sharing business', { businessId: id, businessName: business.name });
      
      if (navigator.share) {
        await navigator.share({
          title: business.name,
          text: `Check out ${business.name} on Maritime Directory`,
          url: window.location.href,
        });
        toast.success(t('business.shareSuccess') || 'Successfully shared!');
      } else {
        handleCopyLink();
      }
    } catch (error) {
      logger.error('Error sharing business', error);
      toast.error(t('business.shareError') || 'Failed to share');
    }
  };

  // Handle print action
  const handlePrint = () => {
    logger.info('Printing business details', { businessId: id });
    window.print();
  };

  // Handle email contact
  const handleEmail = () => {
    if (!business?.email) {
      toast.error(t('business.noEmailAvailable') || 'No email available');
      return;
    }
    
    logger.info('Contacting business via email', { businessId: id, email: business.email });
    window.open(`mailto:${business.email}`, '_blank');
  };

  // Handle phone contact
  const handleCall = () => {
    if (!business?.phone) {
      toast.error(t('business.noPhoneAvailable') || 'No phone number available');
      return;
    }
    
    logger.info('Contacting business via phone', { businessId: id, phone: business.phone });
    window.open(`tel:${business.phone}`, '_blank');
  };

  // Handle saving contact
  const handleSaveContact = () => {
    if (!business) return;
    
    try {
      logger.info('Saving business contact', { businessId: id });
      
      // Create vCard format
      const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${business.name}
ORG:${business.name}
${business.phone ? `TEL;TYPE=WORK,VOICE:${business.phone}` : ''}
${business.email ? `EMAIL;TYPE=PREF,INTERNET:${business.email}` : ''}
${business.website ? `URL:${business.website}` : ''}
${business.address ? `ADR;TYPE=WORK:;;${business.address}` : ''}
END:VCARD`;
      
      // Create and download vCard file
      const blob = new Blob([vCard], { type: 'text/vcard' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${business.name}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(t('business.contactSaved') || 'Contact saved');
    } catch (error) {
      logger.error('Error saving contact', error);
      toast.error(t('business.contactSaveError') || 'Failed to save contact');
    }
  };

  // Handle copy link
  const handleCopyLink = async () => {
    setIsCopying(true);
    
    try {
      logger.info('Copying business link', { businessId: id });
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t('business.linkCopied') || 'Link copied to clipboard');
    } catch (error) {
      logger.error('Error copying link', error);
      toast.error(t('business.copyError') || 'Failed to copy link');
    } finally {
      setIsCopying(false);
    }
  };

  if (isLoading || !business) {
    return null;
  }

  return (
    <div className="business-sharing-tools-content print:hidden">
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        <Button
          onClick={handleShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Share className="h-4 w-4" />
          <span className="hidden sm:inline">{t('business.share') || 'Share'}</span>
        </Button>
        
        <Button
          onClick={handlePrint}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline">{t('business.print') || 'Print'}</span>
        </Button>
        
        {business.email && (
          <Button
            onClick={handleEmail}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">{t('business.email') || 'Email'}</span>
          </Button>
        )}
        
        {business.phone && (
          <Button
            onClick={handleCall}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">{t('business.call') || 'Call'}</span>
          </Button>
        )}
        
        <Button
          onClick={handleSaveContact}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">{t('business.saveContact') || 'Save Contact'}</span>
        </Button>
        
        <Button
          onClick={handleCopyLink}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          disabled={isCopying}
        >
          <Copy className="h-4 w-4" />
          <span className="hidden sm:inline">{t('business.copyLink') || 'Copy Link'}</span>
        </Button>
      </div>
    </div>
  );
};

export default BusinessSharingToolsContent;
