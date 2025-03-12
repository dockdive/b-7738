
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as csvService from '@/services/csvService';
import { adaptCategory, adaptCategories } from '@/utils/categoryAdapter';
import { Business, Category, Review } from '@/types';
import { useCSVAdapter } from './useCSVAdapter';

export const useCSVServiceAdapter = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const csvAdapter = useCSVAdapter();

  // Process category data with description field
  const processCategoryCsv = async (file: File): Promise<Category[]> => {
    try {
      setIsLoading(true);
      setLogs([]);
      setProgress(0);
      
      const result = await csvService.uploadFile(file);
      
      if (result.success && result.data) {
        // Use the adapter to ensure categories have description field
        const processedCategories = csvAdapter.processCategories(result.data);
        setLogs(prev => [...prev, `Processed ${processedCategories.length} categories`]);
        return processedCategories;
      } else {
        setLogs(prev => [...prev, `Error: ${result.error || 'Unknown error'}`]);
        return [];
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error processing category CSV';
      setLogs(prev => [...prev, `Error: ${message}`]);
      toast({
        variant: "destructive",
        title: "Error",
        description: message
      });
      return [];
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  // For passthrough methods that don't need adaptation
  const processBusinessCsv = async (file: File): Promise<Business[]> => {
    try {
      setIsLoading(true);
      setLogs([]);
      setProgress(0);
      
      const result = await csvService.uploadFile(file);
      
      if (result.success && result.data) {
        setLogs(prev => [...prev, `Processed ${result.data.length} businesses`]);
        return result.data as Business[];
      } else {
        setLogs(prev => [...prev, `Error: ${result.error || 'Unknown error'}`]);
        return [];
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error processing business CSV';
      setLogs(prev => [...prev, `Error: ${message}`]);
      toast({
        variant: "destructive",
        title: "Error",
        description: message
      });
      return [];
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  const processReviewCsv = async (file: File): Promise<Review[]> => {
    try {
      setIsLoading(true);
      setLogs([]);
      setProgress(0);
      
      const result = await csvService.uploadFile(file);
      
      if (result.success && result.data) {
        setLogs(prev => [...prev, `Processed ${result.data.length} reviews`]);
        return result.data as Review[];
      } else {
        setLogs(prev => [...prev, `Error: ${result.error || 'Unknown error'}`]);
        return [];
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error processing review CSV';
      setLogs(prev => [...prev, `Error: ${message}`]);
      toast({
        variant: "destructive",
        title: "Error",
        description: message
      });
      return [];
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  // Utility functions
  const downloadTemplate = (entityType: string) => {
    const fileName = `${entityType}_template.csv`;
    const templatePath = `/templates/${fileName}`;
    
    const link = document.createElement('a');
    link.href = templatePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    isLoading,
    progress,
    logs,
    processCategoryCsv,
    processBusinessCsv,
    processReviewCsv,
    downloadTemplate
  };
};

export default useCSVServiceAdapter;
