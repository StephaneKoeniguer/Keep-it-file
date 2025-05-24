import { Container, Grid, Divider } from "@mui/material/";
import MKBox from "../../../components/Box";
import DefaultCounterCard from "../../../components/Cards/CounterCards/DefaultCounterCard";

function Counters() {
  return (
    <MKBox component="section" py={3}>
      <Container>
        <Grid container item xs={12} lg={9} sx={{ mx: "auto" }}>
          <Grid item xs={12} md={4}>
            <DefaultCounterCard
              count={1000}
              suffix="+"
              title="Documents Stockés"
              description="Gérez, organisez et accédez facilement à vos documents  sur notre plateforme."
            />
          </Grid>
          <Grid item xs={12} md={4} display="flex">
            <Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, mx: 0 }} />
            <DefaultCounterCard
              count={24}
              suffix="h"
              title="Disponibilité"
              description="Accédez à vos fichiers à tout moment."
            />
            <Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, ml: 0 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <DefaultCounterCard
              count={5}
              suffix="GB"
              title="Espace Gratuit"
              description="Bénéficiez de 5 Go d'espace gratuit pour stocker vos documents en toute sécurité."
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Counters;
