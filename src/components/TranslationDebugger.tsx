
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Bug, 
  Languages, 
  RefreshCw,
  Search,
  X
} from 'lucide-react';

const TranslationDebugger: React.FC = () => {
  const { language, setLanguage, supportedLanguages, debug } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  
  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-10 w-10 rounded-full z-50 bg-white shadow-lg"
        title="Translation Debugger"
      >
        <Bug className="h-4 w-4" />
      </Button>
    );
  }
  
  const filteredMissingKeys = debug.missingKeys.filter(key => 
    searchKey ? key.toLowerCase().includes(searchKey.toLowerCase()) : true
  );
  
  return (
    <Card className="fixed bottom-4 right-4 w-80 md:w-96 z-50 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Translation Debugger
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Debug and test translations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="show-keys" 
            checked={debug.showTranslationKeys}
            onCheckedChange={debug.toggleShowTranslationKeys}
          />
          <Label htmlFor="show-keys">Show translation keys</Label>
        </div>
        
        <div className="space-y-2">
          <Label>Current Language</Label>
          <div className="grid grid-cols-5 gap-2">
            {supportedLanguages.map((lang) => (
              <Button
                key={lang.code}
                variant={language === lang.code ? "default" : "outline"}
                className="px-2"
                onClick={() => setLanguage(lang.code)}
              >
                {lang.code.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Missing Keys ({debug.missingKeys.length})</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={debug.resetMissingKeys}
              disabled={debug.missingKeys.length === 0}
              className="h-8 px-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
          
          {debug.missingKeys.length > 0 && (
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search missing keys..."
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <ScrollArea className="h-40 border rounded-md p-2">
                {filteredMissingKeys.length > 0 ? (
                  <ul className="space-y-1">
                    {filteredMissingKeys.map((key, index) => (
                      <li key={index} className="text-xs break-all border-b pb-1 last:border-0">
                        {key}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-xs text-muted-foreground py-4">
                    {searchKey ? "No matching keys found" : "No missing keys detected"}
                  </p>
                )}
              </ScrollArea>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationDebugger;
