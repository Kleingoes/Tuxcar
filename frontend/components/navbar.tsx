'use client';

import { Heart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { NavigationMenuDemo } from "./menu-list";
import MenuMobile from "./menu-mobile";

const Navbar = () =>{
    const router = useRouter();

    return(
       <div className="flex items-center justify-between p-4 mx-auto cursor-pointer sm:max-w-4xl md:max-w-6xl">
      
      <h1
        className="text-3xl"onClick={() => router.push("/")}
      >
        Tuxcar</h1>
        <div className="items-center justify-between hidden sm:flex">
            <NavigationMenuDemo />
        </div>
        <div className="flex sm:hidden"><MenuMobile /></div>
        <div className="flex items-center justify-between gap-2 sm:gap-7">
            <Heart
          strokeWidth={1}
          className="cursor-pointer"
          onClick={() => router.push("/favoritos")}
        />
            <User 
          strokeWidth={1}
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
        </div>
    </div>
    
    

    );

}

export default Navbar;
