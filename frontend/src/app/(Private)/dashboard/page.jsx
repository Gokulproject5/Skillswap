"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const userData = useSelector((state) =>
    state.loginData.currentUser
  )
  const requests = useSelector((state) =>
    state.request.RequestData
  )

  const [modules, setModules] = useState([
    {
      title: "React.Js",
      desc: "Mastering React Js",
      progress: 65,
      next: "Tue 5:00pm",
    },
  ]);



  const handleRequest = (id, type) => {
    setRequests((prev) => prev.filter(req => req.id !== id));
    if (type === 'accept') {

    }
  };

  return (
    <main
      className={`transition-all bg-gray-100 animate-page-entry duration-300 min-h-screen pt-24 pb-10 px-4 md:px-8 lg:px-29`}
    >
      <header className="mb-8 md:mb-10 text-center md:text-left">
        <title>Dashboard</title>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
          Welcome Back, <span className="text-blue-600">{userData?.name}</span>
        </h1>
        <p className="text-gray-500 text-xs md:text-sm mt-1">
          Monitor your skills and network progress here.
        </p>
      </header>


      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Section */}
        <div className="bg-white h-fit rounded-2xl lg:col-span-2 p-4 md:p-6 border border-gray-100 order-1 lg:order-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-gray-700 font-semibold">Active Learning</h2>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {modules.map((module, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 p-4 md:p-5 rounded-xl shadow-sm"
              >
                <h3 className="text-md font-bold text-gray-800">
                  {module.title}
                </h3>
                <p className="text-[12px] text-gray-500 mb-4">{module.desc}</p>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 h-2 animate-shimmer rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${module.progress}%` }}
                  ></div>
                </div>

                <div className="flex justify-between  text-[10px] font-medium">
                  <span className="text-gray-400">
                    {module.progress}% Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section*/}
        <div className="bg-white border border-dashed border-gray-400 shadow-sm rounded-2xl p-4 md:p-6 flex flex-col space-y-4 order-2 lg:order-2">
          <div className="flex justify-between items-center w-full mb-2">
            <h3 className="font-bold text-gray-700">Pending Requests</h3>
            {requests.length > 0 && (
              <span className="bg-red-500 font-semibold text-white text-[10px] px-2 py-0.5 rounded-full ">
                {requests.length} New
              </span>
            )}
          </div>

          <div className="space-y-4">
            {requests.length > 0 ? (
              requests.map((req) => {
                const { profile_pic, name, seeking, _id } = req.sender;
                return (
                  <div key={_id} className="flex flex-col items-start space-y-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
                    <div className="flex items-center space-x-3 w-full">
                      <div className="shrink-0">
                        <Image src={profile_pic || "/fallback.jpg"} width={48} height={48} className="rounded-full object-cover h-12 w-12" alt={name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-gray-800 truncate">{name}</h3>
                        <p className="text-[11px] text-gray-500 truncate">
                          {seeking.join(" , ")}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <button
                        onClick={() => handleRequest(id, 'accept')}
                        className="bg-blue-500 text-[11px] font-medium rounded-md py-1.5 text-white active:scale-95 transition-all"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRequest(id, 'reject')}
                        className="bg-gray-200 text-[11px] font-medium rounded-md py-1.5 text-gray-700 active:scale-95 transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-center text-gray-400 text-xs py-4">No pending requests</p>
            )}
          </div>

          <Link
            href={"/request"}
            className="w-full py-2.5 focus:scale-95 text-xs font-semibold bg-blue-600 rounded-lg text-center text-white transition-all shadow-md shadow-blue-100"
          >
            View All Requests
          </Link>
        </div>
      </section>
    </main>
  );
}
