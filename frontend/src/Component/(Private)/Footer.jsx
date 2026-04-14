"use client"
import React from 'react'

const Footer = () => {
    
  return (
    <footer className={`transition-all duration-300 border-t border-gray-200 bg-white py-10 px-4 md:px-12 lg:px-24 xl:px-40`}>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-6'>
        
        {/* Brand Section */}
        <div className='space-y-1 w-full md:w-auto text-left'>
           <h1 className='text-xl font-bold text-gray-800 '>Skill Swap <span className='text-blue-600'>Pro</span></h1>
           <p className='text-[10px] md:text-xs text-gray-400 font-medium tracking-tight'>
             © 2026 SkillSwap Pro. Editorial Precision in Skill Exchange.
           </p>
        </div>
         
        {/* Links Section */}
        <div className='flex flex-wrap gap-x-4 md:gap-x-6 gap-y-3 text-[8px] md:text-[9px] font-bold text-gray-500 tracking-widest'>
           <a href="#" className='hover:text-blue-600 transition-colors uppercase cursor-pointer border-b border-transparent hover:border-blue-600'>Privacy Policy</a>
           <a href="#" className='hover:text-blue-600 transition-colors uppercase cursor-pointer border-b border-transparent hover:border-blue-600'>Terms of Service</a>
           <a href="#" className='hover:text-blue-600 transition-colors uppercase cursor-pointer border-b border-transparent hover:border-blue-600'>Help Center</a>
        </div>

      </div>
    </footer>
  )
}

export default Footer
