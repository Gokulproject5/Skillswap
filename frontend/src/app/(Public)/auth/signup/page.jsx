"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { RiUser2Fill } from 'react-icons/ri';
import * as z from 'zod';
import { zodResolver} from "@hookform/resolvers/zod"


// schema validation 
 const schema =z.object( {
  fullname: z.string().min(3,"Name must be  at least 3 characters"),
  email:z.email({ pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i}),
  password:z.string().min(6,"Password must be at least 6 characters")
 });

const SignUpCard = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver:zodResolver(schema),
    });

    //  submit register form 
    const onSubmit = async (Formdata) => {

        const slugify = (text) => {
            return text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '')
                .replace(/--+/g, '-');
        };
        const slug = slugify(Formdata.fullname);
         const data = {...Formdata,slug}
         const api_base_url = process.env.NEXT_PUBLIC_API_BASE_URL
        try {
            const res = await fetch(`${api_base_url}/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include"
            });

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error("Register failed" + " " + errorData.message);

            }
            const result = await res.json()
            alert("Register SuccessFull")
            navigate.push(`/auth/setupprofile/${result.insertedId}`)
        } catch (err) {
            alert("Regisiter failed" + err)
        }


    }

    return (
        <>

            <div className='flex items-center justify-center min-h-screen  bg-gray-100 p-4'>
                <div className='max-w-5xl w-full bg-white grid grid-cols-1 md:grid-cols-2 rounded-xl shadow-2xl overflow-hidden'>

                    {/* LEFT COLUMN */}
                    <div className='hidden md:block relative w-full h-full overflow-hidden bg-linear-to-tr via-white to-black from-blue-600'>
                        <img
                            className='object-cover w-full h-full opacity-80'
                            src="/ilus.png"
                            alt="Welcome Illustration"
                        />

                        <div className='absolute inset-0 z-10 bg-linear-to-br from-blue-600/40 to-gray-900/80 flex flex-col justify-between p-12 text-center'>
                            <div className="pt-4">
                                <h3 className='text-white text-3xl font-extrabold tracking-tight'>Ready to Explore?</h3>
                                <p className='text-blue-100 mt-3 text-lg'>Join thousands of users managing their workflow effortlessly.</p>
                            </div>

                            <div className='flex flex-col items-center'>
                                <div className='w-20 h-20 bg-white rounded-full mb-6 overflow-hidden shadow-inner'>
                                    <img src="/logo2.png" className='w-full h-full object-cover p-2' alt="Logo" />
                                </div>
                                <p className='text-white/90 text-md italic max-w-xs leading-relaxed'>
                                    "This platform has completely transformed how our team handles daily operations."
                                </p>
                            </div>

                            <div className='pb-4'>

                                <p className='text-blue-200/60 text-xs mt-6'>© 2026 Skill Swap Pro. All rights reserved.</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (Form) */}
                    <div className='py-12 px-8  md:px-12 flex flex-col justify-center bg-white'>
                        <div className="mb-8">
                            <h2 className='text-3xl font-bold text-gray-800'>Create Account</h2>
                            <p className='text-gray-500 text-sm mt-2'>
                                Already have an account? <Link href={"/auth/login"} className='text-blue-600 cursor-pointer hover:underline font-medium'>Login</Link>
                            </p>
                        </div>

                        <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
                            {/* Full Name */}
                            <div className='flex flex-col space-y-1.5'>
                                <label className="text-sm font-semibold text-gray-700">Full Name <span className='text-red-500'>*</span></label>
                                <div className={`flex items-center group space-x-3 rounded border px-4 py-3 bg-gray-50 transition-all focus-within:bg-white focus-within:ring-2 ${errors.fullname ? "border-red-500 focus-within:ring-red-100" : "border-gray-200 focus-within:ring-blue-500/20"}`}>
                                    <RiUser2Fill className={`text-xl ${errors.fullname ? "text-red-500" : "text-gray-400"} group-focus-within:text-blue-600`} />
                                    <input
                                        type="text"
                                        {...register("fullname", {
                                            required: "Full Name is required",
                                            minLength: { value: 3, message: "Name is too short" }
                                        })}
                                        className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                {errors.fullname && <span className='text-red-500 text-xs font-medium'>{errors.fullname.message}</span>}
                            </div>

                            {/* Email Address */}
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
                                        placeholder="Enter Your Email"
                                    />
                                </div>
                                {errors.email && <span className='text-red-500 text-xs font-medium'>{errors.email.message}</span>}
                            </div>

                            {/* Password */}
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

                            <button className='w-full flex justify-center items-center text-white bg-blue-600 hover:bg-blue-700 py-3.5 rounded font-bold transition-all shadow-lg shadow-blue-200 active:scale-[0.98]'>
                                Sign Up

                            </button>

                            <div className="relative flex py-2 items-center">
                                <div className="grow border-t border-gray-100"></div>
                                <span className="shrink mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-wider">Or continue with</span>
                                <div className="grow border-t border-gray-100"></div>
                            </div>

                            <div className="grid  text-gray-500 gap-2">
                                <button type="button" className="flex group items-center justify-center py-2.5 border border-gray-200 rounded hover:bg-blue-500/80 hover:text-white transition-colors shadow-sm">
                                    <FaGoogle className="w-5 h-5 mr-2 " />
                                    <span className="text-sm font-semibold ">Google</span>
                                </button>
                                <button type="button" className="flex  items-center justify-center py-2.5 border border-gray-200 rounded group hover:bg-black hover:text-gray-50 transition-colors shadow-sm">
                                    <FaGithub className="w-5 h-5 mr-2 " />
                                    <span className="text-sm font-semibold">GitHub</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    );
};

export default SignUpCard;
