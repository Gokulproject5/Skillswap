import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

 const page = () => {
  return (
    <section className='bg-white min-h-screen   h-full'>

        <div className='flex justify-center text-gray-700 h-100  text-2xl space-x-3 py-10'>
            

                <div className='w-200 h-200 relative'>
                  <Image src={"/401.gif"} fill sizes='80' alt='401' />
                </div>
                 <div className='absolute  flex my-auto space-x-3'>
                <h1>You cant access this Page</h1>
               <Link href="/dashboard" className='text-blue-500 hover:underline'>Go Back</Link>
             </div>
        </div>
    </section>
  )
}

export default page;