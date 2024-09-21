import React, { useState } from 'react';
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
  card: { width: 300, padding: 2 },
  title: { fontWeight: 'bold', marginBottom: 2 },
  link: { cursor: 'pointer', textAlign: 'center', color: 'primary.main' },
  dialogActions: { display: 'flex', justifyContent: 'flex-end' },
};

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<SignUpData>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<SignUpData>>({});
  const [apiError, setApiError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange =
    (id: keyof SignUpData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues((prev) => ({ ...prev, [id]: value }));
      setErrors((prev) => ({
        ...prev,
        [id]: value.trim() ? '' : `${id} is required`,
      }));
    };

  const onSignup = async () => {
    const newErrors = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        value.trim() ? '' : `${key} is required`,
      ]),
    );
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    try {
      await AuthService.signUp(values);
      setApiError('');
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error signing up:', error);
      setApiError(
        error instanceof Error
          ? error.message || 'Sign-up failed'
          : 'An unexpected error occurred',
      );
    }
  };

  const navigateToSignIn = () => navigate('/signin');

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
            onClick={onSignup}
            disabled={Object.values(errors).some(Boolean)}
          >
            Create Account
          </Button>
        </CardActions>
        <Box sx={{ mt: 2 }}>
          <Typography sx={useStyles.link} onClick={navigateToSignIn}>
            Already have an account?
          </Typography>
        </Box>
      </Card>
      <Dialog open={isDialogOpen} onClose={navigateToSignIn}>
        <DialogTitle>Sign Up Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have successfully signed up! Please log in to continue.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={useStyles.dialogActions}>
          <Button onClick={navigateToSignIn} color="primary">
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SignUpForm;
