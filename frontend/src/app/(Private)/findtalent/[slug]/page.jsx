"use client";
import React, { useState } from "react";
import { Zap, Code, Database, CheckCircle2, Flag } from "lucide-react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useAuth } from "@/Context/authContext";
import { ProposalModal } from "@/Component/(Private)/modal/ProposalModal";
import { ReportModal } from "@/Component/(Private)/modal/ReportModal";





const Profile = () => {
  const { slug } = useParams();
  const { user: currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reported, setReported] = useState(false);

  const userList = useSelector((state) => state.userDatas.value);
  const userdata = userList?.find((user) => user.slug === slug);

  if (!userdata) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F2EF]">
        <div className="text-2xl font-semibold text-slate-500 flex items-center gap-4">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="animate-pulse">Loading Profile...</span>
        </div>
      </div>
    );
  }

  const handleSubmitProposal = async ({ skillsOffered, skillsRequested, message }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/request/send-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: userdata._id,
          skillsOffered,
          skillsRequested,
          message
        }),
        credentials: "include",
      });
      if (!response.ok) {
        const err = await response.json();
        return toast.error(err.message || "Failed to send");
      }
      toast.success("Proposal sent! 🤝");
      setShowModal(false);
    } catch (error) {
      toast.error("Request already Send" );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReport = async (category, reason) => {
    setIsReporting(true);
    try {
      const res = await fetch(`/user/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ targetUserId: userdata._id, category, reason }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Failed to report");
      toast.success("Report submitted. Thank you for keeping the community safe.");
      setShowReport(false);
      setReported(true);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsReporting(false);
    }
  };

  const verifyIcons = [<Zap size={16} />, <Code size={16} />, <Database size={16} />];

  return (
    <>
      {showModal && (
        <ProposalModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitProposal}
          mySkills={currentUser?.skills || []}
          theirSkills={userdata.skills || []}
          isSubmitting={isSubmitting}
        />
      )}
      {showReport && (
        <ReportModal
          onClose={() => setShowReport(false)}
          onSubmit={handleSubmitReport}
          targetName={userdata.name}
          isSubmitting={isReporting}
        />
      )}

      <div className="min-h-screen mt-20 relative bg-gray-100 py-8 px-4 text-gray-900 antialiased">
        <div className="max-w-6xl mx-auto grid grid-cols-1">
          <div className="lg:col-span-3 space-y-3">
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-[#e0e0e0] overflow-hidden shadow-sm">
              <div className="relative w-full h-48 bg-linear-to-tr from-blue-400 via-blue-800 to-black" />

              <div className="px-6 pb-6">
                <div className="flex justify-between items-start">
                  <div className="relative -mt-24 mb-4">
                    <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden bg-white shadow-sm">
                      <img
                        src={userdata.profile_pic || "/fallback.jpg"}
                        alt={userdata.name || ""}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 flex-wrap items-center">
                    {/* Loyalty badge */}
                    {userdata.badge && userdata.badge !== 'none' && (
                      <span className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                        {userdata.badge === 'platinum' ? '💎' : userdata.badge === 'gold' ? '🥇' : userdata.badge === 'silver' ? '🥈' : '🥉'}
                        {userdata.badge.charAt(0).toUpperCase() + userdata.badge.slice(1)}
                      </span>
                    )}
                    {userdata.isBanned ? (
                      <span className="px-4 py-1.5 bg-red-100 text-red-600 rounded-full font-bold text-sm border border-red-200">
                        ⚠️ Restricted
                      </span>
                    ) : (
                      <button
                        onClick={() => setShowModal(true)}
                        className="px-5 py-1.5 bg-[#0a66c2] text-white rounded-full font-bold text-sm hover:bg-[#004182] transition-all active:scale-95 shadow-lg shadow-blue-200"
                      >
                        🤝 Open to Swap
                      </button>
                    )}
                    {/* Report button — only show if not own profile */}
                    {currentUser?._id !== userdata._id && (
                      reported ? (
                        <span className="text-xs text-red-400 font-semibold flex items-center gap-1">
                          <Flag size={12} /> Reported
                        </span>
                      ) : (
                        <button
                          onClick={() => setShowReport(true)}
                          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-full border border-gray-200 hover:border-red-200 hover:bg-red-50"
                        >
                          <Flag size={12} /> Report
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <h1 className="text-2xl font-semibold">{userdata.name}</h1>
                    <p className="text-base text-slate-700 leading-tight mt-1">{userdata.exp}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
                      <span>{userdata.loc}</span>
                      {userdata.loyaltyPoints > 0 && (
                        <span className="text-blue-600 font-semibold text-xs">
                          ⭐ {userdata.loyaltyPoints} pts · {userdata.exchangesCompleted || 0} exchanges
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl border border-[#e0e0e0] p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-sm text-slate-700 leading-relaxed">{userdata.about}</p>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <LinkedInSkill title="Skills I'm Offering" items={userdata.skills} active />
              <LinkedInSkill title="Skills I'm Learning" items={userdata.seeking} />
            </div>

            {/* Verified Skills */}
            <div className="bg-white rounded-2xl border border-[#e0e0e0] p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">
                Skill Verification
              </h3>
              <div className="space-y-4">
                {userdata.verify?.length > 0 ? (
                  userdata.verify.map((label, index) => (
                    <VerifyRow key={index} icon={verifyIcons[index % verifyIcons.length]} label={label} done />
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">No verified skills yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const LinkedInSkill = ({ title, items, active }) => (
  <div className="bg-white rounded-2xl border border-[#e0e0e0] p-6 shadow-sm">
    <h3 className="text-base font-semibold mb-4">{title}</h3>
    <div className="space-y-3">
      {items?.length > 0 ? (
        items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 border-b border-slate-50 pb-2 last:border-0">
            <CheckCircle2 size={16} className={active ? "text-emerald-600" : "text-slate-300"} />
            <span className="text-sm font-semibold text-slate-700">{item}</span>
          </div>
        ))
      ) : (
        <p className="text-xs text-slate-400">None listed</p>
      )}
    </div>
  </div>
);

const VerifyRow = ({ icon, label, done }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${done ? "bg-blue-50 text-[#0a66c2]" : "bg-slate-50 text-slate-400"}`}>
        {icon}
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </div>
    {done && <CheckCircle2 size={16} className="text-[#0a66c2]" />}
  </div>
);

export default Profile;
