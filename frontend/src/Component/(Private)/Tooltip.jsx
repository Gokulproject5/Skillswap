import React from 'react'

const Tooltip = ({ title, style }) => {
    return (
        <>
            <span className={`hidden lg:block absolute ${style} z-50 w-fit px-2.5 py-1.5 bg-blue-600/80 backdrop-blur-sm text-white text-[10px] font-bold  uppercase tracking-wider rounded-lg opacity-0 group-hover:opacity-100 transition-all delay-200 duration-300 pointer-events-none whitespace-nowrap border border-white/20 shadow-xl shadow-blue-500/20`}>
                {title}
            </span>
        </>
    )
}

export default Tooltip
