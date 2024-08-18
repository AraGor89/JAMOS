import React, { useState, useRef, useEffect, FC } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Box, Typography, IconButton } from "@mui/material";
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
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);

  const handleDown = () => {
    setDragging(true);
  };

  const handleUp = () => {
    setDragging(false);
  };

  const handleMove = (clientX: number) => {
    if (dragging && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const newPosition = (clientX * 100) / containerWidth;
      setProgress(Math.min(Math.max(newPosition, 0), 100));
      isFirstRender.current = false;
    }
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    handleDown();
    handleMove(event.clientX);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    handleDown();
    handleMove(event.touches[0].clientX);
  };

  const handleMoveEvent = (event: MouseEvent | TouchEvent) => {
    if (event instanceof MouseEvent) {
      handleMove(event.clientX);
    } else if (event instanceof TouchEvent) {
      handleMove(event.touches[0].clientX);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMoveEvent);
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("touchmove", handleMoveEvent);
    document.addEventListener("touchend", handleUp);

    return () => {
      document.removeEventListener("mousemove", handleMoveEvent);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchmove", handleMoveEvent);
      document.removeEventListener("touchend", handleUp);
    };
  }, [dragging]);

  useEffect(() => {
    if (!dragging && !isFirstRender.current) {
      handleEditChar(character.character, +progress.toFixed());
    }
  }, [progress, dragging]);

  useEffect(() => {
    setProgress(character.value);
    isFirstRender.current = true;
  }, [character]);

  const charInfo = [
    { text: character?.character, value: `${progress.toFixed()}%` },
    { text: "Created by:", value: character?.createdBy },
    { text: "Created at:", value: formatDate(character?.createdAt) },
    { text: "Updated by:", value: character?.updatedBy },
    { text: "Updated at:", value: formatDate(character?.updatedAt) },
  ];

  return (
    <>
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
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          cursor: "pointer",
          borderRadius: "50px",
          position: "relative",
          backgroundColor: "gray",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <Box
          sx={{
            height: 10,
            width: `${progress}%`,
            borderRadius: "inherit",
            backgroundColor: "primary.main",
          }}
        />
        <Box
          sx={{
            top: -2,
            width: 15,
            height: 15,
            borderRadius: "50%",
            position: "absolute",
            backgroundColor: "primary.main",
            left: progress > 1 ? `calc(${progress}% - 15px)` : 0,
          }}
        />
      </Box>
    </>
  );
};

export default ProgressBar;
