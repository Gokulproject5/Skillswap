"use client";
import { useAuth } from "@/Context/authContext";
import { UserPlus2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";


const Connection = () => {
    const { user } = useAuth()
    const usersData = useSelector((state) => state.userDatas?.value) || [];

    const filterData = useMemo(() => {

        return usersData.filter((users) => user.connection.includes(users._id));

    }, [user, usersData]);


    return (
        <div className="space-y-1 py-5 h-full  ">

            {filterData.length > 0 ? (
                filterData.map((user) => (
                    <div
                        key={user._id}
                        className="w-full border-b border-gray-100 bg-white px-5 py-4 flex items-center gap-4 shadow-sm rounded-lg"
                    >
                        <div className="relative shrink-0 w-14 h-14 rounded-full overflow-hidden shadow-md border border-gray-200">
                            <Image
                                src={user.profile_pic || "/fallback.jpg"}
                                fill
                                className="object-cover"
                                alt={user.name}
                                sizes="80px"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 items-center w-full gap-4">
                            {/* Name and Title */}
                            <div className="flex flex-col">
                                <p className="font-semibold text-gray-900 leading-tight">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate max-w-50">
                                    {user.exp || "No experience listed"}
                                </p>
                            </div>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-2 justify-start">
                                {user.skills?.slice(0, 2).map((skill, index) => (
                                    <span
                                        key={index}
                                        className="text-[10px] px-3 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* Action */}
                            <div className="flex justify-end items-center">
                                <Link
                                    href={`/findtalent/${user.slug}`}
                                    className="text-blue-600 text-sm font-bold hover:underline"
                                >
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col justify-center items-center h-64 w-full text-gray-400">
                    <UserPlus2 className="size-12 mb-3 opacity-20" />
                    <p className="font-medium">No Connections Yet</p>
                    <Link
                        href="/findtalent"
                        className="text-sm text-blue-500 hover:underline mt-2"
                    >
                        Find and connect with talent
                    </Link>
                </div>
            )}
        </div>
    );
};


export const Count = () => {
    const { user } = useAuth()
    const connectionCount = user?.connection.length || 0

    return (
        <div className="text-sm  font-medium bg-blue-600 rounded py-1 px-2 text-white shadow-md shadow-blue-500/50">
            <span>{connectionCount} {connectionCount === 1 ? 'Connection' : 'Connections'}</span>
        </div>
    );
}
export default Connection;
