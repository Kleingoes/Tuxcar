'use client';
// app/(auth)/sign-in/[[...rest]]/page.tsx
import { SignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isStaff } from '@/lib/admin';

export default function SignInPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const email = user?.primaryEmailAddress?.emailAddress ?? '';
      if (isStaff(email)) {
        router.replace('/dashboard');
      } else {
        router.replace('/');
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  if (isLoaded && isSignedIn) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <SignIn />
    </div>
  );
}
