'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Navbar({ categories }: { categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { getTotalItems } = useCartStore();
  const cartItemsCount = mounted ? getTotalItems() : 0;

  // eslint-disable-next-line
  useEffect(() => { setMounted(true); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-surface sticky top-0 z-50 border-b border-accent shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-display font-bold text-lg md:text-xl text-primary tracking-tight">SHREE GANESH SPORTS</span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/sports/${cat.slug}`}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-text-muted hover:border-primary hover:text-text-main transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/shop"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-text-muted hover:border-secondary hover:text-text-main transition-colors"
              >
                More
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden sm:flex sm:items-center">
              <form onSubmit={handleSearch} className="relative mx-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-text-muted" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="block w-full pl-10 pr-3 py-2 border border-accent rounded-md leading-5 bg-background text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-shadow"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Get a Quote
              </Link>
              
              <div className="flex items-center border-l border-accent pl-4 ml-4 gap-4">
                <Link href="/cart" className="relative p-2 text-text-muted hover:text-primary transition-colors">
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                
                {session ? (
                  <div className="flex items-center gap-3">
                    <Link href={session.user.role === 'admin' ? '/admin' : '/profile'} className="p-2 text-text-muted hover:text-primary transition-colors">
                      <UserIcon className="h-6 w-6" />
                    </Link>
                    <button onClick={() => signOut()} className="text-sm font-medium text-text-muted hover:text-red-500 transition-colors">
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="text-sm font-medium text-text-muted hover:text-primary transition-colors">
                    Log in
                  </Link>
                )}
              </div>
            </div>
            
            <div className="-mr-2 flex items-center sm:hidden gap-4">
              <Link href="/cart" className="relative p-2 text-text-muted hover:text-primary transition-colors">
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-text-muted hover:text-text-main hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-t border-accent overflow-hidden bg-surface"
          >
            <div className="pt-2 pb-3 space-y-1">
              <form onSubmit={handleSearch} className="px-4 py-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-text-muted" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="block w-full pl-10 pr-3 py-2 border border-accent rounded-md leading-5 bg-background text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/sports/${cat.slug}`}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-text-muted hover:bg-accent hover:border-primary hover:text-text-main transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/contact"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-primary hover:bg-accent hover:border-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Get a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
