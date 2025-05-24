/* eslint-disable */
import MDBox from "../../../components/Box";
import MDTypography from "../../../components/Typography";
import MDAvatar from "../../../components/Avatar";
import LogoJpg from "../../../assets/images/small-logos/icons-jpeg-100.png";
import LogoPng from "../../../assets/images/small-logos/icons-png-100.png";
import { CircularProgress } from "@mui/material";
import Error from "../../../examples/Error";
import formatFileSize from "../../../functions/converSize";
import LongMenu from "../../images/components/LongMenu";

export default function data(pictures, fetchPictures, loading, error) {

  // Manage loading and error messages
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <Error message="Erreur lors de la récupération des images" />;
  }

  // Gestion du type
  const type = (pictureType) => {
    let fileType;
    switch (pictureType) {
      case '"image/jpeg"':
        fileType = 'jpeg';
        break;
      case 'image/png':
        fileType = 'png';
        break;
      default:
        fileType = 'jpeg';
        break;
    }
    return fileType;
  };

  // gestion de l'image
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'jpeg':
        return LogoJpg;
      case 'png':
        return LogoPng;
      default:
        return LogoJpg;
    }
  };

  const Project = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="md" variant="rounded" />
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  return pictures.length > 0
    ? {
      columns: [
        { Header: "Nom", accessor: "nom", width: "30%", align: "left" },
        { Header: "Taille", accessor: "taille", align: "left" },
        { Header: "Type", accessor: "type", align: "center" },
        { Header: "Date", accessor: "date", align: "center" },
        { Header: "action", accessor: "action", align: "center" },
      ],
      rows: pictures.map((picture) => ({
        nom: <Project image={getFileIcon(type(picture.type))} name={picture.name} />,
        taille: (
          <MDTypography
            component="a"
            href="#"
            variant="button"
            color="text"
            fontWeight="medium"
          >
            {picture.size ? formatFileSize(picture.size) : "Taille inconnue"}
          </MDTypography>
        ),
        type: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {type(picture.type)}
          </MDTypography>
        ),
        date: new Date(picture.createdAt).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        action: <LongMenu picture={picture} onPictureDeleted={fetchPictures} />,
      })),
    }
    : {
      columns: [{ Header: "Pas d'images", accessor: "pas d'images'", width: "100%", align: "center" }],
    };

};
