export interface AuthRespData {
  token: string;
  userId: number;
  userName: string;
  expiresIn: string;
  loggedIn: boolean;
  userRole: string;
  success: string;
}
