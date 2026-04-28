"use client"
import React, { useState } from 'react';
import {
  Edit3,
  Zap, Code, Database,
  CheckCircle2,
  Verified,
} from "lucide-react"
import ProfileUpdate from '@/Component/(Private)/DialogForm';
import { useAuth } from '@/Context/authContext';
import toast from 'react-hot-toast';



const Profile = () => {
  const { user } = useAuth();
  const [offering, setOffering] = useState(user?.skills);
  const [learning, setLearning] = useState(user?.seeking);
  const [isOpen, setIsOpen] = useState(false);


  const formatItems = (data) => {
    if (!data) return [];
    return Array.isArray(data) ? data : data.split(',').map(s => s.trim());
  };

  const handleModal =async () => {
    setIsOpen(!isOpen)
  }


  const onSubmit = async (data) => {

    const finalProfile = { ...data, skills: offering, seeking: learning };

    try {
      const response = await fetch(`/api/user/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalProfile),
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const res = await response.json();
      toast.success("Profile Updated Successfully!");
      handleModal();

    } catch (error) {
      console.error("Update error:", error);
      toast.error(`Failed to update: ${error.message}`);
    }
  };



  const data = {
    isOpen,
    handleModal,
    onSubmit,
    userDatas: user,
    offering,
    setOffering,
    learning,
    setLearning
  }

  return (
    <div className="min-h-screen my-22 bg-[#F3F2EF] py-8 px-4  text-[#1d1d1d] antialiased">
      < ProfileUpdate value={data} />
      <div className="max-w-6xl mx-auto grid grid-cols-1 ">
        {/* Main Section */}
        <div className="lg:col-span-3 space-y-3">

          <div className="bg-white rounded-2xl border border-[#e0e0e0] overflow-hidden shadow-sm">
            <div className="relative h-48 bg-radial-[at_top] group from-blue-600 to-black">

              <button onClick={handleModal} className="absolute flex items-center justify-center hover:shadow-xl hover:shadow-black/50 hover:scale-105  hover:border-2 border-blue-700 top-4 right-4 p-2  rounded-full text-white shadow-md  transition-all">

                <Edit3 size={18} />
              </button>
            </div>


            <div className="px-6 pb-6">
              <div className="flex justify-between items-start">
                <div className="relative -mt-24 mb-4">
                  <div className="w-40 h-40 capitalize rounded-full border-4 border-white overflow-hidden bg-white shadow-sm">
                    <img
                      src={user?.profile_pic || "/fallback.jpg"}
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

                    <span className=" text-sm font-normal text-blue-600 animate-pulse ml-1"> <Verified /></span>

                  </div>
                  <p className="text-base text-slate-700 leading-tight mt-1">{user?.exp || ""}</p>
                  <div className="mt-2 flex capitalize flex-wrap gap-2 text-sm text-slate-500">
                    <span>{user?.loc}</span>

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
