import Footer from '@/Component/(Private)/Footer'
import Header from '@/Component/Home/Header'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <Header />
      <div className='min-h-screen bg-white  '>
        <div className='w-full flex-col flex  items-center'>
         
          <div className=' justify-center relative flex items-center w-200 h-100'>
            <Image src={"/404.gif"} alt='404-Not-found' fill sizes='0' />
            
          </div>
           <Link href={"/dashboard"} className='hover:underline text-center text-md text-blue-600'>Go back </Link>

        </div>
      </div>
      <Footer />
    </>
  )
}
