export type Lecturer = {
  id: number;
  name: string;
  email: string;
  phone_number: number;
  major: {
    major_name: string;
  };
  nidn: string | null;
  username: string;
  createdAt: string;
  updatedAt: string;
  address: string;
};
