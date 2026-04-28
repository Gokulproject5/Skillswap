"use client"
import SkillSelector from '@/Component/(Private)/FormComponent/SkillSelect'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

const SetupProfile = ({ value }) => {
    const route = useRouter();
    const param = useParams();
    const [offering, setOffering,] = useState([]);
    const [learning, setLearning] = useState([]);



    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            exp: '',
            loc: '',
            about: '',
            skills: offering,
            seeking: learning,
            proofLink: ''
        }
    });


    const onSubmit = async (datas) => {

        const data = { ...datas, skills: offering, seeking: learning }

        try {
            const id = param.id;

            const response = await fetch(`/api/user/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(data),
                credentials: "include"
            });

            const result = await response.json();


            if (!response.ok) {
                toast.error(result.message || "Update failed");
                return;
            }

            toast.success("Profile update successful!");
            route.push("/findtalent");

        } catch (err) {
            console.error(err);
            toast.error("Internal server error");
        }
    };



    return (
        <section className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
            <div className='bg-white w-full max-w-6xl shadow-xl rounded-3xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[85vh]'>

                {/* Left Side */}
                <div className='hidden md:flex md:w-1/2 bg-blue-500/70 flex-col px-12 py-8 relative'>
                    <Link href='/auth/signup' className='absolute top-8 left-8 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow'>
                        <ArrowLeft className="text-gray-600" />
                    </Link>
                    <div className='px-10'>
                        <h1 className='text-3xl font-bold text-white'>Skill Swap Pro</h1>
                        <p className='text-gray-900 mt-2'>Connect, Learn, and Grow.</p>
                    </div>
                    <div className='relative flex-1 w-full mt-8'>
                        <Image src='/setup_page.svg' alt='Setup' fill className='object-contain' priority />
                    </div>
                </div>



                {/* Right Side  */}
                <form onSubmit={handleSubmit(onSubmit)} className='w-full md:w-1/2 flex flex-col p-8 md:px-16 md:py-8 overflow-y-auto'>
                    <div className='mb-8'>
                        <h2 className='text-3xl font-bold text-gray-900'>Complete Your Profile</h2>
                        <p className='text-gray-500 mt-1'>Tell us a bit about yourself.</p>
                    </div>

                    <div className='space-y-5'>
                        {/* Work & Location */}
                        <div>
                            <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>Work/Study</label>
                            <input
                                {...register("exp", { required: "Work or Study is required" })}
                                placeholder="Company or University"
                                className='w-full px-4 py-2.5 rounded shadow-inner border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 transition-all'
                            />
                            {errors.exp && <span className='text-xs text-red-400'>{errors.exp.message}</span>}
                        </div>

                        <div>
                            <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>Location</label>
                            <input
                                {...register("loc", { required: "Location Required" })}
                                placeholder="City, Country"
                                className='w-full px-4 py-2.5 rounded shadow-inner border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 transition-all'
                            />
                            {errors.loc && <span className='text-xs text-red-400'>{errors.loc.message}</span>}
                        </div>

                        {/* About */}
                        <div>
                            <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>About You</label>
                            <textarea
                                {...register("about", { required: "Please tell us a bit about yourself" })}
                                rows={3}
                                placeholder="Briefly describe your passion..."
                                className='w-full px-4 py-2.5 rounded shadow-inner border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 transition-all resize-none'
                            />
                            {errors.about && <span className='text-xs  text-red-400'>{errors.about.message}</span>}
                        </div>

                        {/* Skills Mastered */}
                        <div>

                            <SkillSelector
                                label="Skills You Master"
                                color="purple"
                                placeholder={"search the skill"}
                                selectedSkills={offering}
                                onAdd={(s) => setOffering([...offering, s])}
                                onRemove={(s) => setOffering(offering.filter(i => i !== s))}
                            />

                        </div>


                        {/* Skills to Learn */}
                        <div>
                            <SkillSelector
                                label="Skills You Want to Learn"
                                color="blue"
                                placeholder={"search the skill"}
                                selectedSkills={learning}
                                onAdd={(s) => setLearning([...learning, s])}
                                onRemove={(s) => setLearning(learning.filter(i => i !== s))}
                            />
                        </div>
                        <div>
                            <label className='block text-xs font-bold uppercase text-gray-500 mb-1'>Portfolio / Proof Link</label>
                            <input
                                {...register("proofLink", {
                                    required: "Proof link required",
                                    pattern: { value: /^https?:\/\/.+/, message: "Invalid URL (must start with http/https)" }
                                })}
                                placeholder='https://'
                                className='w-full px-4 py-2.5 rounded shadow-inner border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 transition-all'
                            />
                            {errors.proofLink && <span className='text-xs text-red-400'>{errors.proofLink.message}</span>}
                        </div>

                        <button type="submit" className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-[0.98] mt-2'>
                            Save Profile
                        </button>
                    </div>
                </form>

            </div>
        </section>
    );
};

export default SetupProfile;
