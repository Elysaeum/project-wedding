import { Wedding } from "./Wedding";

export enum Role {
  Admin = 'admin',
  User = 'user'
}


export interface User {
  id: string;
    name: {
      firstname: string;
      lastname: string;
    };
    email: string;
    liked_weddings: string[];
    reserved_weddings: string[];
    role: Role;
  }