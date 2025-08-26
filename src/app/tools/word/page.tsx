// app/word-counter/page.tsx
import WordCounterTool from '@/components/tools/WordCounterTool';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function WordCounterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Text Tools', href: '/text-tools' },
          { label: 'Word Counter', href: '/word-counter' },
        ]} 
      />
      
      {/* Tool Header */}
      <div className="my-8">
        <h1 className="text-3xl font-bold tracking-tight">Word Counter</h1>
        <p className="text-muted-foreground mt-2">
          Count words, characters, sentences, and paragraphs in your text.
        </p>
      </div>
      
      {/* Main Tool Section */}
      <WordCounterTool />
      
      <Separator className="my-12" />
      
      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-12">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          {/* Other Tools in Category */}
          <Card>
            <CardHeader>
              <CardTitle>Other Text Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><a href="/character-counter" className="text-blue-600 hover:underline">Character Counter</a></li>
                <li><a href="/case-converter" className="text-blue-600 hover:underline">Case Converter</a></li>
                <li><a href="/text-extractor" className="text-blue-600 hover:underline">Text Extractor</a></li>
                <li><a href="/line-counter" className="text-blue-600 hover:underline">Line Counter</a></li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Ad Unit (Placeholder) */}
          <div className="mt-6 p-4 border rounded-lg bg-muted/20 text-center">
            <p className="text-sm text-muted-foreground">Ad Space</p>
          </div>
        </div>
        
        {/* Right Content Area - SEO Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>About Word Counter</CardTitle>
              <CardDescription>
                Everything you need to know about counting words in your text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">What is a Word Counter?</h2>
                <p className="text-muted-foreground">
                  A word counter is a tool that calculates the number of words, characters, sentences, 
                  and paragraphs in a given text. It's useful for writers, students, and professionals 
                  who need to meet specific length requirements for their documents, articles, or social 
                  media posts.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">How to Use Our Word Counter</h2>
                <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                  <li>Paste your text into the input box above</li>
                  <li>The word count, character count, and other statistics will update automatically</li>
                  <li>Use the clear button to reset the text field</li>
                  <li>For best results, ensure your text is properly formatted with spaces between words</li>
                </ol>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Why Word Count Matters</h2>
                <p className="text-muted-foreground">
                  Word count is important for various writing contexts. Academic papers often have strict 
                  word limits. SEO content needs to meet certain length requirements to rank well on search 
                  engines. Social media platforms have character limits for posts. Knowing your word count 
                  helps you communicate effectively within these constraints.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Does the word counter include spaces?</h3>
                    <p className="text-muted-foreground text-sm">
                      Our tool provides separate counts for characters with and without spaces, 
                      so you can see both metrics.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Can I count words in multiple languages?</h3>
                    <p className="text-muted-foreground text-sm">
                      Yes, our word counter works with any language that uses spaces between words. 
                      For languages without spaces, the counting methodology may differ.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Is my text stored when I use the word counter?</h3>
                    <p className="text-muted-foreground text-sm">
                      No, all processing happens in your browser. Your text is never sent to our servers, 
                      ensuring complete privacy for your content.
                    </p>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}