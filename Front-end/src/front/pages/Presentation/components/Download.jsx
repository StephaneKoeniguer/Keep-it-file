import { Container, Grid } from "@mui/material/";
import MKBox from "../../../components/Box";
import MKButton from "../../../components/Button";
import MKTypography from "../../../components/Typography";
import bgImage from "../../../assets/images/shapes/waves-white.svg";

function Download() {
  return (
    <MKBox component="section" py={{ xs: 0, sm: 12 }}>
      <MKBox
        variant="gradient"
        bgColor="dark"
        position="relative"
        borderRadius="xl"
        sx={{ overflow: "hidden" }}
      >
        <MKBox
          component="img"
          src={bgImage}
          alt="pattern-lines"
          position="absolute"
          top={0}
          left={0}
          width="100%"
          zIndex={1}
          opacity={0.2}
        />
        <Container sx={{ position: "relative", zIndex: 2, py: 12 }}>
          <Grid container item xs={12} md={7} justifyContent="center" mx="auto" textAlign="center">
            <MKTypography variant="h3" color="white" mb={1}>
              Envie de tester ?
            </MKTypography>
            <MKTypography variant="body2" color="white" mb={6} sx={{ textAlign: "left" }}>
              Si c&apos;est le cas, et bien c&apos;est gratuit. Cependant, pour l&apos;instant, les
              comptes sont disponibles sur demande uniquement. Si vous souhaitez tester
              l&apos;application, veuillez demander un compte via le formulaire de contact
              ci-dessous.
            </MKTypography>
            <MKButton
              variant="gradient"
              color="info"
              size="large"
              component="a"
              href="/contact"
              sx={{ mb: 2 }}
            >
              Demander un compte
            </MKButton>
          </Grid>
        </Container>
      </MKBox>
    </MKBox>
  );
}

export default Download;
