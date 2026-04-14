import React from 'react'
import { PiWarningCircle } from 'react-icons/pi'

const Toast = ({...props}) => {
  return (
  
        <div className='alert bg-white absolute transition-all   right-1 flex items-center py-3 px-5 shadow-2xl  rounded-xl'>
        <div className='flex text-xl items-center space-x-5'>
              <PiWarningCircle />
              <p>Login Failed</p>
        </div>
        </div>
    
  )
}

export default Toast