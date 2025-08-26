import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Brand Section */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="font-bold text-lg">
              ToolStack
            </Link>
            <p className="text-sm text-muted-foreground">
              Your all-in-one suite of free, fast, and modern web tools.
            </p>
          </div>

          {/* Tool Categories Links - Placeholder */}
          <div className="flex flex-col gap-2 text-sm">
            <h3 className="font-semibold">Tool Categories</h3>
            <Link href="/text-tools" className="text-muted-foreground hover:text-foreground">
              Text Tools
            </Link>
            <Link href="/converters" className="text-muted-foreground hover:text-foreground">
              Converters
            </Link>
            <Link href="/calculators" className="text-muted-foreground hover:text-foreground">
              Calculators
            </Link>
          </div>

          {/* Company Links - Placeholder */}
          <div className="flex flex-col gap-2 text-sm">
            <h3 className="font-semibold">Company</h3>
            <Link href="/about" className="text-muted-foreground hover:text-foreground">
              About Us
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Bottom Bar - Copyright */}
        <div className="mt-8 border-t pt-8 text-center text-xs text-muted-foreground">
          <p>
            © {2024} - {currentYear} ToolStack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}