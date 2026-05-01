'use client';
// components/navbar.tsx
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, useUser, UserButton } from '@clerk/nextjs';
import { NavigationMenuDemo as MenuList } from '@/components/menu-list';
import MenuMobile from '@/components/menu-mobile';
import { ModeToggle as ToggleTheme } from '@/components/toggle-theme';
import { Heart, LayoutDashboard } from 'lucide-react';
import { isStaff } from '@/lib/admin';
import { useEffect } from 'react';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();

  const email = user?.primaryEmailAddress?.emailAddress ?? '';
  const esStaff = isStaff(email);

  useEffect(() => {
    if (isLoaded && isSignedIn && esStaff) {
      const staffRedirectPages = ['/', '/vehiculos', '/refacciones', '/servicio', '/financiamiento', '/contacto', '/favoritos'];
      if (staffRedirectPages.includes(pathname)) {
        router.replace('/dashboard');
      }
    }
  }, [isLoaded, isSignedIn, esStaff, pathname, router]);

  return (
    <div className="flex items-center justify-between p-4 mx-auto cursor-pointer sm:max-w-4xl md:max-w-6xl">
      <Link href={esStaff && isSignedIn ? '/dashboard' : '/'}>
        <Image src="/logo.png" alt="Tuxcar" width={60} height={50} className="object-contain" />
      </Link>

      <div className="items-center justify-between hidden sm:flex">
        {esStaff && isSignedIn ? (
          <Link href="/dashboard"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-500 transition-colors">
            <LayoutDashboard size={15} strokeWidth={1.5} />
            Dashboard
          </Link>
        ) : (
          <MenuList />
        )}
      </div>

      <div className="flex sm:hidden">
        <MenuMobile />
      </div>

      <div className="flex items-center gap-3">
        <ToggleTheme />
        {!esStaff && isSignedIn && (
          <Link href="/favoritos" className="text-zinc-400 hover:text-amber-500 transition-colors">
            <Heart size={18} strokeWidth={1.5} />
          </Link>
        )}
        {isSignedIn ? (
          <UserButton />
        ) : (
          <Link href="/sign-in"
            className="px-4 py-1.5 text-sm border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors">
            Iniciar sesión
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;