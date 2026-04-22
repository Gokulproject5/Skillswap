"use client"
import { useAuth } from '@/Context/authContext';
import { setRequest } from '@/feature/requestSlice';
import { div } from 'framer-motion/client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { MdCallMade, MdCallReceived, MdCancel } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';

// datas
const incomingRequests = [
  { id: 1, name: "Gokul", proposal: "Advanced React Patterns", skill: "React", img: "https://i.pinimg.com/736x/e4/32/12/e43212860a10e5e63c80c2ce5f76f8b3.jpg" },
  { id: 2, name: "Sita", proposal: "UI Motion Design", skill: "Figma", img: "https://i.pinimg.com/736x/23/57/24/235724d60503e6429c4a621f35a42fbe.jpg" },
  { id: 3, name: "Arjun", proposal: "Backend Architecture", skill: "Node.js", img: "https://i.pinimg.com/736x/62/2a/bd/622abdb66db47aa105401d8576bd98b2.jpg" },
];



const RequestCard = ({ name, proposal, skill, btnText, request, btntext, img, accept, reject, slug }) => (
  <div className='flex flex-col md:flex-row md:justify-between md:items-center bg-white py-4 rounded-2xl px-4 shadow-sm hover:shadow-md transition-shadow gap-4'>
    <div className='flex items-center space-x-4'>
      <div className='relative w-14 h-14 md:w-16 md:h-16 overflow-hidden rounded-full border border-gray-100 shrink-0'>
        <Image
          src={img || "/fallback.jpg"}
          alt={name}
          sizes='true'
          fill
          className='object-cover'
        />
      </div>
      <div className='space-y-1'>
        <Link href={`/findtalent/${slug}`} className='font-bold text-gray-800 text-sm md:text-base'>{name}</Link>
        <p className='text-xs md:text-sm text-gray-600'>
          proposes exchange for <span className='text-blue-600 font-semibold'>{proposal.join(" , ")}</span>
        </p>
        <div className='pt-1 space-x-2'>
          {
            skill.map((skill, index) => (
              <span key={index} className='bg-gray-100 text-gray-600 text-[10px] md:text-xs font-medium rounded-md py-1 px-2 border border-gray-200'>
                {skill}
              </span>
            ))
          }
        </div>
      </div>
    </div>

    <div className='text-sm space-x-3 flex items-center justify-end md:justify-start'>
      <button type='button' onClick={() => { reject(request) }} className='py-2 px-4 md:px-5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-xs md:text-sm'>
        {btnText}
      </button>
      <button type='button' onClick={() => { accept(request) }} className='bg-blue-600 hover:bg-blue-700 py-2 px-4 md:px-5 rounded-full shadow-lg text-white transition-all active:scale-95 font-medium text-xs md:text-sm flex items-center justify-center min-w-10'>
        {btntext}
      </button>
    </div>
  </div>
);

const Page = () => {
  const { user } = useAuth();
  const stated = useSelector((state) => state?.request?.RequestData);

  const dispatch = useDispatch();
  // handle accept the request
  const handleAccept = async (requestId) => {

    const accept = {
      requestId: requestId,
      action: "accepted"
    }
    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/request/handle-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(accept),
        credentials: "include"
      })

      if (!response) {
        alert("something went wrong")
      }

      alert("Request accepted")
    } catch (error) {
      console.log(error);

    }
  }

  // handle reject thr request 
  const handleReject = async (requestId) => {

    const accept = {
      requestId: requestId,
      action: "rejected"
    }
    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/request/handle-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(accept),
        credentials: "include"
      })

      if (!response) {
        alert("something went wrong")
      }

      alert("Request accepted")
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const request = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/request/my-request/${user._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",

          }, credentials: "include"
        });

        const result = await request.json();

        dispatch(setRequest(result))

      } catch (e) {
        console.log("error:", e);

      }
    }
    fetchRequest()
  }, [])



  return (
    <div className={`transition-all text-gray-700 bg-gray-100 animate-page-entry duration-300 min-h-screen pt-24 md:pt-28 pb-10 px-4 md:px-12 lg:px-24 xl:px-40`}>
      <title>Requests</title>

      {/* title */}
      <div className='space-y-3 text-center md:text-left'>
        <div className='text-2xl font-bold text-blue-500'>
          Requests
        </div>
        <div className='text-sm md:text-md max-w-2xl mx-auto md:mx-0'>
          <p>Manage your skill exchange connections. Review incoming expertise requests and track your outgoing proposals.</p>
        </div>
      </div>

      {/* Incoming Request Section */}
      <div className='mt-10 md:mt-12 mb-16 md:mb-20'>
        <div className='flex items-center justify-between'>
          <div className='flex space-x-2 items-center text-xl md:text-2xl font-semibold'>
            <MdCallReceived className='text-blue-600' />
            <h1>Incoming Request</h1>
          </div>

          <div className='shrink-0'>
            <div className='bg-blue-100 text-blue-700 text-[10px] md:text-sm font-bold px-2 md:px-3 py-1 rounded-full'>
              {stated.length || 0} Pending
            </div>
          </div>
        </div>

        {/* List of Requests */}
        <div className='space-y-4 mt-6'>
          {
            stated?.length > 0 ? (

              stated.map((req, index) => {
                const { name, skills, _id, profile_pic, seeking, slug } = req.sender;
                return (
                  <RequestCard
                    key={_id}
                    name={name}
                    proposal={seeking}
                    skill={skills}
                    btnText={"Reject"}
                    reject={handleReject}
                    btntext={"Accept"}
                    accept={handleAccept}
                    request={req._id}
                    slug={slug}
                    img={profile_pic}
                  />
                )
              })

            ) : (
              <div className='bg-gray-200 flex items-center justify-center rounded-md min-h-20 h-full'>
                <h1>No Incoming Request </h1>
              </div>
            )
          }
        </div>
      </div>

      {/* Sending Proposal */}
      <div className='mt-12 mb-20'>
        <div className='flex items-center justify-between'>
          <div className='flex space-x-2 items-center text-xl md:text-2xl font-semibold'>
            <MdCallMade className='text-blue-600' />
            <h1>Sending Proposal</h1>
          </div>
        

          <div className='shrink-0'>
            <div className='bg-blue-100 text-blue-700 text-[10px] md:text-sm font-bold px-2 md:px-3 py-1 rounded-full'>
              {stated.length} Pending
            </div>
          </div>
        </div>

        {/* List of Requests */}
        <div className='space-y-4 mt-6'>
          {
            stated.length > 0 ? (
              stated.map((req, index) => {
                const { name, skills, _id, profile_pic, seeking, slug } = req.sender;
                return (
                  <RequestCard
                    key={_id}
                    name={name}
                    proposal={seeking}
                    skill={skills}
                    btnText={"Reject"}
                    reject={handleReject}
                    btntext={"Accept"}
                    accept={handleAccept}
                    request={req._id}
                    slug={slug}
                    img={profile_pic}
                  />
                )
              })) : (
              <div className='bg-gray-200 flex items-center justify-center rounded-md min-h-20 h-full'>
                <h1>No sending  proposal </h1>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Page
