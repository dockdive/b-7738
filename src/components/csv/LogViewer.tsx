
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logger from "@/services/loggerService";

// Define LogLevel enum to match the one in loggerService
enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  LOG = 'log'
}

// Implement functions to get logs from the logger service
const getLogs = () => {
  return logger.getAll ? logger.getAll() : []; 
};

const getLogsByLevel = (level: LogLevel) => {
  return logger.getByLevel ? logger.getByLevel(level) : [];
};

interface LogViewerProps {
  visible: boolean;
}

const LogViewer: React.FC<LogViewerProps> = ({ visible }) => {
  const { t } = useLanguage();
  const [logTab, setLogTab] = useState<LogLevel | 'all'>('all');

  if (!visible) return null;
  
  // Get filtered logs based on current tab
  const filteredLogs = (() => {
    if (logTab === 'all') {
      return getLogs();
    }
    return getLogsByLevel(logTab as LogLevel);
  })();

  return (
    <Accordion type="single" collapsible className="mt-4 border rounded-md">
      <AccordionItem value="logs">
        <AccordionTrigger className="px-4">
          {t('csvUpload.logs')} ({filteredLogs.length})
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <Tabs defaultValue="all" onValueChange={(value) => setLogTab(value as LogLevel | 'all')}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value={LogLevel.DEBUG}>Debug</TabsTrigger>
              <TabsTrigger value={LogLevel.INFO}>Info</TabsTrigger>
              <TabsTrigger value={LogLevel.WARN}>Warning</TabsTrigger>
              <TabsTrigger value={LogLevel.ERROR}>Error</TabsTrigger>
            </TabsList>
            
            <div className="max-h-60 overflow-y-auto border rounded-md p-2 bg-slate-50">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`text-xs my-1 p-1 ${
                      log.level === LogLevel.ERROR ? 'text-red-600 bg-red-50' :
                      log.level === LogLevel.WARN ? 'text-amber-600 bg-amber-50' :
                      log.level === LogLevel.INFO ? 'text-blue-600 bg-blue-50' :
                      'text-gray-600 bg-gray-50'
                    } rounded`}
                  >
                    <span className="font-mono">
                      [{new Date(log.timestamp).toLocaleTimeString()}] 
                      [{log.level.toUpperCase()}] {log.message}
                    </span>
                    {log.data && (
                      <pre className="mt-1 whitespace-pre-wrap overflow-x-auto">
                        {typeof log.data === 'object' 
                          ? JSON.stringify(log.data, null, 2) 
                          : log.data
                        }
                      </pre>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-gray-500 py-4">
                  {t('csvUpload.noLogs')}
                </p>
              )}
            </div>
          </Tabs>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default LogViewer;
