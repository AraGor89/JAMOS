"use client";

import Image from "next/image";
import { Grid } from "@mui/material";
import { CSSProperties } from "react";

import { dataArr, reOrderData } from "./data";

const textContentStyles: CSSProperties = {
  width: "400px",
  height: "300px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const iconContentStyles: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "400px",
  height: "300px",
};

const About = () => {
  return (
    <Grid
      container
      spacing={2}
      marginTop={3}
      textAlign="center"
      justifyContent="center"
    >
      {dataArr.map((item, index) => (
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={6}
          key={index}
          display="flex"
          justifyContent="center"
          order={{
            xs: reOrderData(index + 1),
            sm: reOrderData(index + 1),
            md: index + 1,
            lg: index + 1,
          }}
        >
          {typeof item.content !== "string" && (
            <div style={textContentStyles}>{item.content}</div>
          )}

          {typeof item.content === "string" && (
            <div style={iconContentStyles}>
              <Image
                width={0}
                height={0}
                src={item.content}
                alt={item.content}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default About;
