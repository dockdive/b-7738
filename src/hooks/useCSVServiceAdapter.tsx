
import { useCSVAdapter } from './useCSVAdapter';
import csvServiceWrapper from '@/utils/csvServiceWrapper';

// Define a type for progress callback
type ProgressCallback = (progress: number) => void;

export const useCSVServiceAdapter = () => {
  const { logger } = useCSVAdapter();
  
  const handleParseCSV = async (file: File) => {
    try {
      logger.info('Starting CSV parsing', { fileName: file.name });
      return await csvServiceWrapper.parseCSV(file);
    } catch (error) {
      logger.error('Error parsing CSV', error);
      throw error;
    }
  };

  const handleValidateCSV = async (records: any[], templateType: string) => {
    try {
      logger.info('Validating CSV data', { recordCount: records.length, templateType });
      return await csvServiceWrapper.validateCSV(records, templateType);
    } catch (error) {
      logger.error('Error validating CSV', error);
      throw error;
    }
  };

  const handleImportCSV = async (records: any[], templateType: string) => {
    try {
      logger.info('Importing CSV data to database', { recordCount: records.length, templateType });
      return await csvServiceWrapper.importCSV(records, templateType);
    } catch (error) {
      logger.error('Error importing CSV', error);
      throw error;
    }
  };

  const handleDownloadTemplate = (templateType: string) => {
    try {
      logger.warn('Downloading template', { templateType });
      return csvServiceWrapper.downloadTemplate(templateType);
    } catch (error) {
      logger.error('Error downloading template', error);
      throw error;
    }
  };

  const handlePrepareDataForImport = (records: any[], templateType: string) => {
    try {
      return csvServiceWrapper.prepareDataForImport(records, templateType);
    } catch (error) {
      logger.error('Error preparing data for import', error);
      throw error;
    }
  };

  const handleGenerateExampleData = (templateType: string, count = 5) => {
    try {
      logger.warn('Generating example data', { templateType, count });
      return csvServiceWrapper.generateExampleData(templateType, count);
    } catch (error) {
      logger.error('Error generating example data', error);
      throw error;
    }
  };

  // Add handlers for the new methods from our wrapper
  const handleProcessCSV = async (file: File, templateType: string) => {
    try {
      logger.info('Processing CSV file', { fileName: file.name, templateType });
      return await csvServiceWrapper.processCSV(file, templateType);
    } catch (error) {
      logger.error('Error processing CSV', error);
      throw error;
    }
  };

  const handleLoadSampleData = async (templateType: string, count = 5) => {
    try {
      logger.info('Loading sample data', { templateType, count });
      return await csvServiceWrapper.loadSampleData(templateType, count);
    } catch (error) {
      logger.error('Error loading sample data', error);
      throw error;
    }
  };

  return {
    parseCSV: handleParseCSV,
    validateCSV: handleValidateCSV,
    importCSV: handleImportCSV,
    downloadTemplate: handleDownloadTemplate,
    prepareDataForImport: handlePrepareDataForImport,
    generateExampleData: handleGenerateExampleData,
    processCSV: handleProcessCSV,
    loadSampleData: handleLoadSampleData
  };
};

// Export default for backward compatibility with existing import in CSVUploader.tsx
export default useCSVServiceAdapter;
