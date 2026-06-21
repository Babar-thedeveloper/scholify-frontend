import { PublicNavbar } from "@/components/public-navbar";
import { Footer } from "@/components/home/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-full">
      <PublicNavbar />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
