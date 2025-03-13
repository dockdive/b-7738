
import { useCSVAdapter } from './useCSVAdapter';
import { csvService } from '@/services/csvService';

export const useCSVServiceAdapter = () => {
  const { logger } = useCSVAdapter();

  const parseCSV = async (file: File) => {
    try {
      logger.info('Starting CSV parsing', { fileName: file.name });
      return await csvService.parseCSV(file);
    } catch (error) {
      logger.error('Error parsing CSV', error);
      throw error;
    }
  };

  const validateCSV = async (records: any[], templateType: string) => {
    try {
      logger.info('Validating CSV data', { recordCount: records.length, templateType });
      return await csvService.validateCSV(records, templateType);
    } catch (error) {
      logger.error('Error validating CSV', error);
      throw error;
    }
  };

  const importCSV = async (records: any[], templateType: string) => {
    try {
      logger.info('Importing CSV data to database', { recordCount: records.length, templateType });
      return await csvService.importCSV(records, templateType);
    } catch (error) {
      logger.error('Error importing CSV', error);
      throw error;
    }
  };

  const downloadTemplate = (templateType: string) => {
    try {
      logger.warn('Downloading template', { templateType });
      return csvService.downloadTemplate(templateType);
    } catch (error) {
      logger.error('Error downloading template', error);
      throw error;
    }
  };

  const prepareDataForImport = (records: any[], templateType: string) => {
    try {
      return csvService.prepareDataForImport(records, templateType);
    } catch (error) {
      logger.error('Error preparing data for import', error);
      throw error;
    }
  };

  const generateExampleData = (templateType: string, count = 5) => {
    try {
      logger.warn('Generating example data', { templateType, count });
      return csvService.generateExampleData(templateType, count);
    } catch (error) {
      logger.error('Error generating example data', error);
      throw error;
    }
  };

  return {
    parseCSV,
    validateCSV,
    importCSV,
    downloadTemplate,
    prepareDataForImport,
    generateExampleData
  };
};
