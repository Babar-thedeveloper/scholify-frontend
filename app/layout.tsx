import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/components/auth/UserContext";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const DESCRIPTION =
  "Find every scholarship and internship for Pakistani students in one place - national, international, and provincial. 100% free, with deadline reminders.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Scholify - Pakistan's #1 Scholarship & Internship Platform",
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  // Site-wide defaults - cascade to every page unless overridden.
  publisher: SITE_NAME,
  creator: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  keywords: [
    "scholarships in Pakistan",
    "internships in Pakistan",
    "fully funded scholarships",
    "study abroad for Pakistani students",
    "Chevening",
    "DAAD",
    "Fulbright",
    "HEC scholarships",
    "student internships",
    "free CV builder",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "Scholify - Pakistan's #1 Scholarship & Internship Platform",
    description: DESCRIPTION,
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Scholify - scholarships & internships for Pakistani students" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scholify - Pakistan's #1 Scholarship & Internship Platform",
    description: DESCRIPTION,
    images: ["/og-image.svg"],
  },
  icons: { icon: "/icon.svg" },
};

// Site-wide structured data: Organization + WebSite (with sitelinks search).
const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      description: DESCRIPTION,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/scholarships?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
