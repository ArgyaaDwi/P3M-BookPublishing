"use client";
import { useState } from "react";

export default function UploadCoverCloudinary({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "p3m-book");

    setLoading(true);
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dpr1oftgx/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      const url = data.secure_url;
      setPreview(url);
      onUpload(url);
    } catch (err) {
      console.error("Upload gagal:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-3">
      <label className="block font-medium text-black pb-1">
        Upload Cover Buku <span className="text-red-500">*</span>
      </label>
      <input type="file" accept="image/*" onChange={handleUpload} />

      {loading && <p className="text-sm text-gray-500">Uploading...</p>}
      {preview && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-48 object-cover mt-2 rounded border"
          />
        </>
      )}
    </div>
  );
}
