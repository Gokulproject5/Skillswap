import { useState } from "react";
import {database} from '@/Data/skillSet'


const SkillSelector = ({ label, placeholder, selectedSkills, onAdd, onRemove, color,  }) => {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col space-y-2 relative">
      <label className="uppercase text-[12px] font-bold text-gray-500">{label}</label>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className={`w-full outline-none shadow-sm p-3 ring-gray-100 rounded-md ring-2 focus:ring-${color}-500`}
      />
      {search && (
        <div className="absolute top-18.5 w-full bg-white border border-gray-100 shadow-xl rounded-md z-30 max-h-32 overflow-y-auto">
          {database.filter(s => s.toLowerCase().includes(search.toLowerCase())).map(skill => (
            <div key={skill} onClick={() => { onAdd(skill); setSearch(""); }} className={`p-2 hover:bg-${color}-50 cursor-pointer text-sm font-medium`}>
               {skill}
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedSkills?.map(skill => (
          <span key={skill} className={`bg-${color}-50 text-${color}-700 px-3 py-1 rounded-full text-xs border border-${color}-200 font-bold flex items-center gap-1`}>
            {skill} <button type="button" onClick={() => onRemove(skill)} className="hover:text-red-500">×</button>
          </span>
        ))}
      </div>
    </div>
  );
};


export  default SkillSelector