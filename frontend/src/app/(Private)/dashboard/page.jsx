"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/Context/authContext";
import { setRequest } from "@/feature/requestSlice";
import { setExchanges, setLoading as setExchangeLoading } from "@/feature/exchangeSlice";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Dashboard() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.request.RequestData) || [];
  const exchanges = useSelector((state) => state.exchange.exchanges) || [];
  const loadingExchanges = useSelector((state) => state.exchange.loading);

  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    fetch(`/api/request/my-request/${user._id}`, { credentials: "include" })
      .then(r => r.json())
      .then(data => dispatch(setRequest(Array.isArray(data) ? data : [])))
      .catch(() => { })
      .finally(() => setLoadingRequests(false));
  }, [user?._id]);

  useEffect(() => {
    dispatch(setExchangeLoading(true));
    fetch(`/api/exchange/my`, { credentials: "include" })
      .then(r => r.json())
      .then(data => dispatch(setExchanges(Array.isArray(data) ? data.filter(e => e.status === "active") : [])))
      .catch(() => { })
      .finally(() => dispatch(setExchangeLoading(false)));
  }, [dispatch]);

  const handleRequest = async (requestId, action) => {
    try {
      const res = await fetch(`/api/request/handle-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ requestId, action: action === "accept" ? "accepted" : "rejected" }),
      });
      if (!res.ok) return toast.error("Action failed");
      toast.success(action === "accept" ? "Request accepted 🎉" : "Request rejected");
      dispatch(setRequest(requests.filter(r => r._id !== requestId)));
      if (action === "accept") {

        fetch(`${API}/api/exchange/my`, { credentials: "include" })
          .then(r => r.json())
          .then(data => setExchanges(Array.isArray(data) ? data.filter(e => e.status === "active") : []));
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="transition-all duration-300 ease-in-out min-h-screen bg-gray-100 mt-10 pt-24 pb-10 px-4 md:px-8 lg:px-28 animate-page-entry">
      <title>Dashboard</title>

      {/* Header */}
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
          Welcome Back, <span className="text-blue-600">{user?.name || "..."}</span>
        </h1>
        <p className="text-gray-500 text-xs md:text-sm mt-1">Monitor your skills and network progress here.</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Connections", value: user?.connection?.length  || 0, },
          { label: "Loyalty Points", value: user?.loyaltyPoints || 0, },
          { label: "Exchanges Done", value: user?.exchangesCompleted || 0, },
          { label: "Active Swaps", value: exchanges.length, },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white flex items-center gap-3 rounded-xl border-2 border-double border-white  shadow-xl p-8">
            <p className="text-2xl font-extrabold text-gray-700">{value}</p>
            <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active Learning */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-gray-800">Active Learning</h2>
            <Link href="/exchange" className="text-blue-600 text-sm font-medium hover:underline">View All</Link>
          </div>

          {loadingExchanges ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />)}
            </div>
          ) : exchanges.length > 0 ? (
            <div className="space-y-4">
              {exchanges.map(ex => {
                const isA = ex.userA?._id === user?._id;
                const partner = isA ? ex.userB : ex.userA;
                const myProgress = isA ? ex.progressA : ex.progressB;
                const mySkills = isA ? ex.skillsAtoB : ex.skillsBtoA;
                const done = ex.checklist?.filter(i => i.completedBy)?.length || 0;
                const total = ex.checklist?.length || 0;

                return (
                  <div key={ex._id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 shrink-0">
                        <Image src={partner?.profile_pic || "/fallback.jpg"} alt={partner?.name || ""} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800">Swap with {partner?.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">Teaching: {mySkills?.join(", ") || "—"}</p>
                      </div>
                      <span className="text-xs font-bold text-blue-600">{myProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1.5">
                      <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-700" style={{ width: `${myProgress}%` }} />
                    </div>
                    <div className="flex justify-between text-[13px] text-gray-400 font-medium">
                      <span>{done}/{total} tasks</span>
                      <Link href="/exchange" className="text-blue-500 hover:underline">Continue →</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-gray-400 text-sm font-medium">No active skill exchanges yet</p>
              <Link href="/findtalent" className="text-blue-500 text-xs mt-2 hover:underline">
                Find someone to swap skills with →
              </Link>
            </div>
          )}
        </div>

        {/* Pending Requests */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl shadow-sm p-5 md:p-6 flex flex-col gap-4 h-fit self-start">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Pending Requests</h3>
            {requests.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {requests.length} New
              </span>
            )}
          </div>

          <div className="space-y-3">
            {loadingRequests ? (
              <div className="space-y-3">
                {[1, 2].map(i => <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />)}
              </div>
            ) : requests.length > 0 ? (
              <>
                {requests.slice(0, 4).map((req) => {
                  const { profile_pic, name, seeking } = req.sender;
                  return (
                    <div key={req._id} className="flex flex-col gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Image src={profile_pic || "/fallback.jpg"} width={40} height={40} className="rounded-full object-cover h-10 w-10" alt={name} />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-gray-800 truncate">{name}</p>
                          <p className="text-[10px] text-gray-500 truncate">Wants: {seeking?.join(", ") || "—"}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleRequest(req._id, "accept")} className="py-1.5 text-[11px] font-semibold rounded-lg bg-blue-600 text-white active:scale-95 transition-all">Accept</button>
                        <button onClick={() => handleRequest(req._id, "reject")} className="py-1.5 text-[11px] font-semibold rounded-lg bg-gray-100 text-gray-600 active:scale-95 transition-all">Reject</button>
                      </div>
                    </div>
                  );
                })}
                {requests.length > 4 && (
                  <p className="text-center text-[11px] text-gray-400">
                    +{requests.length - 4} more · <Link href="/request" className="text-blue-500 hover:underline">View all</Link>
                  </p>
                )}
              </>
            ) : (
              <p className="text-center text-gray-400 text-xs py-4">No pending requests</p>
            )}
          </div>

          {requests.length > 0 && (
            <Link href="/request" className="w-full py-2.5 text-xs font-semibold bg-blue-600 rounded-lg text-center text-white active:scale-99 transition-all shadow-md shadow-blue-100">
              View All Requests
            </Link>
          )}
        </div>

      </section>
    </main>
  );
}
