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
import { signup } from "../services/auth-api";

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
  const [nameError, setNameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const handleChange =
    (id: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues({ ...values, [id]: value });
      switch (id) {
        case "name":
          setNameError(value.trim() === "");
          break;
        case "email":
          setEmailError(value.trim() === "");
          break;
        case "password":
          setPasswordError(value.trim() === "");
          break;
        default:
          break;
      }
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
  const isFormValid = !(nameError || emailError || passwordError);

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
          <TextField
            id="name"
            label="Name"
            type="text"
            value={values.name}
            onChange={handleChange("name")}
            margin="normal"
            fullWidth
            error={nameError}
            helperText={nameError ? "Name is required" : ""}
          />
          <TextField
            id="email"
            type="email"
            label="Email"
            value={values.email}
            onChange={handleChange("email")}
            margin="normal"
            fullWidth
            error={emailError}
            helperText={emailError ? "Email is required" : ""}
          />
          <TextField
            id="password"
            type="password"
            label="Password"
            value={values.password}
            onChange={handleChange("password")}
            margin="normal"
            fullWidth
            error={passwordError}
            helperText={passwordError ? "Password is required" : ""}
          />
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
          already have an account?
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
