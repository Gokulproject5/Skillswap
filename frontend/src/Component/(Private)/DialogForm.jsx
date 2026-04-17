"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "./FormComponent/modal";
import SkillSelector from "./FormComponent/SkillSelect";
import { CldUploadWidget, CldImage } from 'next-cloudinary';
import { Pencil } from "lucide-react";

const ProfileUpdate = ({ value }) => {
    const { isOpen, handleModal, onSubmit, userDatas, offering, setOffering, setLearning, learning } = value;

    const [preview, setPreview] = useState(userDatas?.profile_pic || "");


    const { register, handleSubmit, setValue, formState: { errors } } = useForm();


    const handleUploadSuccess = (result) => {
        const url = result?.info?.secure_url || userDatas.profile_pic;
        if (url) {
            setPreview(url);
            setValue("profile_pic", url);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleModal} title="Update Profile">
            <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>

                <div className="grid grid-cols-1 gap-6">
                    {/* Image Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="rounded-full  group  relative w-24 h-24 overflow-hidden ring-4 ring-gray-50 shadow-md">
                            {preview ? (
                                <CldImage
                                    config={{ cloud: { cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME } }}
                                    src={preview}
                                    alt="Profile"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-all"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                    No Image
                                </div>
                            )}
                        </div>

                        <CldUploadWidget

                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                            onSuccess={handleUploadSuccess}
                            options={{ maxFiles: 1, resourceType: "image", clientAllowedFormats: ["jpg", "png", "jpeg"] }}
                        >
                            {({ open }) => (
                                <button
                                    type="button"
                                    onClick={() => open()}
                                    className="text-blue-600 flex gap-1 font-bold text-sm hover:underline"
                                >
                                   <Pencil className="size-4"/> Change Profile Image 
                                </button>
                            )}
                        </CldUploadWidget>


                        <input type="hidden" {...register("profile_pic")} />
                    </div>

                    <div className='grid grid-cols-1 w-full gap-6'>
                        {/* Full Name */}
                        <div className='flex flex-col space-y-1.5'>
                            <label className='uppercase text-[12px] font-bold text-gray-500'>Full Name</label>
                            <input defaultValue={userDatas?.name} {...register("name", { required: "Name is required" })}
                                className={`outline-none shadow-sm p-3 rounded-md ring-2 transition-all ${errors.name ? 'ring-red-500' : 'ring-gray-100 focus:ring-blue-500'}`} />
                            {errors.name && <span className='text-xs text-red-400'>{errors.name.message}</span>}
                        </div>

                        {/* Age */}
                        <div className='flex flex-col space-y-1.5'>
                            <label className='uppercase text-[12px] font-bold text-gray-500'>Age</label>
                            <input defaultValue={userDatas?.age} type='number' {...register("age", { required: "Required", min: 18, max: 60 })}
                                className='outline-none shadow-sm p-3 ring-gray-100 rounded-md focus:ring-blue-500 ring-2' />
                            {errors.age && <span className='text-xs text-red-400'>Age must be 18-60</span>}
                        </div>

                        {/* Headline */}
                        <div className='flex flex-col space-y-1.5'>
                            <label className='uppercase text-[12px] font-bold text-gray-500'>Headline</label>
                            <input defaultValue={userDatas?.exp} {...register("exp")} placeholder="e.g. Junior Full Stack Developer"
                                className='outline-none shadow-sm p-3 ring-gray-100 rounded-md focus:ring-blue-500 ring-2' />
                        </div>

                        {/* About */}
                        <div className='flex flex-col space-y-1.5'>
                            <label className='uppercase text-[12px] font-bold text-gray-500'>About</label>
                            <textarea defaultValue={userDatas?.about} {...register("about")} rows="3"
                                className='outline-none shadow-sm p-3 ring-gray-100 rounded-md focus:ring-blue-500 ring-2' />
                        </div>
                    </div>
                </div>

                {/* Skill Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <SkillSelector
                        label="Skills I'm Offering"
                        color="green"
                        placeholder={"search the skill"}
                        selectedSkills={offering}
                        onAdd={(s) => setOffering([...offering, s])}
                        onRemove={(s) => setOffering(offering.filter(i => i !== s))}
                    />
                    <SkillSelector
                        label="Skills I'm Learning"
                        color="blue"
                        placeholder={"search the skill"}
                        selectedSkills={learning}
                        onAdd={(s) => setLearning([...learning, s])}
                        onRemove={(s) => setLearning(learning.filter(i => i !== s))}
                    />
                </div>

                <div className="mt-10 flex justify-end space-x-3">
                    <button onClick={handleModal} type="button" className="px-6 py-2 text-gray-500">Cancel</button>
                    <button type="submit" className="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold">Save Changes</button>
                </div>
            </form>
        </Modal>
    );
};

export default ProfileUpdate;
