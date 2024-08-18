import { FC, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Card, CardActions, CardContent } from "@mui/material";

const style = {
  top: "50%",
  left: "50%",
  boxShadow: 24,
  bgcolor: "background.paper",
  transform: "translate(-50%, -50%)",
  position: "absolute" as "absolute",
  //   border: "2px solid #000",
  //   width: 400,
  //   p: 4,
};

type CustomModalT = {
  openModal: boolean;
  positiveCB: () => void;
  handleCloseModal: () => void;
};

const CustomModal: FC<CustomModalT> = ({
  openModal,
  positiveCB,
  handleCloseModal,
}) => {
  const [open, setOpen] = useState(openModal);

  useEffect(() => {
    setOpen(openModal);
  }, [openModal]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Card>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                With partnership also will be deleted {"Characteristics"} and
                {"Notifications"}
              </Typography>
              <Typography sx={{ mb: 0 }} color="text.secondary">
                Do you want to continue ?
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="error" onClick={positiveCB}>
                Delete
              </Button>
              <Button size="small" onClick={handleCloseModal}>
                Cancel
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Modal>
    </div>
  );
};

export default CustomModal;
