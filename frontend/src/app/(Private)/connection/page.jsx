import React from 'react'
import Connection, { Count } from './connection'

const Page = () => {
    return (
        <main className='md:my-20 my-10 animate-page-entry transition-all duration-300 bg-gray-100 text-gray-600 min-h-screen w-full lg:px-32 py-10'>
            <div className='max-w-6xl mx-auto px-6'>
                {/* Header Section */}
                <div className='flex items-center justify-between'>
                    <div className='mb-8'>
                        <h1 className='text-3xl font-extrabold text-blue-600 tracking-tight'>
                            Connections
                        </h1>
                        <p className='text-sm text-gray-400 mt-1'>
                            Manage and view your professional network
                        </p>
                    </div>
                    <div>
                        <Count />
                    </div>
                </div>
                {/* Connections List Section */}
                <section className='rounded-xl   overflow-hidden'>
                    <div className='max-h-150 overflow-y-auto custom-scrollbar'>
                        <Connection />
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Page
