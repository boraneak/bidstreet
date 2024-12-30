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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { RegisterData } from '@/types';
import { register } from '../api/register';

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

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterData>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange =
    (id: keyof RegisterData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues((prev) => ({ ...prev, [id]: value }));
      setErrors((prev) => ({
        ...prev,
        [id]: value.trim() ? '' : `${id} is required`,
      }));
    };

  const onRegister = async () => {
    const newErrors = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        value.trim() ? '' : `${key} is required`,
      ]),
    );
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    try {
      await register(values);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  const navigateToSignIn = () => navigate('/login');

  return (
    <Box sx={useStyles.container}>
      <Card sx={useStyles.card}>
        <CardContent>
          <Typography variant="h5" sx={useStyles.title}>
            Register
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
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={onRegister}
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
      {/* <Dialog open={isDialogOpen} onClose={navigateToSignIn}>
        <DialogTitle>Registration Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have successfully registered! Please log in to continue.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={useStyles.dialogActions}>
          <Button onClick={navigateToSignIn} color="primary">
            Sign In
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
};
