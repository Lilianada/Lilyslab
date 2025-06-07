import { Breadcrumb } from "@/components/layout/breadcrumb-nav";
import MobileNav from "@/components/layout/mobile-nav";
import Sidebar from "@/components/layout/sidebar";

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300 lg:flex-row relative">
      <Sidebar />
      <MobileNav />
      <div className="flex-1 px-4 py-6 lg:px-8 lg:py-10 flex flex-col min-h-[calc(100vh-4rem)]" role="region" aria-label="Main content"> 
        <Breadcrumb />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}