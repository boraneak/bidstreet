import session from 'express-session';
import { config } from 'config/index';

const expressSession = session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    sameSite: 'lax', // Prevents CSRF attacks; use 'strict' for stricter rules
    maxAge: config.cookieMaxAge,
  },
});
export default expressSession;
