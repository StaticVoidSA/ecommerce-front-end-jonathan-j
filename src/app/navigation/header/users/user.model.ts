export interface User {
  firstName: string;
  surname: string;
  email: string;
  password: string;
  doj: Date;
  userRole: string;
  loggedIn: boolean;
}
