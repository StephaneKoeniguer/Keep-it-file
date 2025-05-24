import React, { useState } from "react";
import { Modal, Box, Typography, Tooltip, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";

// eslint-disable-next-line react/prop-types
function ModalShareLink({ open, link, onClose }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fonction pour copier le lien dans le presse-papier
  const handleCopyLink = () => {
    // eslint-disable-next-line
    navigator.clipboard.writeText(link)
      .then(() => {
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error("Erreur lors de la copie du lien: ", err);
      });
  };

  // Icône fermeture snackbar
  const action = (
    <IconButton size="small" color="inherit" onClick={() => setSnackbarOpen(false)}>
      <CloseIcon />
    </IconButton>
  );

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          color="info"
          sx={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40%",
            boxShadow: 24,
            background: "linear-gradient(195deg, #49a3f1, #1A73E8)",
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#fff",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              textAlign: "center",
              textDecoration: "underline",
              marginBottom: 2,
            }}
          >
            Lien de partage
          </Typography>
          <Typography
            component="span"
            href={link}
            variant="body2"
            fontWeight="medium"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "block",
              textAlign: "center",
              color: "#fff",
            }}
          >
            {link}
            <Tooltip title="Copier">
              <IconButton
                onClick={handleCopyLink}
                sx={{
                  left: 10,
                  color: "#fff",
                }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Typography>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Lien copié dans le presse-papier !"
        action={action}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      />
    </React.Fragment>
  );
}

export default ModalShareLink;
