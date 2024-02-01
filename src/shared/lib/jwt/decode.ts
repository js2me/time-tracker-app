import { jwtDecode } from 'jwt-decode';

export const decode = <T extends AnyObject = AnyObject>(token: string): T => {
  return jwtDecode(token);
};
