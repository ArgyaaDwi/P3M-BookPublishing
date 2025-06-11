"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
interface SelectProps {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  isRequired?: boolean;
}

const Select = ({
  label,
  options,
  placeholder = "Pilih...",
  onChange,
  value,
  isRequired = false,
}: SelectProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleOptionClick = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="w-full mb-3 relative">
      <h3 className="text-black text-base self-start font-normal mb-1">
        {label} {isRequired && <span className="text-red-500 ml-1">*</span>}{" "}
      </h3>
      <div
        className="flex items-center border bg-inputColor text-black border-borderInput rounded-xl focus-within:border-black transition duration-300 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 p-3 flex items-center justify-center">
          <span className="text-black">
            {value
              ? options.find((o) => o.value === value)?.label
              : placeholder}
          </span>
        </div>
        <div className="p-3 text-gray-600">
          {isOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-[100] bg-white border border-borderInput rounded-xl w-full mt-1 shadow-lg">
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="p-2 w-full border text-black border-borderInput rounded-lg outline-none focus-within:border-black transition duration-300"
            />
          </div>
          <ul className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className="px-5  py-2 hover:bg-indigo-50 cursor-pointer text-black"
                  onClick={() => handleOptionClick(option.value)}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="p-2 text-black text-center">
                Data Tidak Ditemukan
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
