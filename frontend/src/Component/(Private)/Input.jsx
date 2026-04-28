import { BiSearch } from "react-icons/bi";

const Input = ({ value }) => {
  return (
    <div className="w-full group">
      <div className="flex w-full focus-within:scale-[1.02] items-center rounded-3xl bg-gray-100 px-3 py-2 md:py-2.5 border-2 border-transparent focus-within:border-black/60 transition-all duration-300 ease-in-out shadow-sm">
        <BiSearch className="mr-2 text-xl md:text-2xl text-gray-600 shrink-0" />
        <input
          type={value.type}
          placeholder={value.placeholder}
          className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-500 text-base md:text-sm font-medium"
          onChange={value.onchange}
          value={value.value}
        />
      </div>
    </div>
  );
};

export default Input;
