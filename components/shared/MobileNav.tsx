'use client'

import Link from "next/link"
import Image from "next/image"

import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { navLinks } from "@/app/constants"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"
  


const MobileNav = () => {

  const pathname = usePathname()

  return (

    <header className='header'>
        <nav>
            <SignedIn>
                <Sheet>
                    <SheetTrigger>
                        <div className='flex items-center md:py-2'>
                            <Image 
                                src='/assets/images/logo-text.svg' 
                                alt='logo' 
                                width={180} 
                                height={28} />
                        </div>
                    </SheetTrigger>
                        <SheetContent side='left' className='sheet-content sm:w-64'>
                            <>
                                <Image 
                                    src="/assets/images/logo-text.svg" 
                                    alt="logo" 
                                    width={152} 
                                    height={23}/>
                                <br></br>
                                <ul className='side-nav_elements'>
                                    {navLinks.slice(0,6).map((link)=>{
                                        const isActive = link.route === pathname

                                        return (
                                            <li key={link.route} className={`${isActive && 'gradient-text'} p-18 flex whitespace-nowrap text-dark-700}`}>
                                                <Link className='sidebar-link cursor-pointer' href={link.route}>
                                                    <Image src={link.icon} alt="logo" width={24} height={24}/>
                                                    {link.label}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                                {/* <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br> */}
                                <ul className='side-nav_elements'>
                                    {navLinks.slice(6).map((link)=>{
                                        const isActive = link.route === pathname

                                        return (
                                            <li key={link.route} className={`${isActive && 'gradient-text'} p-18 flex whitespace-nowrap text-dark-700}`}>
                                                <Link className='sidebar-link' href={link.route}>
                                                    <Image src={link.icon} alt="logo" width={24} height={24}/>
                                                    {link.label}
                                                </Link>
                                            </li>
                                        )
                                    })}

                                    {/* <li className='cursor-pointer gap2 p-4'>
                                        <UserButton afterSignOutUrl='/' showName />
                                    </li> */}

                                </ul>
                            </>
                        </SheetContent>
                </Sheet>
            </SignedIn>


            <SignedOut>
                <Button asChild className="button bg-purple-gradient bg-cover">
                    <Link href="/sign-in">Login</Link>
                </Button>
          </SignedOut>

        </nav>

        <UserButton afterSignOutUrl='/' />
        
    </header>
    
  )
}

export default MobileNav


