"use client"
import toast from 'react-hot-toast';
import { AuthContext, useAuth } from '@/Context/authContext';
import { setuser } from '@/feature/loginSlice';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';


const LoginCard = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const res = await fetch(`${apiBaseUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
                credentials: "include"
            });

            const result = await res.json();



            if (!res.ok) {
                toast.error(result.message || "Invalid credentials");
                setIsSubmitting(false);
                return;
            }
            if (res.ok) {
                await login();
            }


        } catch (error) {
            console.error("Login Error:", error);
            toast.error("Something went wrong");
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className='flex justify-center my-5  bg-gray-100 p-4'>

                <div className='max-w-4xl w-full bg-white grid grid-cols-1 md:grid-cols-2 rounded-xl shadow-2xl overflow-hidden'>
                    {/* LEFT */}
                    <div className='py-12 px-8 md:px-12 flex flex-col justify-center'>
                        <div className="mb-8">
                            <h2 className='text-3xl font-bold text-gray-800'>Welcome Back</h2>
                            <p className='text-gray-500 text-sm mt-2'>
                                New here? <Link href={"/auth/signup"} className='text-blue-600 cursor-pointer hover:underline font-medium'>Create an account</Link>
                            </p>
                        </div>

                        <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
                            {/* Email Field */}
                            <div className='flex flex-col space-y-1.5'>
                                <label className="text-sm font-semibold text-gray-700">Email Address <span className='text-red-500'>*</span></label>
                                <div className={`flex items-center group space-x-3 rounded border px-4 py-3 bg-gray-50 transition-all focus-within:bg-white focus-within:ring-2 ${errors.email ? "border-red-500 focus-within:ring-red-100" : "border-gray-200 focus-within:ring-blue-500/20"}`}>
                                    <MdEmail className={`text-xl ${errors.email ? "text-red-500" : "text-gray-400"} group-focus-within:text-blue-600`} />
                                    <input
                                        type="email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                                        })}
                                        className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                                        placeholder="Enter your Email"
                                    />
                                </div>
                                {errors.email && <span className='text-red-500 text-xs font-medium'>{errors.email.message}</span>}
                            </div>

                            {/* Password Field */}
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
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                        {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                    </button>
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    {errors.password ? <span className='text-red-500 text-xs font-medium'>{errors.password.message}</span> : <div></div>}
                                    <span className='text-blue-600 text-xs hover:underline cursor-pointer font-semibold'>Forgot password?</span>
                                </div>
                            </div>

                            <button
                                disabled={isSubmitting}
                                className='w-full flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 py-3.5 rounded font-bold transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed'
                            >
                                {isSubmitting ? "Signing in..." : "Sign In"}

                            </button>


                            <div className="relative flex py-4 items-center">
                                <div className="grow border-t border-gray-100"></div>
                                <span className="shrink mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-wider">Or continue with</span>
                                <div className="grow border-t border-gray-100"></div>
                            </div>


                            <div className="grid grid-cols-2 text-gray-600 gap-4">
                                <button type="button" className="flex space-x-2 items-center justify-center py-2.5 border-2 border-gray-300 group rounded hover:text-white hover:bg-blue-500 transition-colors shadow-sm">
                                    <FaGoogle />
                                    <span className='font-bold'>Google</span>

                                </button>
                                <button type="button" className="flex items-center justify-center py-2.5 border-2 border-gray-300 space-x-2 rounded group hover:text-gray-50 hover:bg-black transition-colors shadow-sm">
                                    <FaGithub />
                                    <span className='font-bold'>GitHub</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT  */}
                    <div className='hidden md:block relative w-full h-full overflow-hidden bg-blue-600'>

                        <Image
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className='object-cover drag opacity-80'
                            src="/ilus.png"
                            alt="Welcome Illustration"
                        />

                        {/* Styled Overlay */}
                        <div className='absolute inset-0 z-10 bg-linear-to-br from-blue-600/40 to-gray-900/80 flex flex-col justify-between p-12 text-center'>
                            <div className="pt-4">
                                <h3 className='text-white text-3xl font-extrabold tracking-tight'>Ready to Explore?</h3>
                                <p className='text-blue-100 mt-3 text-lg'>Join thousands of users managing their workflow effortlessly.</p>
                            </div>

                            <div className='flex flex-col items-center'>
                                <div className='w-20 h-20 bg-white rounded-full mb-6 relative overflow-hidden'>
                                    <Image src="/logo2.png" fill sizes="80px" className='object-cover' alt="Logo" />
                                </div>
                                <p className='text-white/90 text-md italic max-w-xs leading-relaxed'>
                                    "This platform has completely transformed how our team handles daily operations."
                                </p>
                            </div>

                            <div className='pb-4'>

                                <p className='text-blue-200/60 text-xs mt-6'>© 2026 Skill Swap Pro . All rights reserved.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </>
    );
};

export default LoginCard;
