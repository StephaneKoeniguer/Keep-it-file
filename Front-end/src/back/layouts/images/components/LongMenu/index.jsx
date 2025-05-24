/* eslint-disable */
import { useState } from "react";
import MDTypography from "../../../../components/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import DocumentAPI from "../../../../api/documents";
import PictureAPI from "../../../../api/pictures";
/*import ModalShareLink from "../Modal/ModalShareLink";*/

// eslint-disable-next-line react/prop-types
const LongMenu = ({ picture, onPictureDeleted }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  // eslint-disable-next-line
  const [error, setError] = useState(null);
  const [shareLink, setShareLink] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const open = Boolean(anchorEl);
  const ITEM_HEIGHT = 48;

  const options = ["Télécharger", "Partager", "Supprimer"]; // Options du menu

  const handleOptionClick = (option) => {
    switch (option) {
      case "Télécharger":
        // eslint-disable-next-line react/prop-types
        console.log("Télécharger")
        setAnchorEl(null);
        break;
      case "Partager":
        // eslint-disable-next-line react/prop-types
        console.log("Partager")
        setAnchorEl(null);
        break;
      case "Supprimer":
        // eslint-disable-next-line react/prop-types
        handleDelete(picture.id);
        break;
      default:
        console.log("Option inconnue");
    }
  };

  // Gestion téléchargement fichier
  /*const handleDownload = async (id) => {
    try {
      await DocumentAPI.downloadDocuments(id);
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors du téléchargement");
    }
  };*/

  // Gestion du lien de partage
  /*const handleShare = async (id) => {
    try {
      const data = await DocumentAPI.shareDocuments(id);
      setShareLink(data.link);
      setShowModal(true);
    } catch (err) {
      setError(err.message || "une erreur est survenue lors de la génération du lien");
    }
  };*/

  // Gestion suppression du document
  const handleDelete = async (id) => {
    try {
      await PictureAPI.DeletePicture(id);
      onPictureDeleted();
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la suppression");
    }
  };

  return (
    <MDTypography component="a" href="#" color="text">
      {/*{showModal && (
        <ModalShareLink open={showModal} link={shareLink} onClose={() => setShowModal(false)} />
      )}*/}

      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={(e) => setAnchorEl(e.currentTarget)} // Ouvre le menu lors du clic
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl} // Menu positionné par rapport à anchorEl
        open={open}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={() => {
              handleOptionClick(option);
              () => setAnchorEl(null);
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </MDTypography>
  );
};

export default LongMenu;
