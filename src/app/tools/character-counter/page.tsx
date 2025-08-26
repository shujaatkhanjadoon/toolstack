import CharacterCounterTool from "@/components/tools/character-counter-tool";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Character Counter | Count Characters, Words & Sentences Online | ToolStack",
  description: "Free online character counter tool that counts characters, words, sentences, and paragraphs in real-time. Perfect for social media, essays, and content writing.",
  keywords: "character counter, word counter, sentence counter, paragraph counter, online tool, free character count",
};

export default function CharacterCounterPage() {
  return <CharacterCounterTool />;
}