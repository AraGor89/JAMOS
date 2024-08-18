import { Button, CircularProgress } from "@mui/material";
import { FC } from "react";

type PropsT = {
  text: string;
  isPending: boolean;
  isDisabled: boolean;
};

const SubmitButton: FC<PropsT> = ({ text, isPending, isDisabled }) => {
  return (
    <Button
      fullWidth
      type="submit"
      color="primary"
      variant="contained"
      disabled={isDisabled}
    >
      {text}
      {isPending && (
        <CircularProgress
          size={20}
          color="inherit"
          sx={{ marginLeft: "20px" }}
        />
      )}
    </Button>
  );
};

export default SubmitButton;
