
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// This component will display all available translations for debugging
const TranslationDump: React.FC = () => {
  const { language } = useLanguage();
  
  // Access the raw translation cache for debugging
  // This is a hack and should only be used for debugging
  // @ts-ignore - We know this is an internal implementation detail
  const translationCache = (window as any).__DEBUG_TRANSLATION_CACHE__;
  
  if (!translationCache) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Translation Data Not Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Translation cache not exposed for debugging.</p>
        </CardContent>
      </Card>
    );
  }
  
  const languages = Object.keys(translationCache);
  
  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Translation Data Explorer</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={language}>
          <TabsList className="mb-4 flex flex-wrap">
            {languages.map(lang => (
              <TabsTrigger key={lang} value={lang}>
                {lang.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {languages.map(lang => (
            <TabsContent key={lang} value={lang} className="mt-0">
              <ScrollArea className="h-[500px] rounded-md border p-4">
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(translationCache[lang], null, 2)}
                </pre>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TranslationDump;
