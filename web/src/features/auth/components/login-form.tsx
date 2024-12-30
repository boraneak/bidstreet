import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  TextField,
  Typography,
  CardActions,
  Button,
  Box,
} from '@mui/material';
import { auth } from '@/utils/auth';
import { LoginData } from '@/types';
import { login } from '../api/login';

const useStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  card: { width: 300, padding: 2 },
  title: { fontWeight: 'bold', marginBottom: 2 },
  link: { cursor: 'pointer', textAlign: 'center' },
};

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<LoginData>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<LoginData>>({});

  const handleChange =
    (id: keyof LoginData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues((prev) => ({ ...prev, [id]: value }));
      setErrors((prev) => ({
        ...prev,
        [id]: value.trim() ? '' : `${id} is required`,
      }));
    };

  const onLogin = async () => {
    const newErrors = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        value.trim() ? '' : `${key} is required`,
      ]),
    );
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    try {
      const response = await login(values);
      auth.authenticate(response, () => navigate('/home'));
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  return (
    <Box sx={useStyles.container}>
      <Card sx={useStyles.card}>
        <CardContent>
          <Typography variant="h5" sx={useStyles.title}>
            Log in
          </Typography>
          {(['email', 'password'] as const).map((id) => (
            <TextField
              key={id}
              label={id.charAt(0).toUpperCase() + id.slice(1)}
              type={id}
              value={values[id]}
              onChange={handleChange(id)}
              margin="normal"
              fullWidth
              error={!!errors[id]}
              helperText={errors[id]}
            />
          ))}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={onLogin}
            disabled={Object.values(errors).some(Boolean)}
          >
            Login
          </Button>
        </CardActions>
        <Box sx={{ mt: 2 }}>
          <Typography
            sx={{ ...useStyles.link, color: 'primary.main' }}
            onClick={() => navigate('/register')}
          >
            Don't have an account?
          </Typography>
          <Typography
            sx={{ ...useStyles.link, color: 'text.secondary', mt: 1 }}
          >
            Forgot password?
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};
