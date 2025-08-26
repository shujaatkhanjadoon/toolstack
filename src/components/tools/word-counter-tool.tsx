"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// 1. Import the editor's functionality correctly
import TiptapEditor from "@/components/tiptap-editor";
import { 
  Copy, 
  Download, 
  Target, 
  BarChart3, 
  Sparkles,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mic,
  FileText,
  FileType,
  Image,
  Hash,
  CaseSensitive,
  SpellCheck2,
  ScanSearch,
  FileTextIcon,
  AlignLeft
} from "lucide-react";

// Define comprehensive statistics type
interface AdvancedTextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  speakingTime: number;
  readingLevel: number;
  readingEase: number;
  keywordDensity: { word: string; count: number; percentage: string }[];
  longestWord: string;
  averageWordLength: number;
}

// Writing goals interface
interface WritingGoals {
  words: number;
  characters: number;
  enabled: boolean;
}

// Export formats
type ExportFormat = 'txt' | 'doc' | 'pdf' | 'png' | 'jpg';

// Helper function to count syllables in a word
const countSyllables = (word: string): number => {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
};

// Improved summary generation function
const generateBetterSummary = (text: string, sentenceCount: number = 3): string => {
  if (!text.trim()) return "";
  
  // Split into sentences more intelligently
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10);
  
  if (sentences.length === 0) return "";
  
  // Take the most important sentences (first ones are usually most important)
  const importantSentences = sentences.slice(0, Math.min(sentenceCount, sentences.length));
  
  return importantSentences.join(" ").replace(/\s+/g, " ").trim();
};

// HTML to text converter for accurate statistics - IMPROVED THIS FUNCTION
const htmlToText = (html: string): string => {
  // Create a temporary div element
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  
  // Get the text content, which strips all HTML tags
  // Then clean up the text for accurate counting
  return tempDiv.textContent || tempDiv.innerText || ""
    .replace(/\u00A0/g, ' ') // Replace non-breaking spaces with regular spaces
    .replace(/\s+/g, ' ')    // Collapse multiple spaces into one
    .trim();                 // Trim leading/trailing whitespace
};

export default function WordCounterTool() {
  const [text, setText] = useState("");
  const [plainText, setPlainText] = useState(""); // 2. NEW STATE: Store plain text separately
  const [stats, setStats] = useState<AdvancedTextStats>({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
    readingLevel: 0,
    readingEase: 0,
    keywordDensity: [],
    longestWord: "",
    averageWordLength: 0,
  });
  const [goals, setGoals] = useState<WritingGoals>({ words: 1000, characters: 5000, enabled: false });
  const [autoFormat, setAutoFormat] = useState(true);
  const [summary, setSummary] = useState("");
  const [summaryLength, setSummaryLength] = useState(3);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 3. UPDATE: Calculate stats from PLAIN TEXT, not HTML
  const calculateAdvancedStats = (inputText: string): AdvancedTextStats => {    
    if (!inputText.trim()) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0,
        speakingTime: 0,
        readingLevel: 0,
        readingEase: 0,
        keywordDensity: [],
        longestWord: "",
        averageWordLength: 0,
      };
    }

    // Basic statistics - USING THE PROVIDED PLAIN TEXT
    const characters = inputText.length;
    const charactersNoSpaces = inputText.replace(/\s+/g, "").length;
    
    // Word count
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    
    // Sentence count
    const sentences = inputText.split(/[.!?]+/).filter(sentence => sentence.trim()).length;
    
    // Paragraph count
    const paragraphs = inputText.trim() ? inputText.split(/\n+/).filter(para => para.trim()).length : 0;
    
    // Reading and speaking time (words per minute)
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);
    
    // Flesch-Kincaid Reading Level and Ease
    const sentencesCount = sentences || 1;
    const wordsCount = words || 1;
    
    // Count syllables
    let totalSyllables = 0;
    const wordsArray = inputText.toLowerCase().match(/\b\w+\b/g) || [];
    wordsArray.forEach(word => {
      totalSyllables += countSyllables(word);
    });
    
    const readingLevel = Math.max(0, Math.round(
      0.39 * (wordsCount / sentencesCount) + 
      11.8 * (totalSyllables / wordsCount) - 
      15.59
    ));
    
    const readingEase = Math.max(0, Math.min(100, Math.round(
      206.835 - 
      1.015 * (wordsCount / sentencesCount) - 
      84.6 * (totalSyllables / wordsCount)
    )));
    
    // Keyword density analysis (top 10)
    const wordFrequency: { [key: string]: number } = {};
    wordsArray.forEach(word => {
      if (word.length > 2) { // Include shorter words too
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });
    
    const keywordDensity = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        percentage: ((count / words) * 100).toFixed(1) + '%'
      }));
    
    // Longest word and average word length
    const longestWord = wordsArray.reduce((longest, word) => 
      word.length > longest.length ? word : longest, "");
    const averageWordLength = words ? Math.round(charactersNoSpaces / words * 10) / 10 : 0;

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
      readingLevel,
      readingEase,
      keywordDensity,
      longestWord,
      averageWordLength,
    };
  };

  // Generate proper text summary - NOW USES plainText STATE
  const generateSummary = () => {
    setSummary(generateBetterSummary(plainText, summaryLength));
  };

  // 4. CRITICAL FIX: Update stats and summary when text changes
  useEffect(() => {
    // Convert the HTML from Tiptap to plain text for accurate counting
    const newPlainText = htmlToText(text);
    setPlainText(newPlainText); // Update the plainText state
    setStats(calculateAdvancedStats(newPlainText)); // Calculate stats from plain text
    generateSummary(); // This will use the updated plainText state
  }, [text, summaryLength]);

  // Handlers for various actions
  const handleCopy = async () => {
    // Use the plainText state variable for copying
    await navigator.clipboard.writeText(plainText);
  };

  const handleDownload = (format: ExportFormat = 'txt') => {
    let content = text; // For non-text formats, use the original HTML
    let filename = 'document';
    let mimeType = 'text/plain';
    
    // For text formats, use the plain text
    if (format === 'txt' || format === 'doc') {
      content = plainText;
    }
    
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
        content = plainText;
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
    setPlainText("");
  };

  const goalProgress = goals.enabled ? {
    words: Math.min(100, (stats.words / goals.words) * 100),
    characters: Math.min(100, (stats.characters / goals.characters) * 100)
  } : { words: 0, characters: 0 };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Ad Space below header */}
      <div className="mb-6 p-4 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center text-sm text-muted-foreground bg-muted/30">
        <p>Advertisement Space</p>
        <p className="text-xs">Leaderboard Ad (728x90)</p>
      </div>

      {/* Tool Title Section */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2">Advanced Word Counter</h1>
        <p className="text-muted-foreground">
          Comprehensive text analysis with reading level, keyword density, and writing goals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Tool Section - 3/4 width */}
        <div className="lg:col-span-3 space-y-6">
          {/* 4 Boxes at the Top - Words, Characters, Read Time, Speak Time */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-blue-600">{stats.words}</div>
                <Label className="text-sm font-medium">Words</Label>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-green-600">{stats.characters}</div>
                <Label className="text-sm font-medium">Characters</Label>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-cyan-600">{stats.readingTime}</div>
                <Label className="text-sm font-medium">Read Time (min)</Label>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-indigo-600">{stats.speakingTime}</div>
                <Label className="text-sm font-medium">Speak Time (min)</Label>
              </CardContent>
            </Card>
          </div>

          {/* Text Input Area */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Your Text</CardTitle>
              <CardDescription>
                Paste or type your text below for comprehensive analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 5. The TiptapEditor only handles the HTML/Rich Text. Our stats use plainText. */}
              <TiptapEditor
                content={text}
                onChange={setText}
                placeholder="Start typing or paste your text here..."
              />

              {/* Action Buttons at Bottom */}
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
                  Copy
                </Button>
                
                <Button onClick={handleClear} variant="outline" size="sm" className="h-9">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* ... (The rest of your component remains exactly the same) ... */}
        </div>
        {/* ... (Sidebar remains the same) ... */}
      </div>
      {/* ... (Ad space and footer remain the same) ... */}
      
    </div>
  );
}