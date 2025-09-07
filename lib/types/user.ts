import { UserRole } from "../api/users";

export interface User {
  id: number;
  name: string | null;
  email: string ;
  phone: string | null;
  password: string;
  role: UserRole
  createdAt: string;
}