import Link from 'next/link'
import React from 'react'
import { Wave } from './Wave'
import { BsGithub, BsLinkedin, BsTwitter } from 'react-icons/bs'
import { Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white ">

            <div className="w-full  rotate-180 ">
                <Wave />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-20 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-100 pb-12">

                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <div className="flex items-center gap-2">
                            <img src="/logo2.png" className="w-8 h-8 object-contain" alt="logo" />
                            <span className="font-bold text-xl tracking-tighter text-gray-800">
                                Skill Swap 
                            </span>
                        </div>
                        <p className="text-gray-500 leading-relaxed">
                            The world's leading platform for professional peer-to-peer skill exchange.
                        </p>
                        <div className="flex gap-4">
                            <Link href="" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-blue-600 transition-colors">
                                <BsTwitter size={20} />
                            </Link>
                            <Link href="" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-blue-600 transition-colors">
                                <BsLinkedin size={20} />
                            </Link>
                            <Link href="" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-blue-600 transition-colors">
                                <BsGithub size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-gray-900">Platform</h4>
                        <ul className="space-y-4 text-gray-500">
                            <li><Link href="" className="hover:text-blue-600 transition-colors">Features</Link></li>
                            <li><Link href="" className="hover:text-blue-600 transition-colors">How it Works</Link></li>
                            <li><Link href="" className="hover:text-blue-600 transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-bold text-gray-900">Company</h4>
                        <ul className="space-y-4 text-gray-500">
                            <li><Link href="" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                            <li><Link href="" className="hover:text-blue-600 transition-colors">Careers</Link></li>
                            <li><Link href="privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-bold text-gray-900">Support</h4>
                        <ul className="space-y-4 text-gray-500 flex flex-col">
                            <li className="flex items-center gap-2"><Mail size={16} /> support@skillswap.com</li>
                            <li><Link href="" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
                            <li><Link href="" className="hover:text-blue-600 transition-colors">Community Guidelines</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
                    <p>© {new Date().getFullYear()} Skill Swap  Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
                        <Link href="" className="hover:text-gray-600 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer