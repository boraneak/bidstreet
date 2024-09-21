import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInData } from '../../types/SignInData';
import {
  Card,
  CardContent,
  TextField,
  Typography,
  CardActions,
  Button,
  Box,
} from '@mui/material';
import { auth } from '../../utils/auth';
import AuthService from '../../API/authAPI';

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

const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<SignInData>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<SignInData>>({});
  const [apiError, setApiError] = useState('');

  const handleChange =
    (id: keyof SignInData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues((prev) => ({ ...prev, [id]: value }));
      setErrors((prev) => ({
        ...prev,
        [id]: value.trim() ? '' : `${id} is required`,
      }));
    };

  const onSignin = async () => {
    const newErrors = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        value.trim() ? '' : `${key} is required`,
      ]),
    );
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    try {
      const response = await AuthService.signIn(values);
      auth.authenticate(response, () => setApiError(''));
      navigate('/home');
    } catch (error) {
      console.error('Error signing in:', error);
      setApiError(
        error instanceof Error
          ? error.message || 'Sign-in failed'
          : 'An unexpected error occurred',
      );
    }
  };

  return (
    <Box sx={useStyles.container}>
      <Card sx={useStyles.card}>
        <CardContent>
          <Typography variant="h5" sx={useStyles.title}>
            Sign In
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
          {apiError && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {apiError}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={onSignin}
            disabled={Object.values(errors).some(Boolean)}
          >
            Login
          </Button>
        </CardActions>
        <Box sx={{ mt: 2 }}>
          <Typography
            sx={{ ...useStyles.link, color: 'primary.main' }}
            onClick={() => navigate('/signup')}
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

export default SignInForm;
