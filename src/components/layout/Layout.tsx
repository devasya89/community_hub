import { ReactNode, lazy, Suspense } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

const AIChatbot = lazy(() => import("@/components/chat/AIChatbot"));

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  showChatbot?: boolean;
}

export function Layout({ children, showFooter = true, showChatbot = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-14 md:pt-20">{children}</main>
      {showFooter && <Footer />}
      {showChatbot && (
        <Suspense fallback={null}>
          <AIChatbot />
        </Suspense>
      )}
    </div>
  );
}
