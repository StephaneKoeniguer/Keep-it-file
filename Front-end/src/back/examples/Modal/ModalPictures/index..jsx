import React, { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Divider } from "@mui/material/";
import { allowedTypesPictures } from "../../../functions/allowedTypes";
import MKButton from "../../../../front/components/Button";
import PictureAPI from "../../../api/pictures";

// eslint-disable-next-line react/prop-types
function ModalPicture({ open, handleClose, onPictureAdded }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Réinitialise les champs lorsque le modal est fermé
  useEffect(() => {
    if (!open) {
      setFile(null);
      setFileName("");
      setIsButtonDisabled(true);
    }
  }, [open]);

  // Manage change file
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // Enable button if the file type is allowed
    if (selectedFile && allowedTypesPictures.includes(selectedFile.type)) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  // Submit form to add document
  const handleAddPicture = async (event) => {
    event.preventDefault();

    if (file) {
      const data = {
        fileName,
        file,
      };

      try {
        await PictureAPI.RegisterPicture(data);
        onPictureAdded();
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.log("No picture selected");
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          backgroundColor: "#66BB6A",
          textAlign: "center",
          color: "#fff",
        }}
      >
        Ajouter une image
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          name="fileName"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Nom"
          required
          label="Nom de l'image"
          type="text"
          fullWidth
          variant="outlined"
          inputProps={{ maxLength: 40 }}
          sx={{ mt: 2 }}
        />
        <input
          type="file"
          id="file"
          name="file"
          onChange={handleFileChange}
          style={{
            display: "block",
            marginTop: "10px",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px",
            backgroundColor: "#f4f4f4",
            width: "100%",
          }}
        />
      </DialogContent>
      <Divider />
      <DialogActions>
        <MKButton onClick={handleClose} variant="outlined" color="success">
          Annuler
        </MKButton>
        <MKButton onClick={handleAddPicture} disabled={isButtonDisabled} color="success">
          Ajouter une image
        </MKButton>
      </DialogActions>
    </Dialog>
  );
}

export default ModalPicture;
