import React, { useState, FC } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Box, Typography, IconButton, Slider } from "@mui/material";
import { formatDate } from "@/utils";
import { CharacteristicT } from "@/types/common";

type PropsT = {
  character: CharacteristicT;
  handleDeleteChar: (character: string) => void;
  handleEditChar: (character: string, value: number) => void;
};

const ProgressBar: FC<PropsT> = ({
  character,
  handleEditChar,
  handleDeleteChar,
}) => {
  const [progress, setProgress] = useState(character.value);

  const charInfo = [
    { text: character?.character, value: `${progress.toFixed()}%` },
    { text: "Created by:", value: character?.createdBy },
    { text: "Created at:", value: formatDate(character?.createdAt) },
    { text: "Updated by:", value: character?.updatedBy },
    { text: "Updated at:", value: formatDate(character?.updatedAt) },
  ];

  const handleChangeCommitted = (
    event: React.SyntheticEvent | Event,
    value: number | number[]
  ) => {
    if (character.value !== +progress.toFixed()) {
      handleEditChar(character.character, +progress.toFixed());
    }
  };

  const handleChange = (
    event: React.SyntheticEvent | Event,
    value: number | number[]
  ) => {
    setProgress(value as number);
  };

  return (
    <Typography component="div" style={{ padding: "0 15px" }}>
      <Box
        mb={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          {charInfo.map((item, index) => {
            if (!item.value) return null;

            const isFirstItem = index === 0;
            const fontSize = isFirstItem ? "15px" : "13px";
            const fontWeight = isFirstItem ? 600 : 500;

            return (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                marginBottom={isFirstItem ? 1 : "unset"}
              >
                <Typography
                  variant="body1"
                  sx={{ minWidth: 110, lineHeight: 1.2, fontWeight, fontSize }}
                >
                  {item.text}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.2, fontWeight, fontSize }}
                >
                  {item.value}
                </Typography>
              </Box>
            );
          })}
        </Box>
        <IconButton onClick={() => handleDeleteChar(character?.character)}>
          <DeleteOutlineOutlinedIcon color="error" />
        </IconButton>
      </Box>
      <Slider
        value={progress}
        valueLabelDisplay="auto"
        onChange={handleChange} // Update state dynamically
        onChangeCommitted={handleChangeCommitted} // Make edit api call on release
      />
    </Typography>
  );
};

export default ProgressBar;
