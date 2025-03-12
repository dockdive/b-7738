
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as csvService from '@/services/csvService';
import { adaptCategory, adaptCategories } from '@/utils/categoryAdapter';
import { Business, Category, Review } from '@/types';
import { useCSVAdapter } from './useCSVAdapter';
import logger from '@/services/loggerService';

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
      
      // Note: We don't use uploadFile directly since it's not exported from csvService
      // Instead use the CSV adapter functionality
      const data = await csvService.parseCSV(file);
      
      if (data && Array.isArray(data)) {
        // Use the adapter to ensure categories have description field
        const processedCategories = csvAdapter.processCategories(data);
        setLogs(prev => [...prev, `Processed ${processedCategories.length} categories`]);
        return processedCategories;
      } else {
        const errorMsg = 'Invalid data format returned from CSV parsing';
        setLogs(prev => [...prev, `Error: ${errorMsg}`]);
        logger.error(errorMsg);
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
      
      // Use parseCSV instead of uploadFile
      const data = await csvService.parseCSV(file);
      
      if (data && Array.isArray(data)) {
        setLogs(prev => [...prev, `Processed ${data.length} businesses`]);
        return data as Business[];
      } else {
        const errorMsg = 'Invalid data format returned from CSV parsing';
        setLogs(prev => [...prev, `Error: ${errorMsg}`]);
        logger.error(errorMsg);
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
      
      // Use parseCSV instead of uploadFile
      const data = await csvService.parseCSV(file);
      
      if (data && Array.isArray(data)) {
        setLogs(prev => [...prev, `Processed ${data.length} reviews`]);
        return data as Review[];
      } else {
        const errorMsg = 'Invalid data format returned from CSV parsing';
        setLogs(prev => [...prev, `Error: ${errorMsg}`]);
        logger.error(errorMsg);
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
