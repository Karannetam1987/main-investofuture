import Link from "next/link";
import { Logo } from "./logo";

export function AppFooter() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col-reverse items-center justify-between gap-y-8 md:flex-row">
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground md:gap-6">
            <Link href="#about" className="hover:text-foreground transition-colors">About Us</Link>
            <Link href="#privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link>
          </nav>
          
          <div className="md:mt-0">
            <Logo />
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
            <p className="text-center text-sm text-muted-foreground">© {new Date().getFullYear()} InvestoFuture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
