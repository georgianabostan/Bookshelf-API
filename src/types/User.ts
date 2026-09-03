export interface User {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
}

export interface UserWithPassword extends User {
  password: string;
}