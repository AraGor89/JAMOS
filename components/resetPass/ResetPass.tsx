"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPassValidationSchema } from "@/validators";
import { resetPassword } from "@/libs/axiosApi/resetPassword";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import {
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  ResetPasswordFormAndUrlParamsT,
  ResetPasswordFormT,
} from "@/types/common";
import SubmitButton from "../submitButton/SubmitButton";

const ResetPass = () => {
  const { id, token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [requestResult, setRequestResult] = useState({
    message: "",
    variant: "",
  });
  const isError = requestResult.variant === "error";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormT>({
    resolver: yupResolver(resetPassValidationSchema),
  });

  // TODO: handle isPending, isError, isSuccess
  const {
    mutate,
    isPending,
    // isError,
    // error,
  } = useMutation({
    mutationFn: (formData: ResetPasswordFormAndUrlParamsT) =>
      resetPassword(formData),
    onSuccess: (d) => {
      setRequestResult({ message: d?.data?.message, variant: "success" });
    },
    onError: (e: any) => {
      setRequestResult({
        message: e?.response?.data?.message,
        variant: "error",
      });
    },
  });

  const onSubmit = async (data: ResetPasswordFormT) => {
    // @ts-ignore
    mutate({ ...data, id, token });
  };

  return (
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
      {/* <div style={{ marginBottom: "1rem" }}> */}
      {/* <InputLabel htmlFor="email">Enter new password.</InputLabel> */}
      <TextField
        fullWidth
        size="small"
        label="Enter new password"
        id="password"
        variant="outlined"
        {...register("password")}
        error={!!errors.password}
        helperText={errors?.password?.message}
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {/* </div> */}

      {/* <div style={{ marginBottom: "1rem" }}> */}
      {/* <InputLabel htmlFor="email">Confirm new password.</InputLabel> */}
      <TextField
        fullWidth
        size="small"
        label="Confirm new password"
        variant="outlined"
        id="confirmPassword"
        {...register("confirmPassword")}
        error={!!errors.confirmPassword}
        helperText={errors?.confirmPassword?.message}
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {/* </div> */}

      <Typography
        component="p"
        style={{ color: `${isError ? "red" : "green"}` }}
      >
        {requestResult.message}
      </Typography>
      <SubmitButton
        text="Submit"
        isPending={isPending}
        isDisabled={!!requestResult?.message || isPending}
      />
    </Typography>
  );
};

export default ResetPass;
