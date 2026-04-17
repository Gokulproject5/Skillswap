"use client"
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { navItems } from "@/Data/navItems";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import Input from './Input';
import { LogOut } from "lucide-react";
import { clearUser } from "@/feature/loginSlice";


const Header = () => {
    const navigate = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const userData = useSelector((state) => state.loginData.currentUser)
    const pathname = usePathname();
    const isactive = pathname === "/profile"
    // props for input component
    const input = {
        type: "text",
        placeholder: "Search...",
    };

    //  dispatch func in redux
    const dispatch = useDispatch();

    //  handle logout 
    const handleLogout = () => {
        dispatch(clearUser());
        sessionStorage.removeItem("Login")
        sessionStorage.removeItem("token")
        navigate.replace("/auth/login");

    }



    return (
        <>
            <header className="px-4 md:px-10 py-2 fixed w-full shadow bg-white shadow-gray-100 z-60">
                <div className="flex items-center justify-between">
                    {/* Logo Area */}
                    <div onClick={() => navigate.push("/dashboard")} className="flex items-center -space-x-2.5 cursor-pointer shrink-0">
                        <Image
                            src="/logo2.png"
                            alt="App Icon"
                            width={80}
                            height={40}
                            className="drag object-cover w-12 md:w-15"
                            loading="eager"
                        />
                        <h1 className="text-gray-600 font-bold text-lg md:text-2xl tracking-tighter">
                            Skill Swap <span className="text-blue-600">Pro</span>
                        </h1>
                    </div>


                    {/* Desktop Navigation */}
                    <div className="hidden md:block select-none cursor-pointer">
                        <nav>
                            <ul className="flex items-center space-x-2 md:space-x-4 text-gray-700">
                                {navItems.map(({ name, Icon, action, hasBadge }) => (
                                    <li key={name} className="relative group flex justify-center items-center">
                                        <button
                                            onClick={() => action && dispatch(action())}
                                            className="rounded-full p-2 text-xl md:text-2xl transition-colors hover:bg-gray-100 focus:text-blue-500 focus:outline-none"
                                        >
                                            <Icon />
                                            {hasBadge && (
                                                <span className="absolute right-2 top-2 flex h-2 w-2">
                                                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                                                </span>
                                            )}
                                        </button>
                                        <Tooltip title={name} style={"translate-y-9 "} />
                                    </li>
                                ))}

                                <li className="flex items-center pl-2">
                                    <Link href="/profile" className={`group rounded-full focus:outline-none focus:ring-2 relative flex items-center justify-center focus:ring-blue-600 ${isactive && "ring-2 ring-blue-600"}`}>
                                        <Tooltip title={userData?.name} style={"translate-y-9 "} />
                                        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-gray-200">
                                            {userData?.profile_pic &&
                                                <Image sizes="true"
                                                    src={userData?.profile_pic || '/logo2.png'}
                                                    alt="User"
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-110"
                                                />

                                            }
                                        </div>

                                    </Link>
                                </li>
                                <li>
                                    <button className="hover:bg-gray-100 relative group  p-2  text-gray-700 hover:text-red-500 rounded-full " onClick={handleLogout}>
                                        <LogOut className="size-6" />
                                        <Tooltip title={"Logout"} style={"translate-y-3 left-0"} />
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Mobile Menu  */}
                    <div className="md:hidden flex items-center space-x-4">
                        <Link href="/profile">
                            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-gray-200">
                                <Image sizes="true" src={userData?.profile_pic || "/logo.png"} alt="User" fill className="object-cover" />
                            </div>
                        </Link>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-3xl text-gray-600">
                            {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 p-4 shadow-xl animate-in slide-in-from-top duration-300">
                        <div className="mb-4">
                            <Input value={input} />
                        </div>
                        <ul className="grid grid-cols-4 gap-4 py-2">
                            {navItems.map(({ name, Icon, action, hasBadge }) => (
                                <li key={name} className="flex flex-col items-center">
                                    <button
                                        onClick={() => {
                                            if (action) dispatch(action());
                                            setIsMenuOpen(false);
                                        }}
                                        className="relative p-3 bg-gray-50 rounded-xl text-2xl text-gray-700"
                                    >
                                        <Icon />
                                        {hasBadge && (
                                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
                                        )}
                                    </button>
                                    <span className="text-[10px] mt-1 text-gray-500 font-medium">{name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </header>
        </>
    );
};

export default Header;
