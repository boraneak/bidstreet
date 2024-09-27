import { Request, Response } from 'express';
import { ICSRFTokenRequest } from 'interfaces/requests/CSRFTokenRequest';

export const getCsrfToken = (req: Request, res: Response) => {
  const csrfToken = (req as ICSRFTokenRequest).csrfToken();
  res.json({ csrfToken });
};
