import WordCounterTool from "@/components/tools/word-counter-tool";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Counter | Free Online Word & Character Count Tool | ToolStack",
  description: "Instantly count words, characters, sentences, and paragraphs. Perfect for writers, students, and professionals. Free, fast, and accurate word counter tool.",
  keywords: "word counter, character count, sentence counter, paragraph counter, online tool, free word count",
};

export default function WordCounterPage() {
  return <WordCounterTool />;
}