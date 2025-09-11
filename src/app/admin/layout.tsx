"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import AdminNavigation from "@/components/AdminNavigation";
import { isAdminAuthenticated, clearAdminAuthentication } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication for all admin pages except login
    if (pathname !== '/admin/login') {
      if (!isAdminAuthenticated()) {
        router.replace('/admin/login');
        return;
      }
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [pathname, router]);

  // Don't apply layout to login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  function handleLogout() {
    clearAdminAuthentication();
    router.replace('/admin/login');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: "var(--color-navy)"}}>
        <div className="text-lg" style={{color: "var(--color-lightgrey)"}}>Checking authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null; // Will redirect
  }
  
  return (
    <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(to bottom, var(--color-navy-dark) 0%, var(--color-navy), var(--color-navy) 100%)", color: "var(--color-lightgrey)"}}>
      <Navbar />
      <main className="flex-1 mt-16 sm:mt-20 md:mt-20 pt-4 md:pt-8 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{color: "var(--color-gold)"}}>Admin Panel</h1>
              <p className="text-gray-500">All timestamps displayed in Jakarta Time (WIB)</p>
            </div>
          </div>

          <AdminNavigation />
          
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
