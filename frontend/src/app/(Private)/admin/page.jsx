"use client"
import React, { useEffect, useState } from 'react'
import { Link } from 'lucide-react'
import toast from 'react-hot-toast'



const AdminPage = () => {
  const [jobs, setJobs] = useState([]);

  const api_base_url = process.env.NEXT_PUBLIC_API_BASE_URL

  //  handle accept the job post 
  const handleAccept = async (id) => {
    try {
      const res = await fetch(`/api/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      if (!res.ok) {
        toast.error("Error: Could not accept job")
        return;
      }
      toast.success("job accepted");

      setJobs(prevJobs => prevJobs.filter(job => job._id !== id));

    } catch (e) {
      console.log(e);

    }
  }

  // handle reject and delete  job post

  const handleReject = async (id) => {

    const response = await fetch(`/api/admin/${id}`, {
      method: "DELETE",
      headers: {
        "Content_Type": "application/json"
      },
      credentials: "include"
    });

    if (!response.ok) {
      toast.error("Error: Could not delete job");
      return;
    }

    toast.success("deleted the job");
    setJobs(prevJobs => prevJobs.filter(job => job._id !== id));
  }
  useEffect(() => {
    const jobFetch = async () => {
      const response = await fetch(`/api/admin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      const result = await response.json();
      setJobs(result.jobs)

    }
    jobFetch();
  }, []);


  return (
    <section className='min-h-screen my-19 px-10 text-gray-700 bg-white' id='admin_panel'>
      <div className='grid mx-auto px-4 md:px-20 py-10'>
        <div className='flex'>
          <h1 className='text-4xl'>
            Welcome back <span className='text-blue-600 font-semibold'>Admin</span>
          </h1>
        </div>
        <section className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-2xl shadow-inner min-h-40">

            {/* Total Users */}
            <div className="flex flex-col justify-between p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <div>
                <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">User Stats</h2>
                <p className="text-3xl font-bold mt-1 text-gray-900">5</p>
              </div>
              {/* <p className="text-xs text-blue-600 font-medium mt-2">↑ 12% from last month</p> */}
            </div>

            {/* Jobs Posted */}
            <div className="flex flex-col justify-between p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <div>
                <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Jobs Posted</h2>
                <p className="text-3xl font-bold mt-1 text-gray-900">4</p>
              </div>
              {/* <p className="text-xs text-green-600 font-medium mt-2">3 currently active</p> */}
            </div>

            {/* Reports */}
            <div className="flex flex-col justify-between p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <div>
                <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Report Stats</h2>
                <p className="text-3xl font-bold mt-1 text-gray-900">4</p>
              </div>
              {/* <p className="text-xs text-red-500 font-medium mt-2">1 pending review</p> */}
            </div>

          </div>
        </section>


        {/* Job Approval Section */}
        <div className='py-10 px-2'>
          <div className='space-y-4'>
            <h3 className='text-2xl font-medium'>Jobs Approval</h3>
            <ul className='space-y-3  py-3 overflow-y-auto  bg-gray-50 rounded-xl border border-gray-100'>
              {
                jobs?.length > 0 ? (
                  jobs?.map(({ role, company, work_type, skills, _id, apply_link }, index) => (
                    <li key={index} className='bg-white border border-gray-200 shadow-sm flex md:flex-row space-y-3 flex-col items-center justify-between py-2 px-2 md:px-6 md:py-4 rounded-2xl max-w-6xl mx-auto hover:border-blue-200 transition-colors'>

                      {/* Left side*/}
                      <div className='flex items-center space-x-6 flex-1 min-w-0'>
                        <div className='min-w-37'>
                          <h4 className='text-gray-900 font-medium truncate'>{role}</h4>
                          <p className='text-xs text-gray-500'>{company}</p>
                        </div>

                        {/* Skills */}
                        <div className='hidden space-x-2 overflow-x-auto hide-scroll lg:flexflex-nowrap pb-1'>
                          {skills.map((skill, sIdx) => (
                            <span key={sIdx} className='whitespace-nowrap bg-slate-50 border border-slate-200 px-3 py-1 rounded-md text-[10px] text-slate-600'>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right side */}
                      <div className='flex items-center space-x-4 ml-4'>
                        <span className='hidden sm:block bg-blue-50 border border-blue-100 text-blue-600 rounded-full text-xs font-medium py-1 px-4'>
                          {work_type}
                        </span>
                        <a href={apply_link} target='_blank' className='text-gray-500 hover:text-blue-500'><Link /></a>
                        <button onClick={() => { handleReject(_id) }} className='text-sm font-medium text-gray-500 hover:text-red-600 transition-colors'>
                          Reject
                        </button>
                        <button onClick={() => { handleAccept(_id) }} className='bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full text-sm font-medium text-white transition-all shadow-sm'>
                          Accept
                        </button>
                      </div>
                    </li>
                  ))
                ) :
                  (
                    <div className='text-lg py-4 px-5 text-gray-500 text-center '>
                      <p>No Jobs Approval Pendings</p>
                    </div>
                  )
              }
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminPage
