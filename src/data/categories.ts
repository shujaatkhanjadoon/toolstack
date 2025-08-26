import { Type, Calculator, Calendar, Code, FileText, HeartPulse } from "lucide-react";

// Define the type for a category
export interface Category {
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string; // We'll use this for hover effects
}

// Array of our main categories
export const mainCategories: Category[] = [
  {
    title: "Text Tools",
    href: "/text-tools",
    description: "Word counter, character counter, case converter, and more.",
    icon: FileText,
    color: "hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-200", // Blue theme
  },
  {
    title: "Unit Converters",
    href: "/converters",
    description: "Length, weight, temperature, digital storage, and more.",
    icon: Type,
    color: "hover:bg-green-50 dark:hover:bg-green-950/30 hover:border-green-200", // Green theme
  },
  {
    title: "Calculators",
    href: "/calculators",
    description: "Percentage, tip, financial, and health calculators.",
    icon: Calculator,
    color: "hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-200", // Purple theme
  },
  {
    title: "Time & Date Tools",
    href: "/time-date",
    description: "World clock, time zone converter, countdown timer, age calculator.",
    icon: Calendar,
    color: "hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border-amber-200", // Amber theme
  },
  {
    title: "Developer Tools",
    href: "/developer",
    description: "JSON formatter, code beautifier, password generator, QR code creator.",
    icon: Code,
    color: "hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200", // Red theme
  },
  {
    title: "Health & Fitness",
    href: "/health-fitness",
    description: "BMI calculator, calorie calculator, water intake calculator.",
    icon: HeartPulse,
    color: "hover:bg-pink-50 dark:hover:bg-pink-950/30 hover:border-pink-200", // Pink theme
  },
];