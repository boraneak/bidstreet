import { Request } from 'express';

export interface ICSRFTokenRequest extends Request {
  csrfToken: () => string;
}
