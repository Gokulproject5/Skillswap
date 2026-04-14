"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Header = () => {
    const pathname = usePathname();
    
  return (
     <header className='flex justify-between bg-white  items-center border-b border-gray-100 px-6 py-7 md:px-20 shadow-xl shadow-gray-100 '>
                <Link href={"/"} className='flex items-center gap-2'>
                    <div className='w-12 h-12'>
                        <img src="/logo2.png" className='w-full h-full object-contain' alt="logo" />
                    </div>
                    <h1 className='font-bold text-2xl tracking-tighter text-gray-800'>
                        Skill Swap <span className='text-blue-600'>Pro</span>
                    </h1>
                </Link>

               {
                pathname === "/" && (
                     <div className='flex items-center gap-4'>
                    <Link href="/auth/login" className='text-gray-600 font-medium hover:text-blue-600 transition-colors'>
                        Login
                    </Link>
                    <Link href="/auth/signup" className='py-2.5 px-6 rounded-full bg-blue-600 text-white font-medium shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all'>
                        Get Started
                    </Link>
                </div>
                )
               }
            </header>
  )
}

export default Header