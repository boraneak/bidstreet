import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { SignUpFormValues } from "../../types/SignUpFormValues";
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
} from "@mui/material";
import AuthService, { SignUpData } from "../../API/authAPI";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<SignUpFormValues>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    name: "",
    email: "",
    password: "",
  });
  const [apiError, setApiError] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange =
    (id: keyof SignUpFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues({ ...values, [id]: value });
      setErrors({
        ...errors,
        [id]: value.trim() === "" ? `${id} is required` : "",
      });
    };

  const navigateToSignIn = () => {
    navigate("/signin");
  };

  const isValidateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    Object.keys(values).forEach((key) => {
      if (values[key as keyof SignUpFormValues].trim() === "") {
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
      setApiError("");
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error signing up:", error);
      if (error instanceof Error) {
        setApiError(error.message || "Sign-up failed");
      } else {
        setApiError("An unexpected error occurred");
      }
    }
  };

  const isFormValid = !Object.values(errors).some((error) => error !== "");

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Card sx={{ width: 300, padding: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Sign Up
          </Typography>
          {(["name", "email", "password"] as const).map((id) => (
            <TextField
              key={id}
              id={id}
              label={id.charAt(0).toUpperCase() + id.slice(1)}
              type={id === "password" ? "password" : "text"}
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
            disabled={!isFormValid}
          >
            Create Account
          </Button>
        </CardActions>
        <Box sx={{ mt: 2 }}>
          <Typography
            align="center"
            sx={{ cursor: "pointer", color: "primary.main" }}
            onClick={navigateToSignIn}
          >
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
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={navigateToSignIn}
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Signup;
