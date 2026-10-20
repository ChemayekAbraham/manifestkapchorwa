import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { FloatingLogo } from "@/components/public/floating-logo";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FloatingLogo />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
