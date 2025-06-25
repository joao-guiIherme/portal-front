"use client"; // Adicionado para usar hooks
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldShowSidebar = !["/login", "/register"].includes(pathname);

  return (
    <html lang="pt">
      <head />
      <body>
        <SidebarProvider>
          <div className="flex min-h-screen">
            {shouldShowSidebar && <AppSidebar />}
            <main className="flex-1 transition-all duration-300">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}