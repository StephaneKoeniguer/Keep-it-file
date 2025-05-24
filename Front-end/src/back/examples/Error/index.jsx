import React from "react";
import { Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// eslint-disable-next-line react/prop-types
function Error({ message = "Une erreur s'est produite" }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        border: "1px solid",
        borderColor: "error.main",
        borderRadius: 2,
        backgroundColor: "error.light",
        color: "white",
        mt: 20,
      }}
    >
      <ErrorOutlineIcon sx={{ marginRight: 1 }} />
      <Typography variant="body1" fontWeight="bold">
        {message}
      </Typography>
    </Box>
  );
}

export default Error;
