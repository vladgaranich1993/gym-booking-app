'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Twitter, Instagram, Facebook, Linkedin } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // rudimentary email check
    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus('error');
      return;
    }
    // simulate success (swap in real API later)
    setStatus('success');
    setEmail('');
  };

  return (
    <footer className="bg-gray-50 border-t rounded-md border-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand / about */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              G
            </div>
            GymBook
          </h2>
          <p className="text-sm text-gray-600">
            Easy group training booking. See upcoming sessions, reserve your
            spot, and stay motivated with community-powered workouts.
          </p>
          <div className="flex space-x-3">
            <a
              aria-label="Twitter"
              href="#"
              className="hover:text-indigo-600"
              rel="noreferrer"
            >
              <Twitter size={20} />
            </a>
            <a
              aria-label="Instagram"
              href="#"
              className="hover:text-indigo-600"
              rel="noreferrer"
            >
              <Instagram size={20} />
            </a>
            <a
              aria-label="Facebook"
              href="#"
              className="hover:text-indigo-600"
              rel="noreferrer"
            >
              <Facebook size={20} />
            </a>
            <a
              aria-label="LinkedIn"
              href="#"
              className="hover:text-indigo-600"
              rel="noreferrer"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/bookings" className="hover:underline">
                My Bookings
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:underline">
                All Sessions
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:underline">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:underline">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Stay in the loop</h3>
          <p className="text-sm text-gray-600">
            Get updates about new sessions, promotions, and tips.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus('idle');
              }}
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-invalid={status === 'error'}
            />
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition"
            >
              Subscribe
            </button>
          </form>
          {status === 'error' && (
            <p className="text-sm text-red-600">Please enter a valid email.</p>
          )}
          {status === 'success' && (
            <p className="text-sm text-green-600">Subscribed!</p>
          )}
        </div>
      </div>

      <div className="border-t rounded-md border-gray-300 py-6 mt-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
          <div>
            © {new Date().getFullYear()} GymBook. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="hover:underline">
              Support
            </Link>
          </div>
          <div>
            <a href="#top" className="hover:underline">
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
