"use client";
import { FC, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
// import { FiEye, FiEyeOff } from "react-icons/fi";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Divider,
  Checkbox,
  TextField,
  IconButton,
  InputLabel,
  Typography,
  FormControlLabel,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import ForgotPass from "../forgotPass/ForgotPass";
import SubmitButton from "../submitButton/SubmitButton";
import { signinValidationSchema } from "@/validators";

interface SigninForm {
  email: string;
  password: string;
}

const Signin: FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninForm>({
    resolver: yupResolver(signinValidationSchema),
  });

  const callbackUrl = params.get("callbackUrl")
    ? `?callbackUrl=${params.get("callbackUrl")}`
    : "";

  const onSubmit = async (data: SigninForm) => {
    try {
      setIsPending(true);
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
        // callbackUrl: params.get("callbackUrl") || "/",
      });
      if (res?.error) {
        if (res?.status === 401) {
          setGeneralError("Incorrect email or password");
          return;
        } else {
          setGeneralError("Something went wrong");
        }
      }
      setGeneralError("");
      router.replace(`${params.get("callbackUrl") || "/"}`);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Typography
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        style={{
          maxWidth: "20rem",
          margin: "auto",
          marginTop: "4rem",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <TextField
          id="email"
          type="text"
          {...register("email")}
          variant="outlined"
          fullWidth
          error={!!errors.email}
          helperText={errors?.email?.message}
          size="small"
          label="Email"
          disabled={isForgotPassword}
        />
        <TextField
          id="password"
          type={showPassword ? "text" : "password"}
          {...register("password")}
          variant="outlined"
          fullWidth
          size="small"
          label="Password"
          disabled={isForgotPassword}
          error={!!errors.password}
          helperText={errors?.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  disabled={isForgotPassword}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Typography
          component="p"
          style={{
            color: "#ef4444",
            fontSize: "0.75rem",
            marginTop: "0.25rem",
          }}
        >
          {generalError}
        </Typography>

        <SubmitButton
          text="Sign In"
          isPending={isPending}
          isDisabled={isForgotPassword || isPending}
        />

        <div style={{ marginTop: "0.5rem" }}>
          <Typography variant="body2">
            Do not have an account?{" "}
            <Link
              href={`/signup${callbackUrl}`}
              style={{ color: "#3b82f6", textDecoration: "none" }}
            >
              Sign Up
            </Link>
          </Typography>
        </div>
        <Divider />

        <FormControlLabel
          label="Forgot password ?"
          control={
            <Checkbox
              checked={isForgotPassword}
              onChange={() => setIsForgotPassword((prev) => !prev)}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
        />
      </Typography>

      {isForgotPassword && <ForgotPass />}
    </>
  );
};

export default Signin;
