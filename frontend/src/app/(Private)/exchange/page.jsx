"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/Context/authContext";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { CheckCircle2, Circle, Flag, X, ChevronDown, ChevronUp, Plus, Star } from "lucide-react";
import { LiaNotesMedicalSolid } from "react-icons/lia";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const BADGE = {
  none: { emoji: "", label: "—" },
  bronze: { emoji: "🥉", label: "Bronze" },
  silver: { emoji: "🥈", label: "Silver" },
  gold: { emoji: "🥇", label: "Gold" },
  diamond: { emoji: "💎", label: "Diamond" },
};

const MILESTONES = [
  { pts: 50, label: "Bronze" },
  { pts: 150, label: "Silver" },
  { pts: 400, label: "Gold" },
  { pts: 1000, label: "Diamond" },
];


const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(n => (
      <button key={n} onClick={() => onChange(n)} className="transition-transform hover:scale-110">
        <Star size={22} className={n <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
      </button>
    ))}
  </div>
);


const ExchangeCard = ({ exchange, currentUserId, onTick, onComplete, onReport, onAddTask }) => {
  const [open, setOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [ratingOpen, setRatingOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [newTask, setNewTask] = useState("");
  const [addingTask, setAddingTask] = useState(false);

  const isA = exchange.userA?._id === currentUserId;
  const partner = isA ? exchange.userB : exchange.userA;
  const myProgress = isA ? exchange.progressA : exchange.progressB;
  const partnerProgress = isA ? exchange.progressB : exchange.progressA;
  const mySkills = isA ? exchange.skillsAtoB : exchange.skillsBtoA;
  const learnSkills = isA ? exchange.skillsBtoA : exchange.skillsAtoB;
  const myConfirmed = isA ? exchange.completedByA : exchange.completedByB;
  const partnerConfirmed = isA ? exchange.completedByB : exchange.completedByA;
  const alreadyReported = exchange.reportedBy?.map(r => r?.toString())?.includes(currentUserId);
  const done = exchange.checklist?.filter(i => i.completedBy)?.length || 0;
  const total = exchange.checklist?.length || 0;
  const minRequired = total > 0 ? Math.ceil(total / 2) : 0;
  const canComplete = done >= minRequired;

  const statusBadge = {
    active: "bg-blue-50 text-blue-600 border-blue-100",
    completed: "bg-green-50 text-green-600 border-green-100",
    disputed: "bg-red-50 text-red-500 border-red-100",
    cancelled: "bg-gray-100 text-gray-500 border-gray-200",
  }[exchange.status] || "bg-gray-100 text-gray-500 border-gray-200";

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* Header  */}
      <div className="p-4 md:p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 shrink-0">
            <Image src={partner?.profile_pic || "/fallback.jpg"} alt={partner?.name || "Partner"} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <Link href={`/findtalent/${partner?.slug}`} className="font-bold text-gray-800 text-sm hover:text-blue-600 truncate block">
              {partner?.name}
            </Link>
            <span className={`text-[10px] font-bold uppercase tracking-wider border-2 px-2 py-0.5 rounded-full ${statusBadge}`}>
              {exchange.status}
            </span>
          </div>
        </div>

        {/* Progress  */}
        <div className="flex items-center gap-5 shrink-0">
          <div className="text-center hidden sm:block">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">You</p>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${myProgress}%` }} />
              </div>
              <span className="text-xs font-bold text-blue-600">{myProgress}%</span>
            </div>
          </div>
          <div className="text-center hidden sm:block">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Partner</p>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-gray-200 rounded overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${partnerProgress}%` }} />
              </div>
              <span className="text-xs font-bold text-emerald-600">{partnerProgress}%</span>
            </div>
          </div>
          <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-gray-600 p-1">
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Skills  */}
      <div className="px-4 md:px-5 pb-3 flex flex-wrap gap-2">
        <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
          Teaching: {mySkills?.join(", ") || "—"}
        </span>
        <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">
          Learning: {learnSkills?.join(", ") || "—"}
        </span>
      </div>

      {open && (
        <div className="border-t border-gray-100 p-4 md:p-5 space-y-4">

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Checklist ({done}/{total})</p>
              <div className="w-28 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              {exchange.checklist?.map(item => {
                const isDone = !!item.completedBy;
                const isMyTask = item.assignedTo === 'shared' ||
                  (item.assignedTo === 'userA' && isA) ||
                  (item.assignedTo === 'userB' && !isA);
                const doneByMe = item.completedBy?.toString() === currentUserId;
                return (
                  <button
                    key={item._id}
                    onClick={() => exchange.status === 'active' && isMyTask && onTick(exchange._id, item._id)}
                    disabled={exchange.status !== 'active' || !isMyTask}
                    title={!isMyTask ? "Your partner's task" : isDone && !doneByMe ? "Completed by partner" : ""}
                    className={`w-full shadow flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                      ${isDone ? "bg-green-500 border-green-200" : isMyTask ? "bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30" : "bg-gray-50 border-gray-100 opacity-60"}
                      ${!isMyTask || exchange.status !== 'active' ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {isDone
                      ? <CheckCircle2 size={16} className=" text-white shrink-0" />
                      : <Circle size={16} className={`shrink-0 ${isMyTask ? "text-gray-300" : "text-gray-200"}`} />}
                    <div className="flex-1 min-w-0">
                      <span className={`text-lg ${isDone ? "line-through text-white " : "text-gray-700 font-medium"}`}>
                        {item.label}
                      </span>
                      {item.assignedTo !== 'shared' && (
                        <span className="ml-2 text-[9px] uppercase tracking-wider text-gray-400">
                          {item.assignedTo === 'userA' ? (isA ? 'your task' : "partner's") : (isA ? "partner's" : 'your task')}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}


              {total === 0 && exchange.status === 'active' && !addingTask && (
                <div className="flex flex-col items-center justify-center py-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/60 text-center gap-2">
                  <span className="text-4xl text-blue-700"><LiaNotesMedicalSolid /></span>
                  <p className="text-sm font-semibold text-gray-600">No tasks yet</p>
                  <p className="text-xs text-gray-400 max-w-55 leading-relaxed">
                    You and your partner can add tasks to track your progress together.
                  </p>
                  <button
                    onClick={() => setAddingTask(true)}
                    className="mt-1 flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus size={13} /> Add first task
                  </button>
                </div>
              )}
            </div>

            {exchange.status === 'active' && (
              addingTask ? (
                <div className="flex gap-2 mt-2">
                  <input
                    autoFocus
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && newTask.trim()) { onAddTask(exchange._id, newTask); setNewTask(''); setAddingTask(false); } if (e.key === 'Escape') setAddingTask(false); }}
                    placeholder="Task description..."
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                  <button onClick={() => { if (newTask.trim()) { onAddTask(exchange._id, newTask); setNewTask(''); } setAddingTask(false); }} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Add</button>
                  <button onClick={() => setAddingTask(false)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">✕</button>
                </div>
              ) : total > 0 ? (
                <button onClick={() => setAddingTask(true)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 mt-2 transition-colors">
                  <Plus size={13} /> Add  task
                </button>
              ) : null
            )}
          </div>


          {exchange.status === 'active' && (
            <div className="flex flex-wrap gap-3">
              {!canComplete && !myConfirmed && (
                <p className="w-full text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  ⚠️ Complete at least {minRequired} of {total} tasks before marking done
                </p>
              )}
              <button
                onClick={() => !myConfirmed && canComplete && setRatingOpen(true)}
                disabled={myConfirmed || !canComplete}
                className={`flex items-center gap-2 py-2 px-5 rounded-xl text-sm font-bold transition-all active:scale-95
                  ${myConfirmed
                    ? "bg-green-50 text-green-600 border border-green-200 cursor-not-allowed"
                    : !canComplete
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100"}`}
              >
                <CheckCircle2 size={14} />
                {myConfirmed
                  ? (partnerConfirmed ? "✓ Both confirmed!" : "Waiting for partner…")
                  : "Mark as Complete"}
              </button>


              {ratingOpen && (
                <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-gray-900">Rate your experience</h3>
                      <p className="text-xs text-gray-400 mt-0.5">How was the skill swap with {partner?.name}?</p>
                    </div>
                    <StarRating value={rating} onChange={setRating} />
                    <textarea rows={3} value={review} onChange={e => setReview(e.target.value)}
                      placeholder="Leave a review (optional)..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 resize-none bg-gray-50"
                    />
                    <div className="flex gap-3">
                      <button onClick={() => setRatingOpen(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-500">Skip</button>
                      <button onClick={() => { onComplete(exchange._id, rating, review); setRatingOpen(false); }} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-100 transition-all">
                        Submit & Complete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!alreadyReported ? (
                <button
                  onClick={() => setReportOpen(!reportOpen)}
                  className="flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-bold border border-red-200 text-red-500 hover:bg-red-50 transition-all"
                >
                  <Flag size={13} /> Report
                </button>
              ) : (
                <span className="text-xs text-red-400 font-semibold self-center">⚠️ Reported</span>
              )}
            </div>
          )}


          {reportOpen && (
            <div className=" border border-red-100 rounded-xl p-4 space-y-3">
              <p className="text-sm font-bold text-red-600">Report scam / bad behavior</p>
              <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)}
                placeholder="Describe what happened..." className="w-full border border-red-200 rounded-lg p-2.5 text-sm resize-none outline-none focus:border-red-400 bg-white" />
              <div className="flex gap-2">
                <button onClick={() => { onReport(exchange._id, reason); setReportOpen(false); }}
                  className="py-2 px-5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-all">Submit</button>
                <button onClick={() => setReportOpen(false)} className="py-2 px-5 border border-gray-200 text-sm font-bold rounded-lg">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default function ExchangePage() {
  const { user } = useAuth();
  const [exchanges, setExchanges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");

  const fetchExchanges = () =>
    fetch(`/api/exchange/my`, { credentials: "include" })
      .then(r => r.json())
      .then(data => setExchanges(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));

  const fetchLeaderboard = () =>
    fetch(`/api/exchange/leaderboard`, { credentials: "include" })
      .then(r => r.json())
      .then(data => setLeaderboard(Array.isArray(data) ? data : []));

  useEffect(() => { fetchExchanges(); fetchLeaderboard(); }, []);

  const onTick = async (exchangeId, itemId) => {
    try {
      const res = await fetch(`/api/exchange/tick`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ exchangeId, itemId })
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Cannot tick this task");
      setExchanges(prev => prev.map(e => e._id === data.exchange._id ? data.exchange : e));
      if (data.pointsChanged > 0) toast.success(`+${data.pointsChanged} loyalty points ✅`);
      else toast(`Task unchecked (${data.pointsChanged} pts)`, { icon: '↩️' });
    } catch { toast.error("Failed to update"); }
  };

  const onAddTask = async (exchangeId, label) => {
    try {
      const res = await fetch(`/api/exchange/add-task`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ exchangeId, label })
      });
      const updated = await res.json();
      if (!res.ok) return toast.error(updated.message || "Failed");
      setExchanges(prev => prev.map(e => e._id === updated._id ? updated : e));
      toast.success("Task added");
    } catch { toast.error("Failed to add task"); }
  };

  const onComplete = async (exchangeId, rating = 0, review = '') => {
    try {
      const res = await fetch(`/api/exchange/complete`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ exchangeId, rating, review })
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Cannot complete yet");
      setExchanges(prev => prev.map(e => e._id === data._id ? data : e));
      if (data.status === 'completed') { toast.success("🎉 Exchange complete! +50 loyalty points!"); fetchLeaderboard(); }
      else toast.success("Marked — waiting for partner to confirm");
    } catch { toast.error("Failed"); }
  };

  const onReport = async (exchangeId, reason) => {
    await fetch(`/api/exchange/report`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      credentials: "include", body: JSON.stringify({ exchangeId, reason })
    });
    toast.success("Report submitted");
    fetchExchanges();
  };

  const pts = user?.loyaltyPoints || 0;
  const badge = BADGE[user?.badge || "none"];
  const nextMilestone = MILESTONES.find(m => pts < m.pts);
  const progress = nextMilestone ? Math.min(100, Math.round((pts / nextMilestone.pts) * 100)) : 100;

  const filtered = exchanges.filter(e =>
    tab === "active" ? ["active", "disputed"].includes(e.status) : e.status === "completed"
  );

  return (
    <div className="min-h-screen bg-gray-100 pt-24 md:pt-28 pb-16 px-4 md:px-8 lg:px-28 animate-page-entry">
      <title>My Exchanges</title>

      {/* Page  */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-600">Skill Exchanges</h1>
        <p className="text-sm text-gray-500 mt-1">Track your skill swaps, complete tasks, and earn loyalty points.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">

          <div className="flex gap-1.5 bg-white border border-gray-100 rounded-xl p-1 w-fit shadow-sm">
            {["active", "completed"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all
                  ${tab === t ? "bg-blue-600 text-white shadow" : "text-gray-500 hover:bg-gray-50"}`}>
                {t}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-xl border border-gray-100 animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center py-20 text-center">
              <p className="text-gray-400 font-medium text-sm">No {tab} exchanges</p>
              <Link href="/request" className="text-blue-500 text-xs hover:underline mt-2">Go to Requests →</Link>
            </div>
          ) : (
            filtered.map(ex => (
              <ExchangeCard key={ex._id} exchange={ex} currentUserId={user?._id}
                onTick={onTick} onComplete={onComplete} onReport={onReport} onAddTask={onAddTask} />
            ))
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-4">

          <div className="bg-white rounded border border-gray-100 shadow-sm p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Loyalty Points</p>
            <div className="flex items-center justify-between mb-3">
              <p className="text-3xl font-extrabold text-gray-900">{pts.toLocaleString()}</p>
              <span className="text-2xl">{badge.emoji}</span>
            </div>
            <div className="flex justify-between text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              <span>{badge.label || "No badge"}</span>
              {nextMilestone && <span>Next: {nextMilestone.label}</span>}
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="font-extrabold text-gray-900">{user?.exchangesCompleted || 0}</p>
                <p className="text-gray-400">Swaps</p>
              </div>
              <div className="border-x border-gray-100">
                <p className="font-extrabold text-blue-600">+50</p>
                <p className="text-gray-400">Complete</p>
              </div>
              <div>
                <p className="font-extrabold text-emerald-600">+5</p>
                <p className="text-gray-400">Checklist</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded border border-gray-100 shadow-sm p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">How to earn</p>
            <div className="space-y-3">
              {[
                { label: "Complete an exchange", pts: "+50", color: "text-blue-600" },
                { label: "Tick a checklist item", pts: "+5", color: "text-emerald-600" },
                { label: "Receive a scam report", pts: "−20", color: "text-red-500" },
              ].map(({ label, pts, color }) => (
                <div key={label} className="flex justify-between text-sm text-gray-600">
                  <span>{label}</span>
                  <span className={`font-extrabold ${color}`}>{pts}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Badge Tiers</p>
              {MILESTONES.map(({ pts: p, label }) => (
                <div key={label} className="flex justify-between text-xs text-gray-600 mb-1.5">
                  <span>{BADGE[label.toLowerCase()]?.emoji} {label}</span>
                  <span className="text-gray-400">{p} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50  border-amber-200 rounded p-4">
            <p className="text-xs font-bold text-amber-700 mb-1.5">⚠️ Scam Protection</p>
            <p className="text-xs text-amber-600 leading-relaxed">
              Users with <strong>5+ reports</strong> are automatically restricted. Always use our exchange system and report bad actors immediately.
            </p>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">🏆 Top Exchangers</p>
            </div>
            {leaderboard.length === 0
              ? <p className="text-center text-gray-400 text-sm py-6">No data yet</p>
              : leaderboard.map((u, i) => {
                u.loyaltyPoints>0
              return(
              
                <div key={u._id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm font-extrabold w-5 text-center text-gray-400">
                    {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
                  </span>
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-100 shrink-0">
                    <Image src={u.profile_pic || "/fallback.jpg"} alt={u.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{u.name}</p>
                    <p className="text-[10px] text-gray-400">{u.exchangesCompleted} swaps</p>
                  </div>
                  <p className="text-sm font-extrabold text-blue-600 shrink-0">{u.loyaltyPoints}</p>
                </div>
              )})}
          </div>

        </div>
      </div>
    </div>
  );
}

