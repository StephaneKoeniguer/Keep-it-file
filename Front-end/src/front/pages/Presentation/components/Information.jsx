import { Container, Grid } from "@mui/material/";
import MKBox from "../../../components/Box";
import RotatingCard from "../../../components/Cards/RotatingCard";
import RotatingCardFront from "../../../components/Cards/RotatingCard/RotatingCardFront";
import RotatingCardBack from "../../../components/Cards/RotatingCard/RotatingCardBack";
import DefaultInfoCard from "../../../components/Cards/InfoCards/DefaultInfoCard";
import bgFront from "../../../assets/images/rotating-card-bg-front.jpg";
import bgBack from "../../../assets/images/rotating-card-bg-back.jpg";

function Information() {
  return (
    <MKBox component="section" py={6} my={6}>
      <Container>
        <Grid container item xs={11} spacing={3} alignItems="center" sx={{ mx: "auto" }}>
          <Grid item xs={12} lg={4} sx={{ mx: "auto" }}>
            <RotatingCard>
              <RotatingCardFront
                image={bgFront}
                icon="cloud"
                title={
                  <>
                    Stockez vos
                    <br />
                    fichiers en sécurité
                  </>
                }
                description="Une solution cloud fiable pour gérer vos documents en toute confiance et simplicité."
              />
              <RotatingCardBack
                image={bgBack}
                icon="folder_open"
                title="Explorez nos fonctionnalités"
                description="Découvrez comment notre plateforme facilite l'organisation et l'accès à vos fichiers où que vous soyez."
              />
            </RotatingCard>
          </Grid>
          <Grid item xs={12} lg={7} sx={{ ml: "auto" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="storage"
                  title="Stockage"
                  description="Conservez tous vos fichiers, sans restrictions de temps. Accédez à vos documents en toute sécurité"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="security"
                  title="Sécurité Avancée"
                  description="Vos données sont protégées avec des protocoles de cryptage de pointe et des sauvegardes régulières."
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: { xs: 0, md: 6 } }}>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="speed"
                  title="Performance Optimale"
                  description="Un accès rapide et fluide à vos fichiers grâce à une infrastructure performante."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="devices"
                  title="Accès Multi-Plateforme"
                  description="Gérez vos documents depuis votre ordinateur, tablette ou smartphone."
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Information;
