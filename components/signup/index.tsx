"use client";
import { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { convertToBase64 } from "@/utils";
import { useForm } from "react-hook-form";
// import { FaUserCircle } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import { SignupFormT, UserT } from "@/types/common";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupValidationSchema } from "@/validators";
import SubmitButton from "../submitButton/SubmitButton";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserProfile } from "@/libs/axiosApi/createUserProfile";
import {
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
  FormControl,
} from "@mui/material";

const Signup: FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl")
    ? `?callbackUrl=${params.get("callbackUrl")}`
    : "";

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  // TODO: handle isPending, isError, isSuccess
  const { mutate, isPending, isError, isSuccess, data } = useMutation({
    mutationFn: async (formData: SignupFormT): Promise<UserT> =>
      createUserProfile(formData),
  });

  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormT>({
    resolver: yupResolver(signupValidationSchema),
  });

  const onSubmit = async (data: SignupFormT) => {
    const dataToSend = data; // { ...data, photo: imagePreview || "" };
    console.log("dataToSend", dataToSend);
    try {
      mutate(dataToSend);
    } catch (e) {
      console.log("e", e);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
      router.push(`/signin${callbackUrl}`, {
        scroll: false,
      });
    }
  }, [isSuccess]);

  // const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setValue("photo", file);
  //     const convertedPhoto = await convertToBase64(file);
  //     setImagePreview((convertedPhoto as string) || "");
  //   }
  // };

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
      {/* TODO: uncomment and fix when photo is needed  */}
      {/* <div>
    //     <input
    //       type="file"
    //       accept="image/*"
    //       ref={inputRef}
    //       style={{ display: "none" }}
    //       onChange={handleImageChange}
    //     />
    //     <p className="text-red-500 text-xs mt-1">{errors?.photo?.message}</p>

    //     <div
    //       style={{ display: "flex", justifyContent: "center" }}
    //       onClick={() => inputRef?.current?.click()}
    //     >
    //       {imagePreview ? (
    //         <Image
    //           src={imagePreview}
    //           alt="Preview"
    //           width="100"
    //           height="100"
    //           style={{ borderRadius: "50%", cursor: "pointer" }}
    //         />
    //       ) : (
    //         <FaUserCircle
    //           size={100}
    //           style={{ color: "#555", cursor: "pointer" }}
    //         />
    //       )}
    //     </div>
    //   </div> */}
      {/*  */}
      <TextField
        id="name"
        type="text"
        label="Name"
        {...register("name")}
        variant="outlined"
        fullWidth
        error={!!errors.name}
        helperText={errors?.name?.message}
        size="small"
      />
      <TextField
        id="surname"
        type="text"
        label="Surname"
        {...register("surname")}
        variant="outlined"
        fullWidth
        error={!!errors.surname}
        helperText={errors?.surname?.message}
        size="small"
      />
      <TextField
        id="email"
        type="text"
        label="Email"
        {...register("email")}
        variant="outlined"
        fullWidth
        error={!!errors.email}
        helperText={errors?.email?.message}
        size="small"
      />
      <TextField
        id="partnerEmail"
        type="text"
        label="Partner Email"
        {...register("partnerEmail")}
        variant="outlined"
        fullWidth
        error={!!errors.partnerEmail}
        helperText={errors?.partnerEmail?.message}
        size="small"
      />
      <TextField
        id="password"
        type={showPassword ? "text" : "password"}
        label="Password"
        autoComplete="on"
        {...register("password")}
        variant="outlined"
        fullWidth
        size="small"
        error={!!errors.password}
        helperText={errors?.password?.message}
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
      <SubmitButton
        text="Sign Up"
        isPending={isPending}
        isDisabled={isPending}
      />

      <Typography component="div" style={{ marginTop: "0.5rem" }}>
        <Typography variant="body2" style={{ color: "#6b7280" }}>
          Already have an account?{" "}
          <Link
            href={`/signin${callbackUrl}`}
            style={{ color: "#3b82f6", textDecoration: "none" }}
          >
            Sign In
          </Link>
        </Typography>
      </Typography>
    </Typography>
  );
};

export default Signup;
