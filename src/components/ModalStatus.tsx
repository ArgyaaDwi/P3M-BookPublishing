"use client";
import React, { useState } from "react";
import { Pencil } from "lucide-react";
const ModalStatus = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        className="bg-yellow-100 p-2 rounded-lg text-yellow-500 hover:text-yellow-800 flex gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Pencil />
        Ubah Status
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8">
            <div className="flex items-center justify-between border-b border-gray-300 pb-3">
              <h3 className="text-2xl font-semibold text-gray-900 text-center">
                Update Status Ajuan Proposal
              </h3>
              <button
                className="text-gray-400 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                ✖
              </button>
            </div>
            <form className="mt-4">
              <div className="mb-3">
                <label className="block text-sm font-medium text-black pb-1">
                  Status Sekarang
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-400 p-3 rounded-xl text-black"
                  placeholder="Masukkan Status Sekarang"
                  disabled
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-black pb-1">
                  Status
                </label>
                <select className="w-full border border-gray-400 p-3 rounded-xl text-black text-center">
                  <option>.:: Pilih Status ::.</option>
                  <option value="TV">Revisi dari Admin</option>
                  <option value="PC">Approve dari Admin</option>
                </select>
              </div>
              <div className="mb-1">
                <label className="block text-sm font-medium text-black pb-1">
                  Catatan
                </label>
                <textarea
                  className="w-full border border-gray-400 p-3 rounded-xl text-black    "
                  placeholder="Masukkan Catatan Keterangan yang Diinginkan"
                  rows={4}
                ></textarea>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-black pb-1">
                  Link URL Pendukung
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-400 p-3 rounded-xl text-black"
                  placeholder="Type product name"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="bg-primary font-semibold px-3 py-2 rounded-lg text-white">
                  Simpan
                </button>
                <button
                  type="button"
                  className="bg-white border font-semibold border-red-600 px-3 py-2 rounded-lg text-red-600"
                  onClick={() => setIsOpen(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalStatus;
