
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Share, Mail, Phone, Copy, Download, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import logger from '@/services/loggerService';

/**
 * This component provides sharing tools for business details
 * without modifying the main BusinessDetail component
 */
const BusinessSharingTools: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useLanguage();
  
  // Fetch business data for sharing
  const { data: business, isLoading } = useQuery({
    queryKey: ['business-share', id],
    queryFn: async () => {
      if (!id) return null;
      
      logger.info(`Fetching business data for sharing, ID: ${id}`);
      
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (error) {
        logger.error('Error fetching business for sharing:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (!business || isLoading) {
    return null; // Don't show anything if no business data
  }

  const businessUrl = window.location.href;
  const businessName = business?.name || 'This business';
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(businessUrl).then(() => {
      toast.success('Link copied to clipboard');
      logger.info('Business link copied to clipboard');
    }).catch(err => {
      toast.error('Failed to copy link');
      logger.error('Error copying link:', err);
    });
  };
  
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out ${businessName}`);
    const body = encodeURIComponent(`I found this business on Maritime Directory and thought you might be interested:\n\n${businessName}\n${businessUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    logger.info('Business shared via email');
  };
  
  const handlePhoneShare = () => {
    // For mobile devices
    if (navigator.share) {
      navigator.share({
        title: businessName,
        text: `Check out ${businessName}`,
        url: businessUrl,
      }).then(() => {
        logger.info('Business shared via mobile share API');
      }).catch(err => {
        logger.error('Error sharing:', err);
      });
    } else {
      // Fallback - copy to clipboard
      handleCopyLink();
    }
  };
  
  const handleDownloadVCard = () => {
    // Create a vCard format
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${business.name}`,
      business.email ? `EMAIL:${business.email}` : '',
      business.phone ? `TEL:${business.phone}` : '',
      business.website ? `URL:${business.website}` : '',
      `ADR:;;${[business.address, business.city, business.state, business.zip, business.country].filter(Boolean).join(', ')}`,
      'END:VCARD'
    ].join('\n');
    
    // Create a blob and download it
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${business.name.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Contact downloaded as vCard');
    logger.info('Business contact downloaded as vCard');
  };
  
  const handlePrint = () => {
    window.print();
    logger.info('Business page sent to printer');
  };

  return (
    <div className="print:hidden fixed bottom-4 right-4 z-10">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-full h-12 w-12 shadow-lg bg-primary hover:bg-primary/90">
            <Share className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('business.shareThis') || 'Share this business'}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <Input 
                readOnly 
                value={businessUrl} 
                className="text-xs sm:text-sm"
              />
            </div>
            <Button size="sm" onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-2" />
              {t('common.copy') || 'Copy'}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button variant="outline" onClick={handleEmailShare}>
              <Mail className="h-4 w-4 mr-2" />
              {t('business.shareEmail') || 'Email'}
            </Button>
            <Button variant="outline" onClick={handlePhoneShare}>
              <Phone className="h-4 w-4 mr-2" />
              {t('business.sharePhone') || 'Text/Share'}
            </Button>
            <Button variant="outline" onClick={handleDownloadVCard}>
              <Download className="h-4 w-4 mr-2" />
              {t('business.downloadContact') || 'Save Contact'}
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              {t('business.print') || 'Print'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessSharingTools;
