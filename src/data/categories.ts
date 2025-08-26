import { 
  Type, 
  Calculator, 
  Calendar, 
  Code, 
  FileText, 
  HeartPulse, 
  Hash,
  Ruler,
  Scale,
  Thermometer,
  Percent,
  DollarSign,
  Cake,
  Globe,
  Clock,
  Braces,
  Key,
  QrCode,
  Flame,
  Droplets 
} from "lucide-react";
import { LucideIcon } from "lucide-react"; // If using Lucide icons
// Define the type for a category
export interface Category {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
  color: string;
  tools: {
    title: string;
    href: string;
    description: string;
    icon: LucideIcon;
    comingSoon?: boolean;
  }[];
}

// Array of our main categories with tools
export const mainCategories: Category[] = [
  {
    title: "Text Tools",
    href: "/text-tools",
    description: "Word counter, character counter, case converter, and more.",
    icon: FileText,
    color: "from-blue-500 to-blue-600",
    tools: [
      {
        title: "Word Counter",
        href: "/tools/word-counter",
        description: "Count words, characters, sentences, and paragraphs",
        icon: FileText
      },
      {
        title: "Character Counter",
        href: "/tools/character-counter", 
        description: "Count characters with and without spaces",
        icon: Hash
      },
      {
        title: "Case Converter",
        href: "/tools/case-converter",
        description: "Convert text between different cases",
        icon: Type,
        comingSoon: true
      },
      {
        title: "Grammar Checker",
        href: "/tools/grammar-checker",
        description: "Check and correct grammar mistakes",
        icon: FileText,
        comingSoon: true
      }
    ]
  },
  {
    title: "Unit Converters",
    href: "/converters",
    description: "Length, weight, temperature, digital storage, and more.",
    icon: Ruler,
    color: "from-green-500 to-green-600",
    tools: [
      {
        title: "Length Converter",
        href: "/tools/length-converter",
        description: "Convert between different length units",
        icon: Ruler,
        comingSoon: true
      },
      {
        title: "Weight Converter",
        href: "/tools/weight-converter",
        description: "Convert between different weight units",
        icon: Scale,
        comingSoon: true
      },
      {
        title: "Temperature Converter",
        href: "/tools/temperature-converter",
        description: "Convert between temperature scales",
        icon: Thermometer,
        comingSoon: true
      }
    ]
  },
  {
    title: "Calculators",
    href: "/calculators",
    description: "Percentage, tip, financial, and health calculators.",
    icon: Calculator,
    color: "from-purple-500 to-purple-600",
    tools: [
      {
        title: "Percentage Calculator",
        href: "/tools/percentage-calculator",
        description: "Calculate percentages easily",
        icon: Percent,
        comingSoon: true
      },
      {
        title: "Tip Calculator",
        href: "/tools/tip-calculator",
        description: "Calculate tips and split bills",
        icon: DollarSign,
        comingSoon: true
      },
      {
        title: "BMI Calculator",
        href: "/tools/bmi-calculator",
        description: "Calculate Body Mass Index",
        icon: HeartPulse,
        comingSoon: true
      }
    ]
  },
  {
    title: "Time & Date Tools",
    href: "/time-date",
    description: "World clock, time zone converter, countdown timer, age calculator.",
    icon: Calendar,
    color: "from-amber-500 to-amber-600",
    tools: [
      {
        title: "Age Calculator",
        href: "/tools/age-calculator",
        description: "Calculate age from birth date",
        icon: Cake,
        comingSoon: true
      },
      {
        title: "Time Zone Converter",
        href: "/tools/timezone-converter",
        description: "Convert between time zones",
        icon: Globe,
        comingSoon: true
      },
      {
        title: "Countdown Timer",
        href: "/tools/countdown-timer",
        description: "Create and share countdowns",
        icon: Clock,
        comingSoon: true
      }
    ]
  },
  {
    title: "Developer Tools",
    href: "/developer",
    description: "JSON formatter, code beautifier, password generator, QR code creator.",
    icon: Code,
    color: "from-red-500 to-red-600",
    tools: [
      {
        title: "JSON Formatter",
        href: "/tools/json-formatter",
        description: "Format and validate JSON data",
        icon: Braces,
        comingSoon: true
      },
      {
        title: "Password Generator",
        href: "/tools/password-generator",
        description: "Generate secure passwords",
        icon: Key,
        comingSoon: true
      },
      {
        title: "QR Code Generator",
        href: "/tools/qr-code-generator",
        description: "Create QR codes for URLs and text",
        icon: QrCode,
        comingSoon: true
      }
    ]
  },
  {
    title: "Health & Fitness",
    href: "/health-fitness",
    description: "BMI calculator, calorie calculator, water intake calculator.",
    icon: HeartPulse,
    color: "from-pink-500 to-pink-600",
    tools: [
      {
        title: "BMI Calculator",
        href: "/tools/bmi-calculator",
        description: "Calculate Body Mass Index",
        icon: HeartPulse,
        comingSoon: true
      },
      {
        title: "Calorie Calculator",
        href: "/tools/calorie-calculator",
        description: "Calculate daily calorie needs",
        icon: Flame,
        comingSoon: true
      },
      {
        title: "Water Intake Calculator",
        href: "/tools/water-calculator",
        description: "Calculate recommended water intake",
        icon: Droplets,
        comingSoon: true
      }
    ]
  }
];

// Helper function to get all tools for search
export const getAllTools = () => {
  return mainCategories.flatMap(category => 
    category.tools.map(tool => ({
      ...tool,
      category: category.title,
      categoryHref: category.href
    }))
  );
};

// Get featured tools for homepage
export const getFeaturedTools = () => {
  return [
    {
      title: "Word Counter",
      href: "/tools/word-counter",
      description: "Count words, characters, sentences, and paragraphs",
      icon: FileText,
      category: "Text Tools"
    },
    {
      title: "Character Counter",
      href: "/tools/character-counter",
      description: "Count characters with and without spaces", 
      icon: Hash,
      category: "Text Tools"
    },
    {
      title: "Percentage Calculator",
      href: "/tools/percentage-calculator",
      description: "Calculate percentages easily",
      icon: Percent,
      category: "Calculators",
      comingSoon: true
    }
  ];
};