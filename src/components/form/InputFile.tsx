import React, { useState } from "react";

interface InputFileProps {
  label: string;
  placeholder: string;
}

const InputFile = ({ label, placeholder }: InputFileProps) => {
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="w-full mb-3">
      <h3 className="text-black text-base self-start font-normal mb-1">
        {label}
      </h3>
      <div className="flex items-center border bg-inputColor text-black border-borderInput rounded-xl focus-within:border-black transition duration-300">
        <label
          htmlFor="file-upload"
          className="flex-shrink-0 px-4 py-3 bg-blue-100 text-gray-600 font-medium rounded-l-xl cursor-pointer hover:bg-blue-300 transition duration-300"
        >
          Pilih File
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="flex-1 px-4 py-2 text-gray-400 truncate">
          {fileName || placeholder}
        </span>
      </div>
      <h3 className="text-black text-sm self-start font-extralight mt-1">
        Format PDF, Max 5MB
      </h3>
    </div>
  );
};

export default InputFile;
