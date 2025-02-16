"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps {
  label: string;
  type: string;
  placeholder: string;
  isPassword?: boolean;
  value?: string; // Tambahkan properti value
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Tambahkan properti onChange
}

const Input = ({
  label,
  type,
  placeholder,
  isPassword = false,
  value,
  onChange,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="w-full mb-3">
      <h3 className="text-black text-base self-start font-normal mb-1">
        {label}
      </h3>
      <div className="flex items-center border bg-inputColor text-black border-borderInput rounded-xl focus-within:border-black transition duration-300">
        <input
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          className="p-3 flex-1 bg-transparent outline-none"
          value={value} // Tambahkan value ke input
          onChange={onChange} // Tambahkan onChange ke input
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="p-3 text-gray-600"
          >
            {showPassword ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
