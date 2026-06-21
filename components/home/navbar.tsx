import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeNavbar() {
  return (
    <header className="glass sticky top-0 z-50 w-full rounded-none">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 xl:max-w-8xl 2xl:max-w-screen-2xl">
        <Link href="/home" className="flex items-center gap-2 font-bold text-xl">
          <span className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-xl shadow-[0_6px_20px_-6px_rgba(5,150,105,0.7)]">
            S
          </span>
          <span className="text-foreground">Scholify</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="/home" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/scholarships" className="text-muted-foreground hover:text-foreground transition-colors">
            Scholarships
          </Link>
          <Link href="/home#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="/home#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
