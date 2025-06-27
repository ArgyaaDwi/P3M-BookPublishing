"use client";

import React from "react";

interface InputProps {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = ({ label, placeholder, value, onChange }: InputProps) => {
  return (
    <div className="w-full mb-3">
      <h3 className="text-black text-base self-start font-normal mb-1">
        {label}
      </h3>
      <div className="flex items-center border bg-inputColor text-black border-borderInput rounded-xl focus-within:border-black transition duration-300">
        <textarea
          placeholder={placeholder}
          className="p-3 flex-1 bg-transparent outline-none resize-none"
          rows={4}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default TextArea;
