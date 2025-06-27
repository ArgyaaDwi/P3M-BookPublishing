"use client";

import Link from "next/link";
import { ReactNode } from "react";

type CreateButtonProps = {
  href: string;
  children: ReactNode;
};

export default function CreateButton({ href, children }: CreateButtonProps) {
  return (
    <Link href={href}>
      <button className="bg-primary text-white px-3 py-2 font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200">
        {children}
      </button>
    </Link>
  );
}
