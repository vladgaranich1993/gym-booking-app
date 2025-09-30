'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { useUser } from '@/lib/useUser';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';
import { useEvents } from '@/hooks/useEvents';
import { useSearch } from '@/providers/SearchProvider';

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
  const { search, setSearch, setSearching } = useSearch();
  const [showResults, setShowResults] = useState(false);
  const { data: events = [] } = useEvents();
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSearching(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setSearching(false);
    }, 400);
    setShowResults(true);
  };

  const filteredEvents =
    search.trim().length > 0
      ? events.filter((e) =>
          e.title.toLowerCase().includes(search.toLowerCase())
        )
      : [];

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

          {/* Search bar (desktop only) */}
          <div className="relative flex-1 mx-4 max-w-xs hidden md:block">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              placeholder="Search events..."
              className="w-full px-3 py-2 border border-indigo-500/100 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {showResults && filteredEvents.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white border rounded shadow-lg z-50 max-h-80 overflow-y-auto">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="p-2 hover:bg-gray-100 cursor-pointer">
                    <Link href={`/events/${event.id}`} onClick={() => setShowResults(false)}>
                      <div className="flex items-center gap-2">
                        <img src={event.image || '/placeholder.jpg'} alt={event.title} className="w-10 h-10 object-cover rounded" />
                        <div>
                          <div className="font-medium text-sm">{event.title}</div>
                          <div className="text-xs text-gray-500">{event.category}</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                {filteredEvents.length === 0 && (
                  <div className="p-2 text-gray-500 text-sm">No events found.</div>
                )}
              </div>
            )}
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
            {/* Search bar (mobile only) */}
            <div className="relative mb-2">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                onFocus={() => setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 150)}
                placeholder="Search events..."
                className="w-full px-3 py-2 border border-indigo-500/100 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {showResults && filteredEvents.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white border rounded shadow-lg z-50 max-h-80 overflow-y-auto">
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="p-2 hover:bg-gray-100 cursor-pointer">
                      <Link href={`/events/${event.id}`} onClick={() => setShowResults(false)}>
                        <div className="flex items-center gap-2">
                          <img src={event.image || '/placeholder.jpg'} alt={event.title} className="w-10 h-10 object-cover rounded" />
                          <div>
                            <div className="font-medium text-sm">{event.title}</div>
                            <div className="text-xs text-gray-500">{event.category}</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                  {filteredEvents.length === 0 && (
                    <div className="p-2 text-gray-500 text-sm">No events found.</div>
                  )}
                </div>
              )}
            </div>

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
