'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@/lib/useUser';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';

const links = [
  { name: 'Home', href: '/' },
  // { name: 'My Bookings', href: '/bookings' },
];

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M6 6l12 12M6 18L18 6" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, isLoading, refresh } = useUser();

  const handleLogout = async () => {
    try {
      await fetch('/api/sessionLogout', { method: 'POST' });
      await signOut(auth);
    } catch {
      console.error('Logout failed');
    }
    await refresh?.();
    router.push('/login');
    setOpen(false);
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold text-indigo-600"
            >
              <span className="sr-only">GymBook</span>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                G
              </div>
              <span>GymBook</span>
            </Link>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex gap-8">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative flex items-center py-2 text-sm font-medium transition ${
                    active
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  {l.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="text-sm text-gray-500">Checking...</div>
            ) : user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium px-3 py-1 border rounded hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-semibold px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((o) => !o)}
              className="p-2 rounded-md inline-flex items-center justify-center text-gray-700 hover:bg-gray-100"
            >
              {open ? (
                <CloseIcon className="w-6 h-6" />
              ) : (
                <HamburgerIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-2 border-t border-gray-300 pt-4 pb-4 space-y-2">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition ${
                    active
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {l.name}
                </Link>
              );
            })}
            <div className="flex gap-2 px-3 pt-2">
              {isLoading ? (
                <div className="flex-1 text-sm text-gray-500">Checking...</div>
              ) : user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="flex-1 text-center text-sm font-semibold px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex-1 text-sm font-medium text-gray-700 hover:text-indigo-600"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="flex-1 text-center text-sm font-semibold px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    onClick={() => setOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
