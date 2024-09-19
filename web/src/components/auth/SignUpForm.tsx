import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignUpData } from '../../types/SignUpData';
import {
  Card,
  CardContent,
  TextField,
  Typography,
  CardActions,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
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
  signInLink: {
    cursor: 'pointer',
    color: 'primary.main',
    textAlign: 'center',
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<SignUpData>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    name: '',
    email: '',
    password: '',
  });
  const [apiError, setApiError] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange =
    (id: keyof SignUpData) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues({ ...values, [id]: value });
      setErrors({
        ...errors,
        [id]: value.trim() === '' ? `${id} is required` : '',
      });
    };

  const navigateToSignIn = () => {
    navigate('/signin');
  };

  const isValidateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    Object.keys(values).forEach((key) => {
      if (values[key as keyof SignUpData].trim() === '') {
        newErrors[key] = `${key} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const onSignup = async () => {
    if (!isValidateForm()) return;

    const signUpData: SignUpData = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    try {
      await AuthService.signUp(signUpData);
      setApiError('');
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error signing up:', error);
      if (error instanceof Error) {
        setApiError(error.message || 'Sign-up failed');
      } else {
        setApiError('An unexpected error occurred');
      }
    }
  };

  const isFormValid = !Object.values(errors).some((error) => error !== '');

  return (
    <Box sx={useStyles.container}>
      <Card sx={useStyles.card}>
        <CardContent>
          <Typography variant="h5" sx={useStyles.title}>
            Sign Up
          </Typography>
          {(['name', 'email', 'password'] as const).map((id) => (
            <TextField
              key={id}
              id={id}
              label={id.charAt(0).toUpperCase() + id.slice(1)}
              type={id === 'password' ? 'password' : 'text'}
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
            onClick={onSignup}
            disabled={!isFormValid}
          >
            Create Account
          </Button>
        </CardActions>
        <Box sx={{ mt: 2 }}>
          <Typography sx={useStyles.signInLink} onClick={navigateToSignIn}>
            Already have an account?
          </Typography>
        </Box>
      </Card>
      <Dialog open={isDialogOpen} onClose={navigateToSignIn}>
        <DialogTitle>Account Created</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your new account has been successfully created. Click 'Sign In'
            below to get started.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={useStyles.dialogActions}>
          <Button
            color="primary"
            variant="contained"
            onClick={navigateToSignIn}
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SignUpForm;
