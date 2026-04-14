import { Wave } from '@/Component/Home/Wave'
import { HandshakeIcon, LucideUserRoundSearch, MessageSquare, Stars, UserPlus2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { BiVideo } from 'react-icons/bi'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { MdOutlineWorkOutline } from 'react-icons/md'



const Home = () => {
  const steps = [{
    icon: <UserPlus2 />,
    title: "Create profile",
    desc: "Highlight your skills and what you're eager to learn from others."
  },
  {
    icon: <FaMagnifyingGlass />,
    title: "Find Talent",
    desc: "Search our global directory for peers who match your learning goals."
  },
  {
    icon: <HandshakeIcon />,
    title: "Connect & Chat",
    desc: "Initiate a conversation and propose a mutually beneficial swap."
  },
  {
    icon: <Stars />,
    title: "Learn & Grow",
    desc: "Execute your swap session and accelerate your career trajectory.",
    active: true
  }
  ]


  return (
    <main className='min-h-screen bg-white'>

      {/* Hero Section */}
      <section className='max-w-7xl mx-auto my-5  grid grid-cols-1 md:grid-cols-2 gap-12 px-6 py-16  items-center overflow-hidden' id='hero_section'>
        {/* Left Side */}
        <div className='space-y-8 z-10'>
          <div className='text-6xl md:text-7xl  font-extrabold text-gray-900 leading-[1.1] tracking-tight'>
            <h1>Learn, Teach,</h1>
            <h1 className='text-blue-600'><span className='text-black'>and </span>Grow</h1>
            <h1 className='text-blue-600'>Together</h1>
          </div>

          <p className='text-gray-500 text-xl  max-w-lg leading-relaxed'>
            Connect with industry peers, exchange high-value skills, and unlock professional opportunities in a focused, distraction-free environment.
          </p>

          <div className='flex flex-wrap gap-4 pt-4'>
            <Link href="/auth/signup" className='bg-blue-600 rounded-xl py-4 px-10 text-white font-semibold shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all'>
              Start Swapping
            </Link>
            <Link href="" className='bg-gray-50 border border-gray-200 rounded-xl py-4 px-10 text-gray-700 font-semibold hover:bg-gray-100 transition-all'>
              Explore
            </Link>
          </div>

        </div>

        {/* Right side */}
        <div className='relative flex justify-center items-center lg:justify-end'>


          <div className='w-full max-w-125 lg:scale-125 transition-transform duration-700 ease-out'>
            <img
              src="/hero.png"
              className='w-full drag h-full object-contain'
              alt="Skill sharing illustration"
            />
          </div>
        </div>

      </section>

      {/* Tool for learing  */}
      <section id='learingTool'>
        <div className='pb-13 '>
          <Wave />
        </div>
        <div className='max-w-7xl mx-auto py-20 px-6  space-y-12'>
          <div className='space-y-4'>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 tracking-tight'>
              Precision Tools for Learning
            </h2>
            <p className='text-gray-600 text-lg max-w-2xl leading-relaxed'>
              Everything you need to facilitate high-impact knowledge exchange without the noise of traditional social platforms.
            </p>
          </div>

          {/* Highlight features  */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800'>

            {/* Skill Matching  */}
            <div className='md:col-span-2 bg-white shadow-xl p-8 rounded-xl border border-gray-100 transition-all group'>
              <div className=' w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                <LucideUserRoundSearch className='size-10 text-blue-600' />
              </div>
              <div className='space-y-4'>
                <h3 className='text-2xl font-bold'>Skill Matching</h3>
                <p className='text-gray-500 text-lg leading-relaxed'>
                  Our algorithmic engine identifies exactly who has what you need and who needs what you have, ensuring every connection is mutually beneficial.
                </p>
              </div>
              <div className='mt-8 flex flex-wrap gap-2'>
                {["React", "MySQL", "UI/UX", "Node.js"].map((item, index) => (
                  <span key={index} className='text-sm font-semibold bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 border border-blue-100'>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Video Call */}
            <div className='bg-blue-600 p-8 rounded-xl text-white shadow-xl  hover:-translate-y-1 transition-all flex flex-col '>
              <div className=' w-14 h-14  flex items-center justify-center'>
                <BiVideo className='size-10' />
              </div>
              <div className='mt-8 space-y-3'>
                <h3 className='text-2xl font-bold'>Video Call</h3>
                <p className='text-blue-50 opacity-90'>
                  High-definition interactive sessions with built-in screen sharing and whiteboarding.
                </p>
              </div>
            </div>

            {/* Real time chat */}
            <div className='bg-white p-8 rounded-xl shadow-xl border  border-gray-100  transition-all'>
              <div className='text-blue-600 mb-6'>
                <MessageSquare className='size-10' />
              </div>
              <div className='space-y-3'>
                <h3 className='text-2xl font-bold'>Real-Time Chat</h3>
                <p className='text-gray-500'>
                  Lightning-fast messaging to coordinate schedules and share resources instantly.
                </p>
              </div>
            </div>

            {/* Verified Jobs  */}
            <div className='md:col-span-2 p-8 rounded-xl shadow-xl border border-gray-100  transition-all flex flex-col md:flex-row items-start md:items-center gap-8'>
              <div className=' w-20 h-20 rounded-3xl flex items-center justify-center shrink-0'>
                <MdOutlineWorkOutline className="size-10" />
              </div>
              <div className='space-y-2'>
                <h3 className='text-2xl font-bold text-gray-900'>Verified Jobs</h3>
                <p className='text-gray-500 text-lg'>
                  Access a private board of job opportunities exclusively shared within the network by verified companies looking for your specific swapped skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mastery your path */}
      <section className=' -my-2 shadow-inner shadow-gray-100 text-gray-800'>
        {/* wave  */}
        <div className='pb-13'>
          <Wave />
        </div>
        <div className='py-20 px-6 md:px-20'>
          {/* title  */}
          <div className='text-center space-y-2'>
            <div className='text-4xl font-semibold '>
              <h1>Your Path to Mastery</h1>
            </div>
            <div className='text-gray-600'>
              <p>Getting started is simple. We've removed the friction so you can focus on what matters: the exchange of ideas.</p>
            </div>

          </div>

          {/* Steps Section */}
          <div className="py-24 bg-white px-6 md:px-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">

                {/* Connecting Line */}
                <div className="hidden md:block absolute top-10 left-10 right-10 h-0.5 bg-linear-to-r from-blue-500 via-white to-blue-600 z-0" />

                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center text-center space-y-6 relative z-10">

                    {/* Icon */}
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 border-white shadow-xl transition-all duration-300 size-7  ${step.active
                      ? 'bg-blue-600 scale-110 shadow-lg text-white shadow-blue-200'
                      : 'bg-white hover:border-blue-100 text-blue-600'
                      }`}>
                   
                      {step.icon }
                    </div>

                    {/* Text Content */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed max-w-50 mx-auto">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA  */}
      <section className=' '>

        <div className='pb-12 opacity-50'>
          <Wave />
        </div>

        <div className='max-w-5xl mx-auto py-24 px-6 md:px-20'>
          <div className='bg-blue-600 text-white rounded-[3rem] p-12 md:p-20 flex flex-col items-center text-center space-y-10 shadow-2xl shadow-blue-200 relative overflow-hidden'>

            
            <div className='absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full opacity-50 blur-3xl'></div>

            <div className='relative z-10 space-y-6'>
              <h2 className='text-4xl md:text-6xl font-bold max-w-3xl leading-tight'>
                Start your skill exchange journey today
              </h2>
              <p className='text-blue-100 text-lg md:text-xl max-w-2xl mx-auto'>
                Join a global community of experts and learners dedicated to mutual professional growth.
              </p>
            </div>

            <div className='relative z-10'>
              <Link
                href="/auth/signup"
                className='inline-block text-lg font-bold py-5 px-12 bg-white text-blue-600 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-300'
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>

     
    </main>
  )
}

export default Home
