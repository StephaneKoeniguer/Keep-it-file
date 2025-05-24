import MDBox from "../../../components/Box";
import MDTypography from "../../../components/Typography";
import MDAvatar from "../../../components/Avatar";
import LogoPdf from "../../../assets/images/small-logos/icons-pdf-100.png";
import LogoExcel from "../../../assets/images/small-logos/icons-ms-excel-100.png";
import LogoWord from "../../../assets/images/small-logos/icons-ms-word-100.png";
import { CircularProgress } from "@mui/material";
import Error from "../../../examples/Error";
import formatFileSize from "../../../functions/converSize";
import LongMenu from "../components/LongMenu";

export default function data(documents, fetchDocuments, loading, error) {
  // Manage loading and error messages
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <Error message="Erreur lors de la récupération des documents" />;
  }

  // Gestion du type
  const type = (documentType) => {
    let fileType;
    switch (documentType) {
      case "application/pdf":
        fileType = "pdf";
        break;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/msword":
        fileType = "word";
        break;
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        fileType = "excel";
        break;
      default:
        fileType = "pdf";
        break;
    }
    return fileType;
  };

  // gestion de l'image
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "pdf":
        return LogoPdf;
      case "word":
        return LogoWord;
      case "excel":
        return LogoExcel;
      default:
        return LogoPdf;
    }
  };

  // eslint-disable-next-line react/prop-types
  const Project = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="md" variant="rounded" />
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  return Array.isArray(documents) && documents.length > 0
    ? {
        columns: [
          { Header: "Nom", accessor: "nom", width: "30%", align: "left" },
          { Header: "Taille", accessor: "taille", align: "left" },
          { Header: "Type", accessor: "type", align: "center" },
          { Header: "Date", accessor: "date", align: "center" },
          { Header: "action", accessor: "action", align: "center" },
        ],
        rows: documents.map((document) => ({
          nom: <Project image={getFileIcon(type(document.type))} name={document.name} />,
          taille: (
            <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
              {document.size ? formatFileSize(document.size) : "Taille inconnue"}
            </MDTypography>
          ),
          type: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              {type(document.type)}
            </MDTypography>
          ),
          date: new Date(document.createdAt).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          action: <LongMenu document={document} onDocumentDeleted={fetchDocuments} />,
        })),
      }
    : {
        columns: [
          {
            Header: "Pas de documents",
            accessor: "pas de documents",
            width: "100%",
            align: "center",
          },
        ],
      };
}
