// di lib/types.ts (atau file lain)
export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  nidn: string | null;
  address: string | null;
  phone_number: string | null; // string di sini supaya bisa masuk ke JWT
};
