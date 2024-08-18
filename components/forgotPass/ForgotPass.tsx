"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Typography } from "@mui/material";

import { emailValidationSchema } from "@/validators";
import SubmitButton from "../submitButton/SubmitButton";
import { restorePassword } from "@/libs/axiosApi/restorePassword";
type FormT = {
  email: string;
};

const ForgotPass = () => {
  const [requestResult, setRequestResult] = useState({
    message: "",
    variant: "",
  });
  const isError = requestResult.variant === "error";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormT>({
    resolver: yupResolver(emailValidationSchema),
  });

  const {
    mutate,
    isPending,
    // isError,
    // error,
  } = useMutation({
    mutationFn: (email: string) => restorePassword(email),
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

  const onSubmit = async (data: FormT) => {
    mutate(data.email);
  };

  return (
    <Typography
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      style={{
        maxWidth: "20rem",
        margin: "auto",
        marginTop: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
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
        label="Please enter your email address."
      />
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

export default ForgotPass;
