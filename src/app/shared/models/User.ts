import { Wedding } from "./Wedding";

export enum Role {
  Admin = 'admin',
  User = 'user'
}


export interface User {
    name: {
      firstname: string;
      lastname: string;
    };
    email: string;
    password: string;
    liked_weddings: Wedding[];
    reserved_weddings: Wedding[];
    role: Role;
  }