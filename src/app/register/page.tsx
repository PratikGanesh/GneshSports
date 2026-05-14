'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (pw: string) => {
    if (pw.length < 8) return 'Must be at least 8 characters';
    if (!/[A-Z]/.test(pw)) return 'Must include an uppercase letter';
    if (!/[a-z]/.test(pw)) return 'Must include a lowercase letter';
    if (!/[0-9]/.test(pw)) return 'Must include a number';
    return '';
  };

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const errors: typeof fieldErrors = {};

    if (!data.name.trim() || data.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
    if (!validateEmail(data.email)) errors.email = 'Please enter a valid email address';
    const pwErr = validatePassword(data.password);
    if (pwErr) errors.password = pwErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
      }

      const signInData = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInData?.error) {
        throw new Error('Registration complete, but auto-login failed. Please sign in manually.');
      } else {
         router.push('/shop');
         router.refresh();
      }

    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-surface p-8 rounded-xl shadow-lg border border-accent">
        <div>
          <h2 className="text-center text-3xl font-display font-bold tracking-tight text-text-main">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-text-muted">
            Join Shree Ganesh Sports Stores to unlock wholesale quotes and track your cart.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={registerUser}>
          <div className="space-y-4 rounded-md shadow-sm">
             <div>
              <label className="block text-sm font-medium text-text-main mb-1">Full Name</label>
              <input
                type="text"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${fieldErrors.name ? 'border-red-400' : 'border-accent'} placeholder-text-muted text-text-main focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-background`}
                placeholder="John Doe"
                value={data.name}
                onChange={(e) => { setData({ ...data, name: e.target.value }); setFieldErrors(p => ({ ...p, name: undefined })); }}
              />
              {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Email Address</label>
              <input
                type="email"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${fieldErrors.email ? 'border-red-400' : 'border-accent'} placeholder-text-muted text-text-main focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-background`}
                placeholder="you@example.com"
                value={data.email}
                onChange={(e) => { setData({ ...data, email: e.target.value }); setFieldErrors(p => ({ ...p, email: undefined })); }}
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
                value={data.password}
                onChange={(e) => { setData({ ...data, password: e.target.value }); setFieldErrors(p => ({ ...p, password: undefined })); }}
              />
              {fieldErrors.password ? (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
              ) : (
                <p className="mt-1 text-xs text-text-muted">Min 8 chars, 1 uppercase, 1 lowercase, 1 number</p>
              )}
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
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </div>
          
          <div className="text-center mt-4">
             <span className="text-sm text-text-muted">Already have an account? </span>
             <Link href="/login" className="text-sm font-medium text-primary hover:underline">
               Log in
             </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
