import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";

import {
  Card,
  CardContent,
  TextField,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import { signin } from "../services/auth-api";
import { auth } from "../../utils/auth";

interface FormValues {
  email: string;
  password: string;
  error: string;
}

interface User {
  email: string;
  password: string;
}

const Signin: React.FC = () => {
  let navigate = useNavigate();
  const [values, setValues] = useState<FormValues>({
    email: "",
    password: "",
    error: "",
  });
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setValues({ ...values, [id]: value });
    id === "email"
      ? setEmailError(value.trim() === "")
      : setPasswordError(value.trim() === "");
  };

  const goToSignup = () => {
    navigate("/signup");
  };

  const onSignin = async () => {
    if (!values.email || !values.password) {
      setValues({ ...values, error: "email and password are required" });
      return;
    }
    const user: User = {
      email: values.email || "",
      password: values.password || "",
    };
    try {
      const response: AxiosResponse<any, any> = await signin(user);
      auth.authenticate(response, () => {
        setValues({ ...values, error: "" });
      });
      // go home
      navigate("/home");
    } catch (error) {
      console.error("signin error:", error);
      if (axios.isAxiosError(error) && error.response) {
        setValues({
          ...values,
          error: error.response.data.error || "signin failed",
        });
      } else {
        setValues({ ...values, error: "signin failed" });
      }
    }
  };
  const isFormValid = !(emailError || passwordError);
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
            Sign In
          </Typography>
          <TextField
            id="email"
            label="Email"
            type="email"
            value={values.email}
            onChange={handleChange}
            margin="normal"
            fullWidth
            error={emailError}
            helperText={emailError ? "Email is required" : ""}
          />
          <TextField
            id="password"
            label="Password"
            value={values.password}
            type="password"
            margin="normal"
            onChange={handleChange}
            fullWidth
            error={passwordError}
            helperText={passwordError ? "Password is required" : ""}
          />
        </CardContent>
        <CardActions>
          <Box display="flex" justifyContent="center" width="100%">
            <Button
              color="primary"
              variant="contained"
              fullWidth
              disabled={!isFormValid}
              onClick={onSignin}
            >
              Login
            </Button>
          </Box>
        </CardActions>
        <Typography
          align="center"
          style={{ cursor: "pointer", color: "blue" }}
          onClick={goToSignup}
        >
          do not have an account?
        </Typography>
        {values.error && (
          <Typography color="error" align="center">
            {values.error}!
          </Typography>
        )}
      </Card>
    </Box>
  );
};

export default Signin;
