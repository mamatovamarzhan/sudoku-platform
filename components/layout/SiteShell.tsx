import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface SiteShellProps {
  children: React.ReactNode;
  className?: string;
}

export function SiteShell({ children, className = "" }: SiteShellProps) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <Navbar />
      <div className={`flex-1 ${className}`}>{children}</div>
      <Footer />
    </div>
  );
}
