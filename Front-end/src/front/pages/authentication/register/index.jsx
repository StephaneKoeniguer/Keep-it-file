/* eslint-disable */
import { Link } from "react-router-dom";
import { Card, Checkbox, Grid } from "@mui/material/";
import MKBox from "../../../components/Box";
import MKTypography from "../../../components/Typography";
import MKInput from "../../../components/Input";
import MKButton from "../../../components/Button";
import DefaultNavbar from "../../../components/Navbars/DefaultNavbar";
import SimpleFooter from "../../../components/Footers/SimpleFooter";
import routes from "../../../frontRoutes";
import bgImage from "../../../assets/images/shapes/waves-white.svg";

function Cover() {

  return (
    <>
      <DefaultNavbar routes={routes} />
      <MKBox
        position="absolute"
        top={0}
        left={0}
        zIndex={1}
        width="100%"
        minHeight="100vh"
        bgColor="dark"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 1),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
        }}
      />
      <MKBox px={1} width="100%" height="100vh" mx="auto" position="relative" zIndex={2}>
        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            <Card>
              <MKBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                mx={2}
                mt={-3}
                p={2}
                mb={1}
                textAlign="center"
              >
                <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                  Rejoignez- nous !
                </MKTypography>
                <MKTypography display="block" variant="button" color="white" my={1}>
                  Saisir un email et un mot de passe
                </MKTypography>
              </MKBox>
              <MKBox pt={4} pb={3} px={3}>
                <MKBox component="form" role="form">
                  <MKBox mb={2}>
                    <MKInput type="email" label="Email" variant="standard" fullWidth />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput type="password" label="mot de passe" variant="standard" fullWidth />
                  </MKBox>
                  <MKBox display="flex" alignItems="center" ml={-1}>
                    <Checkbox />
                    <MKTypography
                      variant="button"
                      fontWeight="regular"
                      color="text"
                      sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                    >
                      &nbsp;&nbsp;J'accepte&nbsp;
                    </MKTypography>
                    <MKTypography
                      component="a"
                      href="/legals"
                      variant="button"
                      fontWeight="bold"
                      color="info"
                      textGradient
                    >
                      les conditions d'utilisations
                    </MKTypography>
                  </MKBox>
                  <MKBox mt={4} mb={1}>
                    <MKButton variant="gradient" color="info" fullWidth>
                      Créer un compte
                    </MKButton>
                  </MKBox>
                  <MKBox mt={3} mb={1} textAlign="center">
                    <MKTypography variant="button" color="text">
                      Déja un compte ?{" "}
                      <MKTypography
                        component={Link}
                        to="/login"
                        variant="button"
                        color="info"
                        fontWeight="medium"
                        textGradient
                      >
                        Se connecter
                      </MKTypography>
                    </MKTypography>
                  </MKBox>
                </MKBox>
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
      <MKBox width="100%" position="absolute" zIndex={2} bottom="1.625rem">
        <SimpleFooter light />
      </MKBox>
    </>
  );
}

export default Cover;
