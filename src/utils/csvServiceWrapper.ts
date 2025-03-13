
import csvService from '@/services/csvService';

// This wrapper adds the missing methods needed by CSVUploader.tsx
// without modifying the protected csvService.ts file

// Create a wrapper for the csvService that includes all original methods
const csvServiceWrapper = {
  // Re-export all existing methods from csvService
  ...csvService,
  
  // Add missing processCSV method
  processCSV: async (file: File, templateType: string) => {
    try {
      // First parse the CSV file
      const records = await csvService.parseCSV(file);
      // Then validate the records
      const validatedData = await csvService.validateCSV(records, templateType);
      // Prepare the data for import
      const preparedData = csvService.prepareDataForImport(records, templateType);
      // Finally import the data
      const result = await csvService.importCSV(preparedData, templateType);
      
      return {
        success: true,
        data: result,
        count: Array.isArray(result) ? result.length : 0
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  },
  
  // Add missing loadSampleData method
  loadSampleData: async (templateType: string, count = 5) => {
    try {
      // Generate example data
      const sampleData = csvService.generateExampleData(templateType, count);
      // Prepare the data for import
      const preparedData = csvService.prepareDataForImport(sampleData, templateType);
      // Import the sample data
      const result = await csvService.importCSV(preparedData, templateType);
      
      return {
        success: true,
        data: result,
        count: Array.isArray(result) ? result.length : 0
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
};

export default csvServiceWrapper;
