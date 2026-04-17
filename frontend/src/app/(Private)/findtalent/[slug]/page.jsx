"use client";
import React from "react";
import {
  Zap,
  Code,
  Database,
  CheckCircle2,
  ArrowBigLeft,
  ArrowBigLeftIcon,
  ArrowLeft,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";


const Profile = () => {
  const { slug } = useParams();

  // Fetch data from Redux store
  const userList = useSelector((state) => state.userDatas.value);

  // Get specific user data by slug
  const userdata = userList?.find((user) => user.slug === slug);


  // Loading state if data isn't found yet
  if (!userdata) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F2EF]">
        <div className="text-2xl font-semibold text-slate-500 flex items-center gap-4">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="animate-pulse">Loading Profile...</span>
        </div>
      </div>
    );
  }

  const verifyIcons = [
    <Zap size={16} />,
    <Code size={16} />,
    <Database size={16} />,
  ];

  return (
    <div className="min-h-screen mt-20 relative bg-[#F3F2EF] py-8 px-4 text-[#1d1d1d] antialiased">
      <div className="max-w-6xl  mx-auto grid grid-cols-1">
        <div className="lg:col-span-3  space-y-3">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-[#e0e0e0] overflow-hidden shadow-sm">
            <div className="relative w-full h-48 bg-gradient-to-tr from-blue-400 via-blue-800 to-black"></div>

            <div className="px-6 pb-6">
              <div className="flex justify-between items-start">
                <div className="relative -mt-24 mb-4">
                  <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden bg-white shadow-sm">
                    <img
                      src={userdata.profile_pic || "/api/placeholder/160/160"}
                      alt={userdata.name}
                      className="w-full h-full object-cover"
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
                  <h1 className="text-2xl font-semibold">{userdata.name}</h1>
                  <p className="text-base text-slate-700 leading-tight mt-1">
                    {userdata.exp}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
                    <span>{userdata.loc}</span>
                    <span className="text-[#0a66c2] font-semibold cursor-pointer">
                      Contact info
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-2xl border border-[#e0e0e0] p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {userdata.about}
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <LinkedInSkill
              title="Skills I'm Offering"
              items={userdata.skills}
              active
            />
            <LinkedInSkill
              title="Skills I'm Learning"
              items={userdata.seeking}
            />
          </div>

          {/* Verified Skills Section */}
          <div className="bg-white rounded-2xl border border-[#e0e0e0] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">
              Skill Verification
            </h3>
            <div className="space-y-4">
              {userdata.verify?.length > 0 ? (
                userdata.verify.map((label, index) => (
                  <VerifyRow
                    key={index}
                    icon={verifyIcons[index % verifyIcons.length]}
                    label={label}
                    done={true}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-400 italic">
                  No verified skills yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for Skill Lists
const LinkedInSkill = ({ title, items, active }) => (
  <div className="bg-white rounded-2xl border border-[#e0e0e0] p-6 shadow-sm">
    <h3 className="text-base font-semibold mb-4">{title}</h3>
    <div className="space-y-3">
      {items?.length > 0 ? (
        items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 border-b border-slate-50 pb-2 last:border-0"
          >
            <CheckCircle2
              size={16}
              className={active ? "text-emerald-600" : "text-slate-300"}
            />
            <span className="text-sm font-semibold text-slate-700">{item}</span>
          </div>
        ))
      ) : (
        <p className="text-xs text-slate-400">None listed</p>
      )}
    </div>
  </div>
);

// Sub-component for Verification Rows
const VerifyRow = ({ icon, label, done }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-lg ${done ? "bg-blue-50 text-[#0a66c2]" : "bg-slate-50 text-slate-400"}`}
      >
        {icon}
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </div>
    {done && <CheckCircle2 size={16} className="text-[#0a66c2]" />}
  </div>
);

export default Profile;
