// "use client";
// import { useRef } from "react";

// type UploadProps = {
//   onUpload: (url: string) => void;
// };

// const UploadCoverCloudinaryOptional = ({ onUpload }: UploadProps) => {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "p3m-book"); // Ganti sesuai preset

//     const res = await fetch(
//       "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     const data = await res.json();
//     if (data.secure_url) {
//       onUpload(data.secure_url);
//     }
//   };

//   return (
//     <>
//       <button
//         type="button"
//         onClick={() => fileInputRef.current?.click()}
//         className="px-3 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200"
//       >
//         Unggah Ulang Cover (Opsional)
//       </button>
//       <input
//         type="file"
//         accept="image/*"
//         ref={fileInputRef}
//         className="hidden"
//         onChange={handleUpload}
//       />
//     </>
//   );
// };

// export default UploadCoverCloudinaryOptional;
"use client";
import { useRef, useState } from "react";

type UploadProps = {
  onUpload: (url: string) => void;
};

const UploadCoverCloudinaryOptional = ({ onUpload }: UploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "p3m-book");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (data.secure_url) {
      setPreviewUrl(data.secure_url);
      onUpload(data.secure_url);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-3 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200"
      >
        Unggah Ulang Cover (Opsional)
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleUpload}
      />
      {previewUrl && (
        <div className="w-[150px] h-auto rounded-lg overflow-hidden border">
          <p>Preview</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Preview Baru"
            className="w-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default UploadCoverCloudinaryOptional;
