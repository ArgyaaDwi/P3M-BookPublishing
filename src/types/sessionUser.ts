// export type SessionUser = {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
//   nidn: string | null;
//   address: string | null;
//   phone_number: string | null;
// };

import { User, user_role } from "./interfaces";
export interface SessionUser {
  id: User["id"];
  name: User["name"];
  email: User["email"];
  role: user_role;
  nidn?: User["nidn"];
  address?: User["address"];
  phone_number?: User["phone_number"];
  createdAt: User["createdAt"];
  updatedAt: User["updatedAt"];
}
