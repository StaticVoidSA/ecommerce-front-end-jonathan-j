import { User } from "../user.model";

export interface UserUpdate {
  firstName: string;
  surname: string;
  email: string;
  _email: string;
  userRole: string;
}