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

// HTML to text converter for accurate statistics
const htmlToText = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, ' ')      // Remove HTML tags
    .replace(/\s+/g, ' ')          // Collapse multiple spaces
    .trim();                       // Trim whitespace
};

export default function WordCounterTool() {
  const [text, setText] = useState("");
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

  // Calculate comprehensive text statistics
  const calculateAdvancedStats = (inputText: string): AdvancedTextStats => {
    // Convert HTML to plain text for accurate counting
    const plainText = inputText.startsWith('<') ? htmlToText(inputText) : inputText;
    
    if (!plainText.trim()) {
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

    // Basic statistics - USING PLAIN TEXT NOW
    const characters = plainText.length;
    const charactersNoSpaces = plainText.replace(/\s+/g, "").length;
    
    // Word count
    const words = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
    
    // Sentence count
    const sentences = plainText.split(/[.!?]+/).filter(sentence => sentence.trim()).length;
    
    // Paragraph count
    const paragraphs = plainText.trim() ? plainText.split(/\n+/).filter(para => para.trim()).length : 0;
    
    // Reading and speaking time (words per minute)
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);
    
    // Flesch-Kincaid Reading Level and Ease
    const sentencesCount = sentences || 1;
    const wordsCount = words || 1;
    
    // Count syllables
    let totalSyllables = 0;
    const wordsArray = plainText.toLowerCase().match(/\b\w+\b/g) || [];
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

  // Generate proper text summary
  const generateSummary = () => {
    // Use plain text for summary too
    const plainText = text.startsWith('<') ? htmlToText(text) : text;
    setSummary(generateBetterSummary(plainText, summaryLength));
  };

  // Update stats and summary when text changes
  useEffect(() => {
    setStats(calculateAdvancedStats(text));
    generateSummary();
  }, [text, summaryLength]);

  // Handlers for various actions
  const handleCopy = async () => {
    // Extract plain text for copying
    const plainText = text.startsWith('<') ? htmlToText(text) : text;
    await navigator.clipboard.writeText(plainText);
  };

  const handleDownload = (format: ExportFormat = 'txt') => {
    let content = text;
    let filename = 'document';
    let mimeType = 'text/plain';
    
    // For text formats, use plain text
    if (format === 'txt' || format === 'doc') {
      content = text.startsWith('<') ? htmlToText(text) : text;
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
        content = text.startsWith('<') ? htmlToText(text) : text;
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
          {/* 4 Boxes at the Top - SMALLER SIZE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3"> {/* Reduced gap */}
            <Card className="text-center">
              <CardContent className="p-3 flex flex-col items-center justify-center"> {/* Reduced padding */}
                <div className="text-2xl font-bold text-blue-600">{stats.words}</div> {/* Smaller text */}
                <Label className="text-xs font-medium">Words</Label> {/* Smaller label */}
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-green-600">{stats.characters}</div>
                <Label className="text-xs font-medium">Characters</Label>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-cyan-600">{stats.readingTime}</div>
                <Label className="text-xs font-medium">Read Time</Label>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.speakingTime}</div>
                <Label className="text-xs font-medium">Speak Time</Label>
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

          {/* Writing Goals */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Writing Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="goals-enabled"
                  checked={goals.enabled}
                  onCheckedChange={(checked) => setGoals({...goals, enabled: checked})}
                />
                <Label htmlFor="goals-enabled">Enable Writing Goals</Label>
              </div>
              
              {goals.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Word Goal: {goals.words}</Label>
                    <Input
                      type="number"
                      value={goals.words}
                      onChange={(e) => setGoals({...goals, words: parseInt(e.target.value) || 0})}
                      min="1"
                      className="h-9"
                    />
                    <Progress value={goalProgress.words} className="h-2" />
                    <span className="text-sm text-muted-foreground">
                      {stats.words} / {goals.words} words ({goalProgress.words.toFixed(1)}%)
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Character Goal: {goals.characters}</Label>
                    <Input
                      type="number"
                      value={goals.characters}
                      onChange={(e) => setGoals({...goals, characters: parseInt(e.target.value) || 0})}
                      min="1"
                      className="h-9"
                    />
                    <Progress value={goalProgress.characters} className="h-2" />
                    <span className="text-sm text-muted-foreground">
                      {stats.characters} / {goals.characters} chars ({goalProgress.characters.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comprehensive Statistics Grid */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Detailed Text Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { value: stats.words, label: "Words", color: "text-blue-600" },
                  { value: stats.characters, label: "Characters", color: "text-green-600" },
                  { value: stats.charactersNoSpaces, label: "No Spaces", color: "text-purple-600" },
                  { value: stats.sentences, label: "Sentences", color: "text-orange-600" },
                  { value: stats.paragraphs, label: "Paragraphs", color: "text-pink-600" },
                  { value: stats.readingTime, label: "Read Time (min)", color: "text-cyan-600" },
                  { value: stats.speakingTime, label: "Speak Time (min)", color: "text-indigo-600" },
                  { value: stats.readingLevel, label: "Grade Level", color: "text-red-600" },
                  { value: stats.readingEase, label: "Reading Ease", color: "text-lime-600" },
                  { value: stats.averageWordLength, label: "Avg Word Length", color: "text-amber-600" },
                  { value: stats.longestWord.length, label: "Longest Word", color: "text-rose-600" },
                  { value: stats.keywordDensity[0]?.count || 0, label: "Top Keyword", color: "text-violet-600" },
                ].map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-muted rounded-lg">
                    <div className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <Label className="text-sm font-medium mt-2 block">
                      {stat.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Text Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Text Summary
              </CardTitle>
              <CardDescription>
                <div className="flex items-center gap-4">
                  <span>Summary length: {summaryLength} sentences</span>
                  <Slider
                    value={[summaryLength]}
                    onValueChange={([value]) => setSummaryLength(value)}
                    min={1}
                    max={10}
                    step={1}
                    className="w-32"
                  />
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg min-h-[100px]">
                {summary ? (
                  <p className="text-muted-foreground leading-relaxed">{summary}</p>
                ) : (
                  <p className="text-muted-foreground/50 italic">Summary will be generated as you type...</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1/4 width, sticky */}
        <div className="lg:col-span-1 space-y-6 sticky top-24 self-start">
          {/* Ad Space in sidebar */}
          <div className="p-4 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center text-sm text-muted-foreground bg-muted/30">
            <p>Advertisement</p>
            <p className="text-xs">Medium Rectangle (300x250)</p>
          </div>

          {/* Reading Level Explanation */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Reading Level Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span><strong>90-100:</strong> Very Easy (5th grade)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span><strong>80-90:</strong> Easy (6th grade)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                <span><strong>70-80:</strong> Fairly Easy (7th grade)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span><strong>60-70:</strong> Standard (8th-9th grade)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-950/20">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span><strong>0-60:</strong> Difficult (College level)</span>
              </div>
            </CardContent>
          </Card>

          {/* Time Statistics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Time Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-600" />
                  <span className="text-sm">Reading Time</span>
                </div>
                <span className="font-semibold text-cyan-600">{stats.readingTime} min</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm">Speaking Time</span>
                </div>
                <span className="font-semibold text-indigo-600">{stats.speakingTime} min</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <span className="text-sm">Reading Speed</span>
                <span className="font-semibold text-green-600">200 wpm</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <span className="text-sm">Speaking Speed</span>
                <span className="font-semibold text-blue-600">130 wpm</span>
              </div>
            </CardContent>
          </Card>

          {/* Keyword Density Analysis */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Keyword Density</CardTitle>
              <CardDescription>Top keywords in your text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.keywordDensity.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="font-medium text-sm truncate flex-1" title={keyword.word}>
                    {index + 1}. {keyword.word}
                  </span>
                  <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {keyword.count} ({keyword.percentage})
                  </div>
                </div>
              ))}
              {stats.keywordDensity.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No keywords yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Other Tools */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Other Text Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: "Character Counter", icon: Hash, comingSoon: true },
                { name: "Case Converter", icon: CaseSensitive, comingSoon: true },
                { name: "Grammar Checker", icon: SpellCheck2, comingSoon: false },
                { name: "Plagiarism Checker", icon: ScanSearch, comingSoon: false },
                { name: "Text Summarizer", icon: FileTextIcon, comingSoon: false },
                { name: "Paragraph Formatter", icon: AlignLeft, comingSoon: false }
              ].map((tool, index) => {
                const IconComponent = tool.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer transition-colors">
                    <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {tool.name} {tool.comingSoon && "(Soon)"}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ad Space above footer */}
      <div className="mt-12 p-4 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center text-sm text-muted-foreground bg-muted/30">
        <p>Advertisement Space</p>
        <p className="text-xs">Banner Ad (728x90)</p>
      </div>

      {/* SEO Content Section - We'll add this next */}
      <div className="mt-12">
        {/* This is where the detailed SEO content will go */}
      </div>

      {/* Comprehensive SEO Content Section */}
      <div className="mt-12 prose prose-lg max-w-none dark:prose-invert">
        <h2>Word Counter Tool - Count Words & Characters Accurately</h2>
        
        <p>Our Advanced Word Counter is a powerful online tool that provides comprehensive text analysis beyond simple word counting. Whether you&apos;re a writer, student, SEO professional, or content creator, our tool helps you optimize your writing for clarity, readability, and impact.</p>

        <h3>Why Use Our Word Counter?</h3>
        <ul>
          <li><strong>Real-time Analysis</strong>: Get instant feedback as you type or paste text</li>
          <li><strong>Advanced Statistics</strong>: Track words, characters, sentences, paragraphs, and more</li>
          <li><strong>Reading Level Assessment</strong>: Ensure your content matches your target audience</li>
          <li><strong>Keyword Density Analysis</strong>: Optimize content for SEO and readability</li>
          <li><strong>Writing Goals</strong>: Set and track progress toward word and character targets</li>
          <li><strong>Time Estimates</strong>: Calculate reading and speaking time for better planning</li>
        </ul>

        <h3>Perfect For Various Use Cases</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Academic Writing</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Meet essay word requirements, improve readability, and enhance your academic papers with precise text analysis.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Content Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Optimize blog posts, articles, and social media content for both readers and search engines.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Professional Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Craft perfect resumes, reports, and business communications with appropriate length and clarity.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">SEO Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Analyze keyword density and reading level to create search-engine-friendly content that ranks well.</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section with Accordion */}
        <h3>Frequently Asked Questions</h3>
        <div className="space-y-4 my-6">
          <Card>
            <CardHeader className="pb-3 cursor-pointer" onClick={() => {}}>
              <CardTitle className="text-lg flex items-center justify-between">
                How accurate is the word count?
                <span className="text-xl">+</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="hidden">
              <p>Our word counter is extremely accurate and handles various text formats, including pasted content from PDFs, Word documents, and web pages. It properly counts words, characters with and without spaces, and ignores HTML tags when calculating statistics.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 cursor-pointer" onClick={() => {}}>
              <CardTitle className="text-lg flex items-center justify-between">
                What is reading ease score?
                <span className="text-xl">+</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="hidden">
              <p>The reading ease score (Flesch Reading Ease) measures how easy your text is to understand. Higher scores (90-100) indicate very easy reading suitable for 5th graders, while lower scores (0-60) indicate difficult text suitable for college graduates.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 cursor-pointer" onClick={() => {}}>
              <CardTitle className="text-lg flex items-center justify-between">
                Can I set writing goals?
                <span className="text-xl">+</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="hidden">
              <p>Yes! Our tool allows you to set custom word and character goals. Enable writing goals in the dedicated section, and track your progress with visual indicators that show how close you are to reaching your targets.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 cursor-pointer" onClick={() => {}}>
              <CardTitle className="text-lg flex items-center justify-between">
                Is my text stored or saved?
                <span className="text-xl">+</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="hidden">
              <p>No. Your privacy is important to us. All text analysis happens in your browser, and we never store, save, or transmit your content to our servers. Your writing remains completely private.</p>
            </CardContent>
          </Card>
        </div>

        <h3>Tips for Effective Writing</h3>
        <p>Use our word counter tool to improve your writing: aim for 60-70 reading ease for general audiences, keep sentences under 20 words, use paragraphs to break up long text, and maintain optimal keyword density of 1-2% for SEO content.</p>
      </div>

    </div>
  );
}
   