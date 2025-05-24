import React, { useEffect, useState } from "react";
import DocumentAPI from "../../../api/documents";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Divider } from "@mui/material/";
import { allowedTypesDocuments } from "../../../functions/allowedTypes";
import MKButton from "../../../../front/components/Button";

// eslint-disable-next-line react/prop-types
function ModalDocument({ open, handleClose, onDocumentAdded }) {
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
    if (selectedFile && allowedTypesDocuments.includes(selectedFile.type)) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  // Submit form to add document
  const handleAddDocument = async (event) => {
    event.preventDefault();

    if (file) {
      const data = {
        fileName,
        file,
      };

      try {
        await DocumentAPI.RegisterDocument(data);
        onDocumentAdded();
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.log("No document selected");
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          backgroundColor: "info.main",
          textAlign: "center",
          color: "#fff",
        }}
      >
        Ajouter un document
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          name="fileName"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Document Name"
          required
          label="Nom du document"
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
        <MKButton onClick={handleClose} variant="outlined" color="info">
          Annuler
        </MKButton>
        <MKButton onClick={handleAddDocument} disabled={isButtonDisabled} color="info">
          Ajouter un document
        </MKButton>
      </DialogActions>
    </Dialog>
  );
}

export default ModalDocument;
