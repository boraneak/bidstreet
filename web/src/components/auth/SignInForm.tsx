import React, { useState, ChangeEvent } from 'react';
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
import { isFormValid } from '../../utils/isFormValid';
import AuthService from '../../API/authAPI';

const useStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  card: {
    width: 300,
    padding: 2,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  apiError: {
    marginTop: 2,
  },
  signUpLink: {
    cursor: 'pointer',
    color: 'primary.main',
    textAlign: 'center',
  },
  forgotPasswordLink: {
    cursor: 'pointer',
    color: 'text.secondary',
    textAlign: 'center',
    marginTop: 1,
  },
};

const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<SignInData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    email: '',
    password: '',
  });
  const [apiError, setApiError] = useState<string>('');

  const handleChange =
    (id: keyof SignInData) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues({ ...values, [id]: value });
      setErrors({
        ...errors,
        [id]: value.trim() === '' ? `${id} is required` : '',
      });
    };

  const navigateToSignUp = () => {
    navigate('/signup');
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    Object.keys(values).forEach((key) => {
      if (values[key as keyof SignInData].trim() === '') {
        newErrors[key] = `${key} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const onSignin = async () => {
    if (!validateForm()) return;

    const signInData: SignInData = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await AuthService.signIn(signInData);
      auth.authenticate(response, () => {
        setApiError('');
      });

      navigate('/home');
    } catch (error) {
      console.error('Error signing in:', error);
      if (error instanceof Error) {
        setApiError(error.message || 'Sign-in failed');
      } else {
        setApiError('An unexpected error occurred');
      }
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
              label={id === 'email' ? 'Email' : 'Password'}
              id={id}
              type={id === 'password' ? 'password' : 'email'}
              value={values[id]}
              onChange={handleChange(id)}
              margin="normal"
              fullWidth
              error={!!errors[id]}
              helperText={errors[id]}
            />
          ))}
          {apiError && (
            <Typography color="error" align="center" sx={useStyles.apiError}>
              {apiError}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            disabled={!isFormValid}
            onClick={onSignin}
          >
            Login
          </Button>
        </CardActions>
        <Box sx={{ mt: 2 }}>
          <Typography sx={useStyles.signUpLink} onClick={navigateToSignUp}>
            Don't have an account?
          </Typography>
          <Typography sx={useStyles.forgotPasswordLink}>
            Forgot password?
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default SignInForm;
