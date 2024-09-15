import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  TextField,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import AuthService, { SignInData } from "../services/authAPI";
import { auth } from "../../utils/auth";

interface FormValues {
  email: string;
  password: string;
}

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    email: "",
    password: "",
  });
  const [apiError, setApiError] = useState<string>("");

  const handleChange = (id: keyof FormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValues({ ...values, [id]: value });
    setErrors({ ...errors, [id]: value.trim() === "" ? `${id} is required` : "" });
  };

  const navigateToSignUp = () => {
    navigate("/signup");
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    Object.keys(values).forEach((key) => {
      if (values[key as keyof FormValues].trim() === "") {
        newErrors[key] = `${key} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const onSignin = async () => {
    if (!validateForm()) return;
  
    const userData: SignInData = {
      email: values.email,
      password: values.password,
    };
  
    try {
      // Get the AxiosResponse and extract the data
      const response = await AuthService.signIn(userData);
  
      // Authenticate and store the JWT
      auth.authenticate(response, () => {
        setApiError("");
      });
  
      // Navigate to the home page
      navigate("/home");
    } catch (error) {
      console.error("Error signing in:", error);
      if (error instanceof Error) {
        setApiError(error.message || "Sign-in failed");
      } else {
        setApiError("An unexpected error occurred");
      }
    }
  };
   
  const isFormValid = !Object.values(errors).some(error => error !== "");

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
            Sign In
          </Typography>
          {(["email", "password"] as const).map((id) => (
            <TextField
              key={id}
              label={id === "email" ? "Email" : "Password"}
              id={id}
              type={id === "password" ? "password" : "email"}
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
            disabled={!isFormValid}
            onClick={onSignin}
          >
            Login
          </Button>
        </CardActions>
        <Box sx={{ mt: 2 }}>
          <Typography
            align="center"
            sx={{ cursor: "pointer", color: "primary.main" }}
            onClick={navigateToSignUp}
          >
            Don't have an account?
          </Typography>
          <Typography align="center" sx={{ cursor: "pointer", color: "text.secondary", mt: 1 }}>
            Forgot password?
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Signin;
