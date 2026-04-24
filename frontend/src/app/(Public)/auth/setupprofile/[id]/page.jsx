"use client"
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

const SetupProfile = () => {
    const route = useRouter();
    const param = useParams();

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            exp: '',
            loc: '',
            about: '',
            skills: [],
            seeking: [],
            proofLink: ''
        }
    });

    const availableSkills = ["React", "UI Design", "Python", "JavaScript", "Figma", "Node.js", "AI/ML", "SQL"];

  const onSubmit = async (data) => {
    const api_base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
    
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



    const handleSkillToggle = (skill, currentArray, onChange) => {
        const updated = currentArray.includes(skill)
            ? currentArray.filter(s => s !== skill)
            : [...currentArray, skill];
        onChange(updated);
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
                            {errors.about && <span className='text-xs text-red-400'>{errors.about.message}</span>}
                        </div>

                        {/* Skills Mastered */}
                        <div>
                            <label className='block text-xs font-bold uppercase text-gray-500 mb-2'>Skills You Master</label>
                            <Controller
                                control={control}
                                name="skills"
                                render={({ field: { value, onChange }  }) => (
                                    <div className='flex flex-wrap gap-2'>
                                        {availableSkills.map((skill) => (
                                            <button key={skill} type='button' onClick={() => handleSkillToggle(skill, value, onChange)}
                                                className={`py-1.5 px-3 rounded-full text-xs font-medium border transition-all ${value.includes(skill) ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"}`}>
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            />
                        </div>

                        {/* Skills to Learn */}
                        <div>
                            <label className='block text-xs font-bold uppercase text-gray-500 mb-2'>Skills You Want to Learn</label>
                            <Controller
                                control={control}
                                name="seeking"
                                render={({ field: { value, onChange } }) => (
                                    <div className='flex flex-wrap gap-2'>
                                        {availableSkills.map((skill) => (
                                            <button key={skill} type='button' onClick={() => handleSkillToggle(skill, value, onChange)}
                                                className={`py-1.5 px-3 rounded-full text-xs font-medium border transition-all ${value.includes(skill) ? "bg-green-600 border-green-600 text-white shadow-md" : "bg-white border-gray-200 text-gray-600 hover:border-green-300"}`}>
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                )}
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
