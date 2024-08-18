"use client";

import { FC } from "react";
import { FaSpinner } from "react-icons/fa";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@/providers/tosterProvider";
import { useForm, SubmitHandler } from "react-hook-form";
import { CharacteristicFormT, UserT } from "@/types/common";
import { addCharacteristicValidationSchema } from "@/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCharacteristics } from "@/libs/axiosApi/addCharacteristic";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import SubmitButton from "./../submitButton/SubmitButton";

type PropsT = {
  user: UserT;
};

const AddCharacteristic: FC<PropsT> = ({ user }) => {
  const { success, error: tostError } = useToast();
  const queryClient = useQueryClient();

  // TODO: handle isPending, isError, isSuccess
  const { mutate, isPending, isError, isSuccess, error } = useMutation({
    mutationFn: (data: CharacteristicFormT) =>
      addCharacteristics(user._id, data),
    onSuccess: () => {
      // success("Created successfully!");
      reset();
      queryClient.invalidateQueries({
        queryKey: ["userProfile", user?._id],
      });
    },
  });

  // if (isError) {
  //   console.error("Error during creating characteristics");
  //   tostError(error.message);
  // }

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CharacteristicFormT>({
    resolver: yupResolver(addCharacteristicValidationSchema),
  });

  const onSubmit: SubmitHandler<CharacteristicFormT> = async (data) => {
    mutate(data);
  };

  return (
    <Typography component="div" style={{ marginTop: "1rem" }}>
      <Typography
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <TextField
          type="text"
          placeholder="Characteristic Name"
          {...register("character")}
          variant="outlined"
          fullWidth
          size="small"
          error={!!errors.character}
          helperText={errors?.character?.message}
        />
        <TextField
          type="number"
          placeholder="Characteristic Value"
          {...register("value")}
          variant="outlined"
          fullWidth
          size="small"
          error={!!errors.value}
          helperText={errors?.value?.message}
        />
        <SubmitButton
          text="Create"
          isPending={isPending}
          isDisabled={isPending}
        />
      </Typography>
    </Typography>
  );
};

export default AddCharacteristic;
