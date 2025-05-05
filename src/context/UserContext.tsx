"use client";

import { createContext, useContext } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  phone_number: string;
  address: string;
  createdAt: string;
  nidn: string;
  updatedAt: string;
} | null;

const UserContext = createContext<User>(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: User;
}) => {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
