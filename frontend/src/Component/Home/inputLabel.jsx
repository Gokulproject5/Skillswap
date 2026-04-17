import React from 'react'

const inputLabel = ({
    label, password, onClick, showPassword, setShowPassword, placeholder, type, icon
}) => {
    return (
        <>
            <div className='flex flex-col space-y-1.5'>
                <label className="text-sm font-semibold text-gray-700">Password <span className='text-red-500'>*</span></label>
                <div className={`flex items-center group space-x-3 rounded px-4 py-3 bg-gray-50 border transition-all focus-within:bg-white focus-within:ring-2 ${errors.password ? "border-red-500 focus-within:ring-red-100" : "border-gray-200 focus-within:ring-blue-500/20"}`}>
                    <MdLock className={`text-xl ${errors.password ? "text-red-500" : "text-gray-400"} group-focus-within:text-blue-600`} />
                    <input
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 8, message: "Minimum 8 characters" }
                        })}
                        placeholder="••••••••"
                        className="w-full bg-transparent outline-none text-gray-700"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                        {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </button>
                </div>
                {errors.password && <span className='text-red-500 text-xs font-medium mt-1'>{errors.password.message}</span>}
            </div>
        </>
    )
}

export default inputLabel