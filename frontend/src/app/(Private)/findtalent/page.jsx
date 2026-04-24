"use client"
import React, { useEffect, useState } from 'react'
import Input from '@/Component/(Private)/Input';
import UserCard from '@/Component/(Private)/UserComponent';
import { useDebounce } from 'use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '@/feature/userSlice';
import { CardSkeleton} from '@/Component/(Private)/LoadingCom';
import { useAuth } from '@/Context/authContext';

const Page = () => {
  const [isActive, setActive] = useState("All");
  const [text, setText] = useState("");
  const { user } = useAuth();
  // Access redux
  const userData = useSelector((state) => state.userDatas.value) || [];
  const dispatch = useDispatch();
  const api_base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [loading, setLoading] = useState(false);

  //  Fetch Users
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/user`, { method: "GET", credentials: "include" });
        const result = await response.json();
        const data = await result.filter((data) => data._id !== user._id)
        dispatch(setUsers(data));
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    getUser();
  }, [dispatch, api_base_url]);

  const [debouncedValue] = useDebounce(text, 500);

  const handleSearch = (e) => {
    setText(e.target.value);
  };


  //  Filter Logic 
  const filteredUsers = userData.filter((user) => {
    const userSkills = user.skills || [];
    const username = user.username || "";

    const matchesCategory = isActive === "All" || userSkills.includes(isActive);

    const matchesSearch = debouncedValue
      ? username.toLowerCase().includes(debouncedValue.toLowerCase()) ||
      userSkills.some(skill => skill.toLowerCase().includes(debouncedValue.toLowerCase()))
      : true;

    return matchesCategory && matchesSearch;
  });

  const searchBtn = ["All", "UI/UX Design", "Data science", "Marketing", "Developer"];

  return (
    <>
      <title>Find User</title>
      <div className="bg-gray-100 min-h-screen pt-24 my-10 pb-10 px-4 md:px-12 lg:px-20 xl:px-40 animate-page-entry transition-all duration-300">
        <section id='finduser'>
          <div className='space-y-2 text-center md:text-left'>
            <div className='text-2xl md:text-3xl font-extrabold'>
              <h3>Discover <span className='text-blue-500'>Talent</span></h3>
            </div>
            <p className='max-w-2xl mx-auto md:mx-0 text-gray-600 text-sm md:text-base'>
              Connect with verified professionals to exchange high-value skills.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className='py-3 my-8 px-6 flex flex-col lg:flex-row gap-4 justify-between items-center bg-gray-400/10 rounded-2xl lg:rounded-full shadow-inner shadow-gray-200'>
            <div className='w-full lg:flex-1'>

              <Input
                type="search"
                placeholder="Search your interest skill"
                onChange={handleSearch}
                value={text}
              />
            </div>

            <div className='flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scroll'>
              {searchBtn.map((btn) => (
                <button
                  key={btn}
                  onClick={() => setActive(btn)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive === btn
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {loading ? (

              Array.from({ length: 4 }).map((_, index) => (

                <CardSkeleton key={index} />
              ))

            ) :

              filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <UserCard key={user._id || user.id} user={user} Loading={loading} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-gray-400 italic">No talent found matching these criteria.</p>
                </div>
              )

            }
          </div>

        </section >
      </div >
    </>
  )
}

export default Page;
