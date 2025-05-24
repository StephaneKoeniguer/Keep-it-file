import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Divider,
} from "@mui/material";
import MKButton from "../../../../../front/components/Button";

function EditProfileModal({ open, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    nom: user?.nom || "",
    description: user?.description || "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    // Réinitialise les champs lorsque le modal est fermé
    if (!open) {
      setFormData({
        nom: user?.nom || "",
        description: user?.description || "",
      });
      setIsButtonDisabled(false);
    }
  }, [open, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData); // Appelle la fonction pour sauvegarder les données
    onClose(); // Ferme la modal
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle
        sx={{
          backgroundColor: "info.main",
          textAlign: "center",
          color: "#fff",
        }}
      >
        Modifier le profil
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Nom"
          name="nom"
          value={formData.nom}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={5}
        />
      </DialogContent>
      <Divider />
      <DialogActions>
        <MKButton onClick={onClose} variant="outlined" color="info">
          Annuler
        </MKButton>
        <MKButton onClick={handleSave} disabled={isButtonDisabled} color="info">
          Sauvegarder
        </MKButton>
      </DialogActions>
    </Dialog>
  );
}

EditProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default EditProfileModal;
