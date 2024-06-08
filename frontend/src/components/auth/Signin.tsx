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
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    email: false,
    password: false,
  });
  const handleChange =
    (id: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const { id, value } = event.target;
      setValues({ ...values, [id]: value });
      setErrors({ ...errors, [id]: value.trim() === "" });
    };
  const goToSignup = () => {
    navigate("/signup");
  };

  const onSignin = async () => {
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
      console.error("error signing in:", error);
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
  const isFormValid = !(errors.email || errors.password);
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
          {["email", "password"].map((id) => (
            <TextField
              key={id}
              label={id === "email" ? "Email" : "Password"}
              id={id}
              type={id === "password" ? "password" : "email"}
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
          Do not have an account?
        </Typography>
        <Typography align="center" style={{ cursor: "pointer", color: "gray" }}>
          Forgot password?
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
