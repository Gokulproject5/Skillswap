"use client";
import Input from "@/Component/(Private)/Input";
import { XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from "react-redux";
import { setJobs } from "@/feature/jobSlice";
import toast from 'react-hot-toast';

const Page = () => {
  const [Active, SetActive] = useState("All");
  const dialogRef = useRef(null);
  const jobs = useSelector((state) => state.jobs.value);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const api_base_url = process.env.NEXT_PUBLIC_API_BASE_URL
  const Type = ["All", "Remote", "On-site", "Hybrid"];


  // handle filter 
  const filteredJobs = jobs?.filter((job) => {
    const matchesStatus = Active === "All" || !Active || job.work_type === Active;
    const matchesSearch = search
      ? job.role.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.toString().toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  // handle dialog box
  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  //  get data from data base 
  useEffect(() => {

    const fetchData = async () => {

      try {
        const response = await fetch(`${api_base_url}/job_post`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        })
        const result = await response.json();

        dispatch(setJobs(result.data));
      } catch (err) {
        console.error("Internal server error"
        )

      }
    }
    fetchData();
  }, [dispatch])

  // post job handler
  const onSubmit = async (data) => {
    const skills = data.skills.split(",").map(s => s.trim());
    const Data = { ...data, skills };

    try {
      const res = await fetch(`${api_base_url}/job_post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Data),
        credentials: "include"
      });

      if (res.ok) {

        toast.success("Job created successfully!");
        close();
        const updatedResponse = await fetch(`${api_base_url}/job_post`);
        const result = await updatedResponse.json();
        dispatch(setJobs(result.data));
      } else {

        const errorData = await res.json();

        toast.error(`Failed to post: ${errorData.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Internal frontend error:", err);
      toast.error("Internal server error occurred while posting.");
    }
  };


  const handleSearch = (e) => setSearch(e.target.value);

  const inputConfig = {
    type: "text",
    placeholder: "Search job role, company...",
    onchange: handleSearch,
  };

  return (
    <section className="min-h-screen py-10 mt-20 transition-all duration-300 ease-in-out bg-gray-100 px-4 md:px-12 lg:px-24 xl:px-40 animate-page-entry">

      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl text-blue-600 font-bold">Opportunities</h1>
        <button
          onClick={open}
          className="w-full sm:w-auto rounded-full space-x-2 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 py-3 px-8 bg-blue-600 active:scale-95 transition-all duration-300"
        >
          <BiPlus className="font-bold text-2xl" />
          <span className="font-semibold">Post Job</span>
        </button>
      </div>

      {/* Dialog box for post */}
      <dialog
        ref={dialogRef}
        className="w-[95%] md:w-full mx-auto my-auto max-w-2xl rounded-2xl p-0 overflow-hidden shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm outline-none"
      >
        <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-gray-100 bg-white">
          <div>
            <h1 className="text-xl font-bold text-blue-600">Post New Job</h1>
            <p className="text-sm text-gray-500">Add a new expertise opportunity.</p>
          </div>
          <button onClick={close} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 bg-white text-gray-800 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Form Fields */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Job Role</label>
              <input {...register("role", { required: "Required" })} placeholder="e.g. React Dev" className="rounded-xl border border-gray-200 p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Company</label>
              <input {...register("company", { required: "Required" })} placeholder="Company name" className="rounded-xl border border-gray-200 p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Work Type</label>
              <select {...register("work_type")} className="rounded-xl border text-gray-400 border-gray-200 p-3 bg-gray-50 outline-none cursor-pointer">
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tech Stack</label>
              <input {...register("skills")} placeholder="React, Node, etc." className="rounded-xl border border-gray-200 p-3 bg-gray-50 outline-none" />
            </div>
            <div className="flex flex-col md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Apply Link</label>
              <input {...register("apply_link")} placeholder="https://..." className="rounded-xl border border-gray-200 p-3 bg-gray-50 outline-none" />
            </div>
            <div className="md:col-span-2 flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</label>
              <textarea {...register("job_description")} rows={3} className="rounded-xl border border-gray-200 p-3 bg-gray-50 outline-none resize-none" />
            </div>
          </div>
          <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button type="button" onClick={close} className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-200 transition-all">{isSubmitting ? "Posting..." : "Post Opportunity"}</button>
          </div>
        </form>
      </dialog>

      {/* Filter Section */}
      <div className="my-6 rounded-2xl  lg:rounded-full px-4 py-3 bg-gray-200 shadow-inner">
        <div className="flex flex-col  lg:flex-row gap-4 justify-between items-center">
          <div className="w-full lg:max-w-md">
            <Input value={inputConfig} />
          </div>
          <div className="flex gap-2  w-full overflow-x-auto lg:w-auto pb-2 lg:pb-0 hide-scroll">
            {Type.map((loc, index) => (
              <button
                key={index}
                onClick={() => SetActive(loc)}
                className={`text-xs whitespace-nowrap border rounded-full px-5 py-2 transition-all duration-200 font-bold tracking-wider uppercase
                    ${Active === loc ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-gray-500 border-gray-200"}`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredJobs?.length > 0 ? (
          filteredJobs?.map((job, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-xl p-6 md:p-8 border border-gray-100 transition-all group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-800 transition-colors">{job.role}</h2>
                  <p className="text-blue-600 font-bold text-sm tracking-tight">{job.company}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-fit bg-blue-50 text-blue-600 font-bold rounded-lg py-1.5 px-4 text-[10px] uppercase tracking-widest border border-blue-100">
                    {job.created_at}
                  </div>
                  <div className="w-fit bg-blue-50 text-blue-600 font-bold rounded-lg py-1.5 px-4 text-[10px] uppercase tracking-widest border border-blue-100">

                    {job.work_type}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 md:line-clamp-none">{job.job_description}</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-8 gap-6">
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="bg-gray-50 text-[10px] font-bold text-gray-500 px-3 py-1.5 rounded-md border border-gray-200 uppercase tracking-tighter">{skill}</span>
                  ))}
                </div>
                <a href={job.apply_link} target="_blank" className="w-full sm:w-auto text-center py-3 px-10 text-white font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 rounded-xl transition-all active:scale-95">Apply Now</a>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 text-gray-400 italic">No opportunities match your filter.</div>
        )}
      </div>


    </section>
  );
};

export default Page;
