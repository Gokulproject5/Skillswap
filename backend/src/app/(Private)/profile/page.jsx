"use client"
import React from 'react';
import {
  Edit3,
  Zap, Code, Database,
  CheckCircle2,
} from "lucide-react"
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

const Profile = () => {

  const user = useSelector((state) => state.loginData.currentUser)

  const { handleSubmit, register, formState: {
    errors, isSubmitting
  } } = useForm();
  const formatItems = (data) => {
    if (!data) return [];
    return Array.isArray(data) ? data : data.split(',').map(s => s.trim());
  };

  return (
    <div className="min-h-screen my-22 bg-[#F3F2EF] py-8 px-4  text-[#1d1d1d] antialiased">
      <div className="max-w-6xl mx-auto grid grid-cols-1 ">

        {/* Main Section */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-white rounded-2xl border border-[#e0e0e0] overflow-hidden shadow-sm">
            <div className="relative h-48 bg-radial-[at_top] from-blue-600 to-black">

              <button className="absolute top-4 right-4 p-2 bg-white rounded-full text-[#0a66c2] shadow-md hover:bg-slate-50 transition-colors">
                <Edit3 size={18} />
              </button>
            </div>

            {/* edit dialog box */}
            <dialog  className='w-[95%] md:w-full mx-auto my-auto max-w-2xl rounded-2xl p-0 overflow-hidden shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm outline-none h-100 '>

              <div className='flex items-center   px-6 md:px-8 py-5 border-b border-gray-100 bg-white' >
                <div className='text-gray-700 font-semibold'>
                  <h1>Profile Update</h1>
                </div>
              </div>

              <form className='p-6 md:p-8 bg-white text-gray-800 max-h-[80vh] overflow-y-auto' onSubmit={handleSubmit()} action="">
               <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex flex-col space-y-1.5'>
                  <label className='uppercase text-[14px] font-bold ' htmlFor="">Full Name</label>
                  <input {...register ("name", {required: "Required"})}
                  placeholder='Enter a full name'
                  className='outline-none shadow-inner p-2 ring-gray-100 rounded-md focus:ring-blue-500 ring-2  ' />
                </div>

                  <div className='flex flex-col space-y-1.5'>
                  <label className='uppercase text-[14px] font-bold ' htmlFor=""> Age</label>
                  <input type='number'  {...register ("name",{required: "Required" ,min:{value:18 , message:"Age must be at least 18"},
                  minLength:{
                    value:18 
                  },
                  maxLength:{
                    value:40
                  },
                  max:{value:40 ,message:"Age must be under 40"},
                valueAsNumber:true })}
                  placeholder='Enter your Age'
                  className='outline-none shadow-inner p-2 ring-gray-100 rounded-md focus:ring-blue-500 ring-2  ' />
                </div>
               </div>

              </form>

            </dialog>
            <div className="px-6 pb-6">
              <div className="flex justify-between items-start">
                <div className="relative -mt-24 mb-4">
                  <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden bg-white shadow-sm">
                    <img
                      src={user?.profile_pic || "/logo.png"}
                      alt={user?.name || "user"}
                      className="w-full h-full drag object-cover"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="px-4 py-1.5 bg-[#0a66c2] text-white rounded-full font-bold text-sm hover:bg-[#004182]">
                    Open to Swap
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-1">
                    <h1 className="text-2xl font-semibold">{user?.name || "User Name"}</h1>
                    <span className="text-slate-500 text-sm font-normal ml-1">• 1st</span>
                  </div>
                  <p className="text-base text-slate-700 leading-tight mt-1">{user?.exp || ""}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
                    <span>{user?.loc}</span>
                    <span className="text-[#0a66c2] font-semibold cursor-pointer">Contact info</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-2xl border border-[#e0e0e0] p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">About</h2>
            <p className="text-sm text-slate-700 leading-normal">{user?.about || ""}</p>
          </div>

          {/* Expertise */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <LinkedInSkill title="Skills I'm Offering" items={formatItems(user?.skills)} active />
            <LinkedInSkill title="Skills I'm Learning" items={formatItems(user?.seeking)} />
          </div>

          {/* Sidebar Area */}
          <div className="space-y-3 ">
            <div className="bg-white rounded-2xl border border-[#e0e0e0] p-4 shadow-sm  w-full ">
              <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-tighter">Skill Verification</h3>
              <div className="space-y-4">
                {/* Logic check to ensure verification array exists before accessing indices */}
                {user?.verify && user.verify.length > 0 ? (
                  <>
                    <VerifyRow icon={<Zap size={16} />} label={user.verify[0] || ""} done />
                    <VerifyRow icon={<Code size={16} />} label={user.verify[1] || ""} />
                    <VerifyRow icon={<Database size={16} />} label={user.verify[2] || ""} done />
                  </>
                ) : (
                  <p className="text-xs text-slate-400">No verifications available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LinkedInSkill = ({ title, items, active }) => (
  <div className="bg-white rounded-2xl border border-[#e0e0e0] p-6 shadow-sm">
    <h3 className="text-base font-semibold mb-4">{title}</h3>
    <div className="space-y-3">
      {items && items.length > 0 ? (
        items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 border-b border-slate-50 pb-2 last:border-0">
            <CheckCircle2 size={16} className={active ? "text-emerald-600" : "text-slate-300"} />
            <span className="text-sm font-semibold text-slate-700">{item}</span>
          </div>
        ))
      ) : (
        <p className="text-xs text-slate-400 italic">No items listed</p>
      )}
    </div>
  </div>
);

const VerifyRow = ({ icon, label, done }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${done ? 'bg-blue-50 text-[#0a66c2]' : 'bg-slate-50 text-slate-400'}`}>
        {icon}
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </div>
    {done && <CheckCircle2 size={16} className="text-[#0a66c2]" />}
  </div>
);

export default Profile;
