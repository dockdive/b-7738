
import { useCSVAdapter } from './useCSVAdapter';
import { 
  parseCSV,
  validateCSV,
  importCSV, 
  downloadTemplate, 
  prepareDataForImport, 
  generateExampleData 
} from '@/services/csvService';

export const useCSVServiceAdapter = () => {
  const { logger } = useCSVAdapter();
  
  const handleParseCSV = async (file: File) => {
    try {
      logger.info('Starting CSV parsing', { fileName: file.name });
      return await parseCSV(file);
    } catch (error) {
      logger.error('Error parsing CSV', error);
      throw error;
    }
  };

  const handleValidateCSV = async (records: any[], templateType: string) => {
    try {
      logger.info('Validating CSV data', { recordCount: records.length, templateType });
      return await validateCSV(records, templateType);
    } catch (error) {
      logger.error('Error validating CSV', error);
      throw error;
    }
  };

  const handleImportCSV = async (records: any[], templateType: string) => {
    try {
      logger.info('Importing CSV data to database', { recordCount: records.length, templateType });
      return await importCSV(records, templateType);
    } catch (error) {
      logger.error('Error importing CSV', error);
      throw error;
    }
  };

  const handleDownloadTemplate = (templateType: string) => {
    try {
      logger.warn('Downloading template', { templateType });
      return downloadTemplate(templateType);
    } catch (error) {
      logger.error('Error downloading template', error);
      throw error;
    }
  };

  const handlePrepareDataForImport = (records: any[], templateType: string) => {
    try {
      return prepareDataForImport(records, templateType);
    } catch (error) {
      logger.error('Error preparing data for import', error);
      throw error;
    }
  };

  const handleGenerateExampleData = (templateType: string, count = 5) => {
    try {
      logger.warn('Generating example data', { templateType, count });
      return generateExampleData(templateType, count);
    } catch (error) {
      logger.error('Error generating example data', error);
      throw error;
    }
  };

  return {
    parseCSV: handleParseCSV,
    validateCSV: handleValidateCSV,
    importCSV: handleImportCSV,
    downloadTemplate: handleDownloadTemplate,
    prepareDataForImport: handlePrepareDataForImport,
    generateExampleData: handleGenerateExampleData
  };
};
