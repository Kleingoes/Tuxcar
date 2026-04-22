'use client';

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { NavigationMenuDemo } from "./menu-list";
import MenuMobile from "./menu-mobile";
import { ModeToggle } from "./toggle-theme";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  return (
    <div className="flex items-center justify-between p-4 mx-auto cursor-pointer sm:max-w-4xl md:max-w-6xl">

      <h1
        className="text-3xl"
        onClick={() => router.push("/")}
      >
        Tuxcar
      </h1>

      {/* Menú desktop */}
      <div className="items-center justify-between hidden sm:flex">
        <NavigationMenuDemo />
      </div>

      {/* Menú mobile */}
      <div className="flex sm:hidden">
        <MenuMobile />
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 sm:gap-5">
        <ModeToggle />

        <Heart
          strokeWidth={1}
          className="cursor-pointer"
          onClick={() => router.push("/favoritos")}
        />

        {/* Sin sesión: botón Iniciar sesión */}
        {!isSignedIn && (
          <>
            <Link
              href="/sign-in"
              className="text-sm font-medium px-4 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-500 dark:hover:border-zinc-500 transition-colors hidden sm:inline-flex"
            >
              Iniciar sesión
            </Link>
            {/* Mobile: solo icono */}
            <Link href="/sign-in" className="sm:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </Link>
          </>
        )}

        {/* Con sesión: avatar Clerk */}
        {isSignedIn && (
          <UserButton />
        )}
      </div>
    </div>
  );
};

export default Navbar;