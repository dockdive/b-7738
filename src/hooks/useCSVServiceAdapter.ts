
import { useState } from 'react';
import { CSVResult, CSVImportOptions } from '@/types/csv';
import { toast } from '@/components/ui/use-toast';

export function useCSVServiceAdapter() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CSVResult | null>(null);

  const processCSV = async (file: File, options: CSVImportOptions) => {
    if (!file) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setResult(null);

    try {
      // This will handle the progress callback correctly
      const progressCallback = (progressValue: number) => {
        setProgress(progressValue);
        if (options.onProgress) {
          options.onProgress(progressValue);
        }
      };

      // Read the file as text
      const text = await readFileAsText(file);
      
      // Process CSV data - This would be implementation-specific
      // For now we'll use a placeholder implementation
      let processingResult: CSVResult;
      
      try {
        // Simulate processing with progress updates
        await simulateProcessing(progressCallback);
        
        // Create a simple processing result
        const parsedData = parseCSV(text);
        processingResult = {
          success: true,
          data: parsedData,
          count: parsedData.length
        };
      } catch (err: any) {
        processingResult = {
          success: false,
          error: err.message || "Error processing CSV"
        };
      }

      setResult(processingResult);
      
      if (processingResult.success) {
        if (options.onSuccess) {
          options.onSuccess(processingResult);
        }
        toast({
          title: "Success",
          description: `Successfully processed ${processingResult.count} records`
        });
      } else {
        if (options.onError) {
          options.onError(processingResult.error || "Unknown error");
        }
        toast({
          title: "Error",
          description: processingResult.error || "Error processing CSV",
          variant: "destructive"
        });
      }
      
      return processingResult;
    } catch (error: any) {
      const errorResult: CSVResult = {
        success: false,
        error: error.message || "Unknown error occurred"
      };
      
      setResult(errorResult);
      
      if (options.onError) {
        options.onError(errorResult.error);
      }
      
      toast({
        title: "Error",
        description: errorResult.error,
        variant: "destructive"
      });
      
      return errorResult;
    } finally {
      setIsProcessing(false);
    }
  };

  // Add the missing downloadTemplate method
  const downloadTemplate = (templateType: string): Blob => {
    // Create a simple CSV template based on entity type
    let headers: string[] = [];
    
    switch (templateType) {
      case 'business':
        headers = ['name', 'description', 'category_id', 'address', 'city', 'country', 'email', 'phone', 'website'];
        break;
      case 'category':
        headers = ['name', 'icon', 'description'];
        break;
      case 'review':
        headers = ['business_id', 'rating', 'comment'];
        break;
      default:
        headers = ['column1', 'column2', 'column3'];
    }
    
    const csvContent = headers.join(',') + '\n';
    return new Blob([csvContent], { type: 'text/csv' });
  };

  // Add the missing loadSampleData method
  const loadSampleData = async (templateType: string, count = 5) => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Simulate progress
      await simulateProcessing((progressValue) => {
        setProgress(progressValue);
      });
      
      // Generate sample data based on entity type
      let sampleData: any[] = [];
      
      switch (templateType) {
        case 'business':
          for (let i = 0; i < count; i++) {
            sampleData.push({
              name: `Sample Business ${i+1}`,
              description: `Description for business ${i+1}`,
              category_id: i + 1,
              address: `${i+1} Main St`,
              city: 'Sample City',
              country: 'Sample Country',
              email: `business${i+1}@example.com`,
              phone: `555-000${i+1}`,
              website: `https://business${i+1}.example.com`
            });
          }
          break;
        case 'category':
          for (let i = 0; i < count; i++) {
            sampleData.push({
              name: `Sample Category ${i+1}`,
              icon: 'buildings',
              description: `Description for category ${i+1}`
            });
          }
          break;
        case 'review':
          for (let i = 0; i < count; i++) {
            sampleData.push({
              business_id: `00000000-0000-0000-0000-00000000000${i+1}`,
              rating: Math.floor(Math.random() * 5) + 1,
              comment: `This is a sample review ${i+1}`
            });
          }
          break;
      }
      
      const sampleResult: CSVResult = {
        success: true,
        data: sampleData,
        count: sampleData.length
      };
      
      setResult(sampleResult);
      
      toast({
        title: "Success",
        description: `Successfully loaded ${sampleData.length} sample records`
      });
      
      return sampleResult;
    } catch (error: any) {
      const errorResult: CSVResult = {
        success: false,
        error: error.message || "Error loading sample data"
      };
      
      setResult(errorResult);
      
      toast({
        title: "Error",
        description: errorResult.error,
        variant: "destructive"
      });
      
      return errorResult;
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          resolve(e.target.result);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = () => reject(new Error("File read error"));
      reader.readAsText(file);
    });
  };

  // Simple CSV parser
  const parseCSV = (text: string): string[][] => {
    return text.split('\n')
      .map(line => line.split(',').map(value => value.trim()))
      .filter(row => row.length > 1 || (row.length === 1 && row[0] !== ''));
  };

  // Simulate processing with progress updates
  const simulateProcessing = async (progressCallback: (progress: number) => void): Promise<void> => {
    return new Promise((resolve) => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        progressCallback(currentProgress);
        
        if (currentProgress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 300);
    });
  };

  return {
    processCSV,
    isProcessing,
    progress,
    result,
    downloadTemplate,
    loadSampleData
  };
}

// Add a default export for backward compatibility
export default useCSVServiceAdapter;
