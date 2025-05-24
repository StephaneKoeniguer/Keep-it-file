/* eslint-disable */
import { Container, Grid, Card } from "@mui/material/";
import MKBox from "../../components/Box";
import MKButton from "../../components/Button";
import MKTypography from "../../components/Typography";
import DefaultNavbar from "../../components/Navbars/DefaultNavbar";
import DefaultFooter from "../../components/Footers/DefaultFooter";
import Counters from "./components/Counters";
import Information from "./components/Information";
import Download from "./components/Download";
import routes from "../../frontRoutes";
import footerRoutes from "../../components/Footers/footer.routes";
import bgImage from "../../assets/images/background-accueil.jpg";
import "../../../shared/assets/css/font.css";

const font = "modernizFont, sans-serif";

function Presentation() {

  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox
        minHeight="75vh"
        width="100%"
        bgColor="dark"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 1),
              rgba(gradients.dark.state, 0.8)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Container>
          <Grid container item xs={12} lg={12} justifyContent="center" mx="auto">
            <MKTypography
              variant="h1"
              color="white"
              fontFamily={font}
              mt={-6}
              mb={1}
              sx={({ breakpoints, typography: { size } }) => ({
                [breakpoints.down("md")]: {
                  fontSize: size["3xl"],
                  marginTop: size["3xl"],
                },
              })}
            >
              Keep It File{" "}
            </MKTypography>
            <MKTypography
              variant="body1"
              color="white"
              textAlign="center"
              px={{ xs: 6, lg: 1 }}
              mt={1}
            >
              Solution dédiée à la gestion et au stockage de vos fichiers numériques, alliant
              simplicité et efficacité. <br /> Notre plateforme offre une expérience utilisateur
              fluide, permettant d’organiser, consulter et partager vos documents en toute
              confiance.
              <br /> <br />
              Vous pouvez centraliser vos données dans un espace fiable et accessible à tout moment,
              où que vous soyez.
            </MKTypography>
            <Grid container justifyContent="center" spacing={2} mt={3}>
              <Grid item>
                <MKButton
                  variant="contained"
                  color="info"
                  size="large"
                  href="/login"
                >
                  Connexion
                </MKButton>
              </Grid>
              <Grid item>
                <MKButton
                  variant="outlined"
                  size="large"
                  href="/register"
                >
                  Créer un compte
                </MKButton>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </MKBox>
      <Card
        sx={{
          p: 2,
          mx: { xs: 2, lg: 3 },
          mt: -8,
          mb: 4,
          backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <Counters />
        <Information />
        <Download />
      </Card>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Presentation;
