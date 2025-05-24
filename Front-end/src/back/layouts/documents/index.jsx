/* eslint-disable */
import { Grid, Card } from "@mui/material/";
import MDBox from "../../components/Box";
import MDTypography from "../../components/Typography";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import ModalDocument from "../../examples/Modal/ModalDocuments";
import { useEffect, useState } from "react";
import MKButton from "../../../front/components/Button";
import DocumentAPI from "../../api/documents";
import data from "./data/projectsTableData";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour charger les documents
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await DocumentAPI.GetDocuments();
      if (!response || !response.files || response.files.length === 0) {
        setError("Aucun document disponible");
      } else {
        setDocuments(response.files);
      }
    } catch (err) {
      setError(err.message || "Erreur lors de la récupération des documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);


  const { columns, rows } = data(documents, fetchDocuments, loading, error);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={3}>
        <MKButton  sx={{ mr: 1 }} color="info" onClick={() => setOpen(true)}>
          Ajouter un documentation
        </MKButton>
        <ModalDocument open={open} handleClose={() => setOpen(false)} onDocumentAdded={fetchDocuments} />
      </MDBox>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Documents
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: columns, rows: rows }}
                  isSorted={true}
                  entriesPerPage={false}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>

  );
}

export default Documents;
