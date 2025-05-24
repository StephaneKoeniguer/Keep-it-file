/* eslint-disable */
import { Grid, Divider } from "@mui/material/";
import MDBox from "../../components/Box";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ProfileInfoCard from "../../examples/Cards/InfoCards/ProfileInfoCard";
import Header from "./components/Header";
import EditProfileModal from "./components/ModalEdit";
import { useAuth } from "../../../shared/context/AuthProvider";
import { useState } from "react";


function Overview() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveProfile = (updatedData) => {
    console.log(updatedData); // Sauvegarde les données utilisateur (ou via une API)
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header name={user?.nom || "Pas de nom"} avatar={user?.avatar || ""}>
        <MDBox mt={5} mb={3}>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <ProfileInfoCard
                title="informations"
                description="Hi, I’m Alec Thompson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
                info={{
                  nomPrénom: user?.nom || "Pas de nom",
                  email: user?.email || "Email non fourni",
                }}
                action={{ route: "", tooltip: "Modifier profil", onClick: handleOpenModal, }}
                shadow={false}
              />
            </Grid>
        </MDBox>
      </Header>
      <Footer />
      <EditProfileModal
        open={isModalOpen}
        onClose={handleCloseModal}
        user={user}
        onSave={handleSaveProfile}
      />
    </DashboardLayout>
  );
}

export default Overview;
