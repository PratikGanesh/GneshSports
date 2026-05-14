'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const errors: typeof fieldErrors = {};

    if (!validateEmail(email)) errors.email = 'Please enter a valid email address';
    if (password.length < 1) errors.password = 'Password is required';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    if (res?.error) {
      setError('Invalid email or password');
      setIsLoading(false);
    } else {
      router.push('/shop');
      router.refresh();
    }
  };

  return (
    <div className="bg-background min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-surface p-8 rounded-xl shadow-lg border border-accent">
        <div>
          <h2 className="text-center text-3xl font-display font-bold tracking-tight text-text-main">
            Sign in to Shree Ganesh Sports
          </h2>
          <p className="mt-2 text-center text-sm text-text-muted">
             View orders, track shipments, and manage your cart.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Email Address</label>
              <input
                type="email"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${fieldErrors.email ? 'border-red-400' : 'border-accent'} placeholder-text-muted text-text-main focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-background`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: undefined })); }}
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Password</label>
              <input
                type="password"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${fieldErrors.password ? 'border-red-400' : 'border-accent'} placeholder-text-muted text-text-main focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-background`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: undefined })); }}
              />
              {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded border border-red-200">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all pointer-events-auto"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
          
          <div className="text-center mt-4">
             <span className="text-sm text-text-muted">Don&apos;t have an account? </span>
             <Link href="/register" className="text-sm font-medium text-primary hover:underline">
               Register here
             </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
