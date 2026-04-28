"use client"
import { useAuth } from '@/Context/authContext';
import { setRequest, setSentRequests, removeSentRequest } from '@/feature/requestSlice';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { MdCallMade, MdCallReceived } from "react-icons/md";
import { FiClock, FiXCircle } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';



const RequestCard = ({ name, proposal, skill, request, img, accept, reject, slug }) => (
  <div className='flex flex-col md:flex-row md:justify-between md:items-center bg-white py-4 rounded-2xl px-4 shadow-sm hover:shadow-md transition-shadow gap-4'>
    <div className='flex items-center space-x-4'>
      <div className='relative w-14 h-14 md:w-16 md:h-16 overflow-hidden rounded-full border border-gray-100 shrink-0'>
        <Image src={img || "/fallback.jpg"} alt={name} sizes='true' fill className='object-cover' />
      </div>
      <div className='space-y-1'>
        <Link href={`/findtalent/${slug}`} className='font-bold text-gray-800 text-sm md:text-base'>{name}</Link>
        <p className='text-xs md:text-sm text-gray-600'>
          proposes exchange for <span className='text-blue-600 font-semibold'>{proposal.join(" , ")}</span>
        </p>
        <div className='pt-1 flex flex-wrap gap-1.5'>
          {skill.map((s, index) => (
            <span key={index} className='bg-gray-100 text-gray-600 text-[10px] md:text-xs font-medium rounded-md py-1 px-2 border border-gray-200'>{s}</span>
          ))}
        </div>
      </div>
    </div>

    <div className='text-sm space-x-3 flex items-center justify-end md:justify-start'>
      <button type='button' onClick={() => reject(request)} className='py-2 px-4 md:px-5 rounded-full border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors font-medium text-xs md:text-sm'>
        Reject
      </button>
      <button type='button' onClick={() => accept(request)} className='bg-blue-600 hover:bg-blue-700 py-2 px-4 md:px-5 rounded-full shadow-lg text-white transition-all active:scale-95 font-medium text-xs md:text-sm'>
        Accept
      </button>
    </div>
  </div>
);


const SentCard = ({ name, proposal, skill, img, slug, status, onCancel, requestId }) => (
  <div className='flex flex-col md:flex-row md:justify-between md:items-center bg-white py-4 rounded-2xl px-4 shadow-sm hover:shadow-md transition-shadow gap-4'>
    <div className='flex items-center space-x-4'>
      <div className='relative w-14 h-14 md:w-16 md:h-16 overflow-hidden rounded-full border border-gray-100 shrink-0'>
        <Image src={img || "/fallback.jpg"} alt={name} sizes='true' fill className='object-cover' />
      </div>
      <div className='space-y-1'>
        <Link href={`/findtalent/${slug}`} className='font-bold text-gray-800 text-sm md:text-base'>{name}</Link>
        <p className='text-xs md:text-sm text-gray-600'>
          you proposed exchange for <span className='text-blue-600 font-semibold'>{proposal?.join(" , ")}</span>
        </p>
        <div className='pt-1 flex flex-wrap gap-1.5'>
          {skill?.map((s, i) => (
            <span key={i} className='bg-gray-100 text-gray-600 text-[10px] md:text-xs font-medium rounded-md py-1 px-2 border border-gray-200'>{s}</span>
          ))}
        </div>
      </div>
    </div>

    <div className='flex items-center gap-3 justify-end'>
      <span className='flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full uppercase tracking-wider'>
        <FiClock size={11} /> Pending
      </span>
      <button
        type='button'
        onClick={() => onCancel(requestId)}
        className='flex items-center gap-1.5 py-2 px-4 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors font-medium text-xs'
      >
        <FiXCircle size={13} /> Cancel
      </button>
    </div>
  </div>
);


const Page = () => {
  const { user, refreshSession } = useAuth();
  const incoming = useSelector((state) => state?.request?.RequestData) || [];
  const sentRequests = useSelector((state) => state?.request?.sentRequests) || [];
  const dispatch = useDispatch();
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Accept incoming request
  const handleAccept = async (requestId) => {
    try {
      const response = await fetch(`/api/request/handle-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action: "accepted" }),
        credentials: "include"
      });
      if (!response.ok) return toast.error("Something went wrong");
      toast.success("Request accepted 🎉");
      dispatch(setRequest(incoming.filter(r => r._id !== requestId)));
      refreshSession();
    } catch (error) {
      toast.error("Failed to accept request");
    }
  };

  // Reject incoming request
  const handleReject = async (requestId) => {
    try {
      const response = await fetch(`/api/request/handle-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action: "rejected" }),
        credentials: "include"
      });
      if (!response.ok) return toast.error("Something went wrong");
      toast.success("Request rejected");
      dispatch(setRequest(incoming.filter(r => r._id !== requestId)));
    } catch (error) {
      toast.error("Failed to reject request");
    }
  };

  // Cancel a sent proposal
  const handleCancelProposal = async (requestId) => {
    try {
      const response = await fetch(`/api/request/handle-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action: "rejected" }),
        credentials: "include"
      });
      if (!response.ok) return toast.error("Failed to cancel");
      toast.success("Proposal cancelled");
      dispatch(removeSentRequest(requestId));
    } catch (error) {
      toast.error("Error cancelling proposal");
    }
  };

  // Fetch incoming requests
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(`/api/request/my-request/${user._id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });
        const result = await res.json();
        dispatch(setRequest(result));
      } catch (e) {
        console.log("error:", e);
      }
    };
    fetchRequest();
  }, []);

  // Fetch sent proposals
  useEffect(() => {
    const fetchSent = async () => {
      try {
        const res = await fetch(`/api/request/my-sent-request/${user._id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });
        const result = await res.json();
        dispatch(setSentRequests(Array.isArray(result) ? result : []));
      } catch (e) {
        console.log("sent fetch error:", e);
      }
    };
    fetchSent();
  }, []);

  return (
    <div className={`transition-all text-gray-700 bg-gray-100 animate-page-entry duration-300 min-h-screen pt-24 md:pt-28 pb-10 px-4 md:px-12 lg:px-24 xl:px-40`}>
      <title>Requests</title>

      {/* Title */}
      <div className='space-y-3 text-center md:text-left'>
        <div className='text-2xl font-bold text-blue-500'>Requests</div>
        <div className='text-sm md:text-md max-w-2xl mx-auto md:mx-0'>
          <p>Manage your skill exchange connections. Review incoming expertise requests and track your outgoing proposals.</p>
        </div>
      </div>

      {/* Incoming Requests */}
      <div className='mt-10 md:mt-12 mb-16 md:mb-20'>
        <div className='flex items-center justify-between'>
          <div className='flex space-x-2 items-center text-xl md:text-2xl font-semibold'>
            <MdCallReceived className='text-blue-600' />
            <h1>Incoming Requests</h1>
          </div>
          <div className='shrink-0'>
            <div className='bg-blue-100 text-blue-700 text-[10px] md:text-sm font-bold px-2 md:px-3 py-1 rounded-full'>
              {incoming.length || 0} Pending
            </div>
          </div>
        </div>

        <div className='space-y-4 mt-6'>
          {incoming?.length > 0 ? (
            incoming.map((req) => {
              const { name, skills, _id, profile_pic, seeking, slug } = req.sender;
              return (
                <RequestCard
                  key={req._id}
                  name={name}
                  proposal={seeking}
                  skill={skills}
                  reject={handleReject}
                  accept={handleAccept}
                  request={req._id}
                  slug={slug}
                  img={profile_pic}
                />
              );
            })
          ) : (
            <div className='bg-white border border-dashed border-gray-200 flex items-center justify-center rounded-2xl min-h-24'>
              <p className='text-gray-400 text-sm'>No incoming requests</p>
            </div>
          )}
        </div>
      </div>

      {/* Sending Proposals */}
      <div className='mt-12 mb-20'>
        <div className='flex items-center justify-between'>
          <div className='flex space-x-2 items-center text-xl md:text-2xl font-semibold'>
            <MdCallMade className='text-blue-600' />
            <h1>Sending Proposals</h1>
          </div>
          <div className='shrink-0'>
            <div className='bg-amber-100 text-amber-700 text-[10px] md:text-sm font-bold px-2 md:px-3 py-1 rounded-full'>
              {sentRequests.length} Pending
            </div>
          </div>
        </div>

        <div className='space-y-4 mt-6'>
          {sentRequests.length > 0 ? (
            sentRequests.map((req) => {
              const { name, skills, _id, profile_pic, seeking, slug } = req.receiver;
              return (
                <SentCard
                  key={req._id}
                  name={name}
                  proposal={seeking}
                  skill={skills}
                  img={profile_pic}
                  slug={slug}
                  requestId={req._id}
                  onCancel={handleCancelProposal}
                />
              );
            })
          ) : (
            <div className='bg-white border border-dashed border-gray-200 flex items-center justify-center rounded-2xl min-h-24'>
              <p className='text-gray-400 text-sm'>No outgoing proposals</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
