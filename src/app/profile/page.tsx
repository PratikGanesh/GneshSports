'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (status === 'authenticated') {
      // Pre-fill email from session immediately
      if (session?.user?.email) {
        setEmail(session.user.email);
      }
      if (session?.user?.name) {
        setName(session.user.name);
      }
      
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => {
          setName(data.name || '');
          setEmail(data.email || '');
          setPhone(data.phone || '');
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [status, router, session]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSaving(true);

    // Validate password fields if user is trying to change password
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match.');
        setIsSaving(false);
        return;
      }
      if (newPassword.length < 8) {
        setError('New password must be at least 8 characters.');
        setIsSaving(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          newPassword: newPassword || undefined,
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      setMessage('Profile updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-text-muted text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-display font-bold text-text-main">My Profile</h1>
          <p className="mt-2 text-text-muted">Manage your account details and security settings.</p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-8">

          {/* Personal Info Section */}
          <div className="bg-surface p-6 sm:p-8 rounded-xl border border-accent shadow-sm">
            <h2 className="text-xl font-bold text-text-main mb-6 pb-4 border-b border-accent">Personal Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="block w-full rounded-md border border-accent px-4 py-3 text-text-main bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="text"
                    value={email}
                    disabled
                    placeholder="Your email address"
                    autoComplete="off"
                    className="block w-full rounded-md border border-accent px-4 py-3 pr-10 text-text-muted bg-gray-100 sm:text-sm cursor-not-allowed opacity-70"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-text-muted">
                    🔒
                  </span>
                </div>
                <p className="mt-1 text-xs text-text-muted">Email cannot be changed for security reasons.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number (e.g. +91 98765 43210)"
                  autoComplete="off"
                  name="phone_number_field"
                  className="block w-full rounded-md border border-accent px-4 py-3 text-text-main bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="bg-surface p-6 sm:p-8 rounded-xl border border-accent shadow-sm">
            <h2 className="text-xl font-bold text-text-main mb-6 pb-4 border-b border-accent">Change Password</h2>
            <p className="text-sm text-text-muted mb-5">Leave these fields empty if you don&apos;t want to change your password.</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter a new password"
                  autoComplete="new-password"
                  className="block w-full rounded-md border border-accent px-4 py-3 text-text-main bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                  className="block w-full rounded-md border border-accent px-4 py-3 text-text-main bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Feedback Messages */}
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm font-medium">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm font-medium">
              {error}
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {isSaving ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </form>

      </div>
    </div>
  );
}
