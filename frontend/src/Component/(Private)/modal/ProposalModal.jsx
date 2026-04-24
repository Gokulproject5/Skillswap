"use client"
import { ChevronRight, X, Zap } from "lucide-react";
import { useState } from "react";

export const ProposalModal = ({ onClose, onSubmit, mySkills, theirSkills, isSubmitting }) => {
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsRequested, setSkillsRequested] = useState([]);
  const [message, setMessage] = useState("");
  const toggleSkill = (skill, list, setList) => {
    setList(list.includes(skill) ? list.filter(s => s !== skill) : [...list, skill]);
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold">Send Skill Swap Proposal</h2>
              <p className="text-blue-100 text-xs mt-0.5">Select what you'll teach and what you want to learn</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Skills I'll Teach */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5 flex items-center gap-1.5">
              <Zap size={12} className="text-blue-500" /> Skills I'll teach them
            </p>
            <div className="flex flex-wrap gap-2">
              {mySkills?.length > 0 ? mySkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill, skillsOffered, setSkillsOffered)}
                  className={`py-1.5 px-3.5 rounded-full text-xs font-semibold border transition-all ${
                    skillsOffered.includes(skill)
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {skillsOffered.includes(skill) ? "✓ " : ""}{skill}
                </button>
              )) : <p className="text-xs text-gray-400 italic">No skills listed on your profile</p>}
            </div>
          </div>

          {/* Skills I Want to Learn */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5 flex items-center gap-1.5">
              <ChevronRight size={12} className="text-purple-500" /> Skills I want to learn from them
            </p>
            <div className="flex flex-wrap gap-2">
              {theirSkills?.length > 0 ? theirSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill, skillsRequested, setSkillsRequested)}
                  className={`py-1.5 px-3.5 rounded-full text-xs font-semibold border transition-all ${
                    skillsRequested.includes(skill)
                      ? "bg-purple-600 text-white border-purple-600 shadow-md"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-purple-300"
                  }`}
                >
                  {skillsRequested.includes(skill) ? "✓ " : ""}{skill}
                </button>
              )) : <p className="text-xs text-gray-400 italic">No skills listed on their profile</p>}
            </div>
          </div>

          {/* Message */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Message <span className="text-gray-300 font-normal normal-case">(optional)</span>
            </p>
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Hi! I'd love to swap skills with you..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 resize-none bg-gray-50 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit({ skillsOffered, skillsRequested, message })}
            disabled={isSubmitting || (skillsOffered.length === 0 && skillsRequested.length === 0)}
            className="flex-1 py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Proposal 🤝"}
          </button>
        </div>
      </div>
    </div>
  );
};