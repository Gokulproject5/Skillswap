"use client"

import { CheckCircle2, X } from "lucide-react";
import { useState  } from "react";


const REPORT_CATEGORIES = [
    { value: "scam", label: "Scam / Fraud" },
    { value: "fake", label: "Fake Profile" },
    { value: "harassment", label: "Harassment" },
    { value: "spam", label: "Spam" },
    { value: "other", label: "Other" },
];

export const ReportModal = ({ onClose, onSubmit, targetName, isSubmitting }) => {
    const [category, setCategory] = useState("scam");
    const [reason, setReason] = useState("");

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Report {targetName}</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Help keep the community safe</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Category */}
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Reason</label>
                        <div className="grid grid-cols-1 gap-2">
                            {REPORT_CATEGORIES.map(c => (
                                <button
                                    key={c.value}
                                    onClick={() => setCategory(c.value)}
                                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium text-left transition-all
                    ${category === c.value
                                            ? "bg-red-50 border-red-300 text-red-600"
                                            : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"}`}
                                >
                                    {c.label}
                                    {category === c.value && <CheckCircle2 size={14} className="text-red-500" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Additional Details <span className="text-gray-300 normal-case font-normal">(optional)</span></label>
                        <textarea
                            rows={3}
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="Describe what happened..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-300 resize-none bg-gray-50 focus:bg-white transition-all"
                        />
                    </div>

                    <p className="text-[10px] text-gray-400 leading-relaxed">
                        Reports are anonymous. Users with 5+ reports are automatically restricted from the platform.
                    </p>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit(category, reason)}
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Report"}
                    </button>
                </div>
            </div>
        </div>
    );
};
