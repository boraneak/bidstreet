import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
import { signup } from "../services/authAPI";

interface FormValues {
  name: string;
  password: string;
  email: string;
  open: boolean;
  error: string;
}

interface User {
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  let navigate = useNavigate();
  const [values, setValues] = useState<FormValues>({
    name: "",
    password: "",
    email: "",
    open: false,
    error: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    name: false,
    email: false,
    password: false,
  });

  const handleChange =
    (id: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues({ ...values, [id]: value });
      setErrors({ ...errors, [id]: value.trim() === "" });
    };

  const goToSignin = () => {
    navigate("/signin");
  };
  const onSignup = async () => {
    try {
      const user: User = {
        name: values.name || "",
        email: values.email || "",
        password: values.password || "",
      };
      await signup(user);
      setValues({ ...values, error: "", open: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setValues({
          ...values,
          error: error.response.data.error,
        });
      } else {
        setValues({ ...values, error: "sign up failed" });
      }
    }
  };
  const isFormValid = !(errors.name || errors.email || errors.password);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Card>
        <CardContent>
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            Sign Up
          </Typography>
          {["name", "email", "password"].map((id) => (
            <TextField
              key={id}
              id={id}
              label={
                id === "name" ? "Name" : id === "email" ? "Email" : "Password"
              }
              type={
                id === "email"
                  ? "email"
                  : id === "password"
                  ? "password"
                  : "text"
              }
              value={values[id as keyof FormValues]}
              onChange={handleChange(id)}
              margin="normal"
              fullWidth
              error={errors[id]}
              helperText={
                errors[id]
                  ? `${id.charAt(0).toUpperCase() + id.slice(1)} is required`
                  : ""
              }
            />
          ))}
          {values.error && (
            <Typography color="error" style={{ verticalAlign: "middle" }}>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Box display="flex" justifyContent="center" width="100%">
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={onSignup}
              disabled={!isFormValid}
            >
              create account
            </Button>
          </Box>
        </CardActions>
        <Typography
          align="center"
          style={{ cursor: "pointer", color: "blue" }}
          onClick={goToSignin}
        >
          Already have an account?
        </Typography>
      </Card>
      <Dialog open={values.open}>
        <DialogTitle>Account Created</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your new account has been successfully created. Click 'Sign In'
            below to get started.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Typography style={{ cursor: "pointer", color: "blue" }}>
            <Button
              style={{ textTransform: "none" }}
              color="primary"
              variant="contained"
              fullWidth
              onClick={goToSignin}
            >
              Sign In
            </Button>
          </Typography>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Signup;
