// components/tools/WordCounterTool.tsx
'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RotateCcw } from 'lucide-react';

export default function WordCounterTool() {
  const [text, setText] = useState('');
  
  const countWords = useCallback(() => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  }, [text]);
  
  const countCharacters = useCallback((includeSpaces = true) => {
    return includeSpaces ? text.length : text.replace(/\s/g, '').length;
  }, [text]);
  
  const countSentences = useCallback(() => {
    return text.split(/[.!?]+/).filter(Boolean).length;
  }, [text]);
  
  const countParagraphs = useCallback(() => {
    return text.split(/\n+/).filter(p => p.trim()).length;
  }, [text]);
  
  const handleCopyResults = () => {
    const results = `Word Count: ${countWords()}
Characters (with spaces): ${countCharacters()}
Characters (without spaces): ${countCharacters(false)}
Sentences: ${countSentences()}
Paragraphs: ${countParagraphs()}`;
    
    navigator.clipboard.writeText(results);
  };
  
  const handleClearText = () => {
    setText('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Input Text</CardTitle>
            <Button variant="outline" size="sm" onClick={handleClearText}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px]"
            />
          </CardContent>
        </Card>
        
        {/* Results Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statistics</CardTitle>
            <Button variant="outline" size="sm" onClick={handleCopyResults}>
              <Copy className="h-4 w-4 mr-1" />
              Copy Results
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Words</span>
                <span className="font-semibold">{countWords()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Characters (with spaces)</span>
                <span className="font-semibold">{countCharacters()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Characters (without spaces)</span>
                <span className="font-semibold">{countCharacters(false)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sentences</span>
                <span className="font-semibold">{countSentences()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paragraphs</span>
                <span className="font-semibold">{countParagraphs()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Reading Time Estimates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Reading Time Estimates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">
                {Math.ceil(countWords() / 200)} min
              </div>
              <div className="text-xs text-muted-foreground">Slow (200 wpm)</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.ceil(countWords() / 250)} min
              </div>
              <div className="text-xs text-muted-foreground">Average (250 wpm)</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.ceil(countWords() / 300)} min
              </div>
              <div className="text-xs text-muted-foreground">Fast (300 wpm)</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.ceil(countWords() / 400)} min
              </div>
              <div className="text-xs text-muted-foreground">Speed reader (400 wpm)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}