import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { mainCategories } from "@/data/categories";

export default function Home() {
  return (
    // MAIN FIX: Added a div with padding that wraps the entire page content
    <div className="flex flex-1 flex-col gap-12 px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-4 pb-12 pt-8 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none">
          Your All-in-One Suite of
          <span className="text-blue-600 dark:text-blue-400"> Modern Web Tools</span>
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Free, fast, and easy-to-use tools for developers, students, and professionals. 
          No installation required.
        </p>
      </section>

      {/* Category Grid Section */}
      {/* MAIN FIX: Removed 'container' and added max-width and margin auto for proper centering */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mainCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Link key={category.href} href={category.href} className="group">
              <Card 
                className={`h-full transition-all duration-300 group-hover:scale-105 border-2 ${category.color}`}
              >
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-muted p-3 group-hover:scale-110 transition-transform">
                    <IconComponent className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{category.title}</h3>
                  <p className="text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-center gap-4 pb-16 text-center">
        <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
          Need something else?
        </h2>
        <p className="max-w-[600px] text-muted-foreground">
          We&apos;re constantly adding new tools. Suggest a tool you&apos;d like to see!
        </p>
      </section>
    </div>
  );
}