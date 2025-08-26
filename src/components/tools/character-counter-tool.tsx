"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TiptapEditor from "@/components/tiptap-editor";
import { 
  Copy, 
  Download, 
  Hash,
  BarChart3,
  Trash2,
  FileText,
  FileType,
  Image,
  Clock,
  Mic
} from "lucide-react";

interface CharacterStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  speakingTime: number;
}

type ExportFormat = 'txt' | 'doc' | 'pdf' | 'png' | 'jpg';

// HTML to text converter for accurate statistics
const htmlToText = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export default function CharacterCounterTool() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState<CharacterStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
  });

  const calculateStats = (inputText: string): CharacterStats => {
    const plainText = inputText.startsWith('<') ? htmlToText(inputText) : inputText;
    
    if (!plainText.trim()) {
      return {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0,
        speakingTime: 0,
      };
    }

    const characters = plainText.length;
    const charactersNoSpaces = plainText.replace(/\s+/g, "").length;
    const words = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
    const sentences = plainText.split(/[.!?]+/).filter(sentence => sentence.trim()).length;
    const paragraphs = plainText.trim() ? plainText.split(/\n+/).filter(para => para.trim()).length : 0;
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
    };
  };

  useEffect(() => {
    setStats(calculateStats(text));
  }, [text]);

  const handleCopy = async () => {
    const plainText = text.startsWith('<') ? htmlToText(text) : text;
    await navigator.clipboard.writeText(plainText);
  };

  const handleDownload = (format: ExportFormat = 'txt') => {
    let content = text.startsWith('<') ? htmlToText(text) : text;
    let filename = 'text-content';
    let mimeType = 'text/plain';
    
    switch (format) {
      case 'doc':
        filename += '.doc';
        mimeType = 'application/msword';
        break;
      case 'pdf':
        filename += '.pdf';
        mimeType = 'application/pdf';
        break;
      case 'png':
      case 'jpg':
        filename += '.' + format;
        mimeType = 'image/' + format;
        break;
      default:
        filename += '.txt';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Tool Title Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Character Counter</h1>
        <p className="text-muted-foreground">
          Count characters, words, sentences, and paragraphs in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content - 3/4 width */}
        <div className="lg:col-span-3 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-blue-600">{stats.characters}</div>
                <Label className="text-sm font-medium">Characters</Label>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-green-600">{stats.charactersNoSpaces}</div>
                <Label className="text-sm font-medium">No Spaces</Label>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-cyan-600">{stats.words}</div>
                <Label className="text-sm font-medium">Words</Label>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-indigo-600">{stats.sentences}</div>
                <Label className="text-sm font-medium">Sentences</Label>
              </CardContent>
            </Card>
          </div>

          {/* Text Input Area */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Your Text</CardTitle>
              <CardDescription>
                Paste or type your text to count characters, words, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TiptapEditor
                content={text}
                onChange={setText}
                placeholder="Type or paste your text here..."
              />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Select onValueChange={(value: ExportFormat) => handleDownload(value)}>
                  <SelectTrigger className="w-[120px] h-9">
                    <Download className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Export" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="txt">Text File</SelectItem>
                    <SelectItem value="doc">Word Doc</SelectItem>
                    <SelectItem value="pdf">PDF File</SelectItem>
                    <SelectItem value="png">PNG Image</SelectItem>
                    <SelectItem value="jpg">JPG Image</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button onClick={handleCopy} variant="outline" size="sm" className="h-9">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Text
                </Button>
                
                <Button onClick={handleClear} variant="outline" size="sm" className="h-9">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Additional Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">{stats.paragraphs}</div>
                  <Label className="text-sm font-medium">Paragraphs</Label>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-cyan-600">{stats.readingTime}</div>
                  <Label className="text-sm font-medium">Read Time (min)</Label>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">{stats.speakingTime}</div>
                  <Label className="text-sm font-medium">Speak Time (min)</Label>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">
                    {stats.characters > 0 ? Math.round((stats.charactersNoSpaces / stats.characters) * 100) : 0}%
                  </div>
                  <Label className="text-sm font-medium">Text Density</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1/4 width */}
        <div className="lg:col-span-1 space-y-6 sticky top-24 self-start">
          {/* Popular Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Text Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a href="/tools/word-counter" className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer transition-colors">
                <Hash className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm">Word Counter</span>
              </a>
              <div className="flex items-center gap-3 p-2 rounded bg-muted cursor-pointer">
                <Hash className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium">Character Counter</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer transition-colors">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Case Converter (Coming Soon)</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer transition-colors">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Grammar Checker (Coming Soon)</span>
              </div>
            </CardContent>
          </Card>

          {/* Character Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Common Character Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-1">
                <span>Twitter (X)</span>
                <span className="font-semibold">280 chars</span>
              </div>
              <div className="flex justify-between items-center p-1">
                <span>Facebook Post</span>
                <span className="font-semibold">63,206 chars</span>
              </div>
              <div className="flex justify-between items-center p-1">
                <span>Instagram Caption</span>
                <span className="font-semibold">2,200 chars</span>
              </div>
              <div className="flex justify-between items-center p-1">
                <span>LinkedIn Post</span>
                <span className="font-semibold">3,000 chars</span>
              </div>
              <div className="flex justify-between items-center p-1">
                <span>SMS Message</span>
                <span className="font-semibold">160 chars</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}