/* eslint-disable */
import MDBox from "../../components/Box";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import MKButton from "../../../front/components/Button";
import { Card, Grid, ImageList, ImageListItem } from "@mui/material";
import MDTypography from "../../components/Typography";
import DataTable from "../../examples/Tables/DataTable";
import ModalPicture from "../../examples/Modal/ModalPictures/index.";
import { useEffect, useState } from "react";
import data from "../images/data/projectsTableData";
import PictureAPI from "../../api/pictures";

function Images() {
  const [pictures, setPictures] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGridView, setIsGridView] = useState(false);

  // Fonction pour charger les documents
  const fetchPictures = async () => {
    setLoading(true);
    try {
      const response = await PictureAPI.GetPictures();
      if (!response || !response.pictures || response.pictures.length === 0) {
        setPictures([]);
        setError("Aucune images disponible");
      } else {
        setPictures(response.pictures);
      }
    } catch (err) {
      setError(err.message || "Erreur lors de la récupération des documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPictures();
  }, []);

  const toggleView = () => {
    setIsGridView((prev) => !prev);
  };

  const { columns, rows } = data(pictures, fetchPictures, loading, error);

  console.log(pictures);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={3}>
        <MKButton  sx={{ mr: 1 }} color="success" onClick={() => setOpen(true)}>
          Ajouter une image
        </MKButton>
        <ModalPicture open={open} handleClose={() => setOpen(false)} onPictureAdded={fetchPictures} />
        <MKButton sx={{ mr: 1 }} color="info" onClick={toggleView}>
          {isGridView ? "Voir en tableau" : "Voir en grille"}
        </MKButton>
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
                bgColor="success"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Images
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {isGridView ? (
                  <ImageList sx={{ width: "100%", height: 450 }} variant="quilted" cols={4} rowHeight={121}>
                    {pictures.map((item) => (
                      <ImageListItem key={item.id} cols={item.cols || 1} rows={item.rows || 1}>
                        <img
                          src={item.path}
                          alt={item.name}
                          loading="lazy"
                          style={{ objectFit: "cover", width: "100%", height: "100%" }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                ) : (
                  <DataTable
                    table={{ columns: columns, rows: rows }}
                    isSorted={true}
                    entriesPerPage={false}
                    showTotalEntries={true}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Images;
