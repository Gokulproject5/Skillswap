"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import Tooltip from './Tooltip';
import { menuItems } from "@/Data/navItems";

const Navbar = () => {
    const pathname = usePathname();


    return (

        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2  lg:left-14 lg:top-1/3 z-50 transition-all duration-300 w-fit">

            <ul className='flex lg:flex-col  items-center gap-2 md:gap-4 p-2 md:p-3 rounded-full bg-white/90 backdrop-blur-md border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'>
                {menuItems.map((menu) => {
                    const isActive = pathname.includes(menu.href);
                    return (
                        <li key={menu.name} className="relative group">
                            {/* Tooltip */}
                            <div className="hidden md:block">
                                <Tooltip title={menu.name} style={"left-full  top-1/2 -translate-y-1/2  translate-x-4 "} />
                            </div>

                            <Link
                                href={menu.href}
                                aria-current={isActive ? 'page' : undefined}
                                className={`
                                    relative flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full transition-all duration-300 active:scale-95
                                    ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40'
                                        : 'text-gray-400 hover:bg-gray-100 hover:text-blue-600'
                                    }
                                `}
                            >
                                <svg
                                    viewBox="0 -960 960 960"
                                    className="h-5 w-5 md:h-6 md:w-6 shrink-0 transition-colors"
                                    fill="currentColor"
                                >
                                    {isActive ? menu.active : menu.icon}
                                </svg>


                                {isActive && (
                                    <span className="absolute -bottom-1 md:hidden h-1 w-1 bg-blue-600 rounded-full"></span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Navbar;
