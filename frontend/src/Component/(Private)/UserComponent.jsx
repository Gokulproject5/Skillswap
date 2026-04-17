"use client";
import React from 'react';
import Image from 'next/image';
import { BiUserCheck } from 'react-icons/bi';
import Link from 'next/link';

const UserCard = ({ user, Loading }) => {

  if (Loading) {
    return <div className=' py-5  space-y-5  '>
      <div className='bg-gray-300 max-w-xs shim h-40 px-5 py-5'>
        <div className='flex justify-between items-center gap-5'>
          <div className='bg-gray-50  rounded-full w-20 h-20'>

          </div>
          <div className='flex-1 space-y-5'>
            <div className='flex-1 h-5 bg-gray-400 shim  rounded-md'>

            </div>
            <div className='flex-1 h-5 bg-gray-400 shim  rounded-md'>

            </div>
          </div>

        </div>
      </div>
      <div className='bg-gray-300 shim max-w-xs h-10'>

      </div>
    </div>
  }
  return (

    <div className='text-gray-600  w-full min-h-full p-5 rounded-md flex flex-col justify-between space-y-5 shadow-sm hover:shadow-xl bg-white border border-gray-100 duration-300 group transition-all'>




      <div className='space-y-4'>
        {/* Header Section */}
        <div className='flex items-center space-x-3'>
          <div className='relative w-12 h-12 overflow-hidden rounded-full border-2 border-gray-50 bg-gray-50 shrink-0 shadow-sm'>
            <Image
              className='object-cover transition-transform duration-500 group-hover:scale-110'
              src={user.profile_pic || "/fallback.jpg"}
              alt={user.name || "profile_img"}
              fill
              sizes="(max-width: 768px) 48px, 48px"
            />
          </div>
          <div className="overflow-hidden">
            <h4 className='font-bold text-gray-800 truncate text-sm md:text-base'>{user.name}</h4>
            <p className="text-[10px] text-green-500 font-medium">Available to Swap</p>
          </div>
        </div>

        {/* Skills */}
        <div className='space-y-2'>
          <h1 className='font-bold text-[9px] md:text-[10px] uppercase tracking-widest text-gray-400'>Core Expertise</h1>
          <div className='flex flex-wrap gap-1.5'>
            {(user.skills || []).map((skill, index) => (
              <span key={index} className='bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-md font-semibold border border-gray-200/50'>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Seeking Section */}
        <div className='space-y-2'>
          <h1 className='font-bold text-[9px] md:text-[10px] uppercase tracking-widest text-gray-400'>Seeking</h1>
          <div className='flex flex-wrap gap-1.5'>
            {(user.seeking || []).map((skill, index) => (
              <span key={index} className='px-2 py-1 text-[10px] rounded-md bg-blue-50 text-blue-600 border border-blue-100 font-bold'>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className='pt-2'>
        <Link href={`/findtalent/${user.slug}`}

          className={`w-full active:scale-95 duration-200 flex items-center gap-2 justify-center rounded py-2.5 text-xs md:text-sm font-bold transition-all shadow-sm 
            bg-blue-400 text-gray-50 border border-gray-200 cursor-default hover:bg-blue-500  `}
        >
          <BiUserCheck className='text-lg' /> View profile

        </Link>
      </div>
    </div>
  );
};

export default UserCard;
