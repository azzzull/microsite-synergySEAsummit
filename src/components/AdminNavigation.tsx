"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearAdminAuthentication, getCurrentAdmin } from '@/lib/auth';
import { useState, useEffect } from 'react';

export default function AdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = getCurrentAdmin();
    setCurrentUser(user);
  }, []);

  const handleLogout = async () => {
    try {
      clearAdminAuthentication();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      localStorage.removeItem('admin_token');
      router.push('/admin/login');
    }
  };

  const navItems = [
    { href: '/admin/pricing', label: 'Pricing' },
    { href: '/admin/vouchers', label: 'Vouchers' },
  ];

  return (
    <nav className="bg-white/5 rounded-lg p-4 mb-8 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg transition-colors hover:cursor-pointer ${
                pathname === item.href
                  ? 'bg-[var(--color-gold)] text-[var(--color-navy)]'
                  : 'text-[var(--color-lightgrey)] hover:bg-white/10'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          {currentUser && (
            <span className="text-gray-300 text-sm">
              👤 {currentUser.username}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors hover:cursor-pointer"
          >
            🔒 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
