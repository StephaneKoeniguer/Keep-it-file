/* eslint-disable */
import MKBox from "../../components/Box";
import DefaultNavbar from "../../components/Navbars/DefaultNavbar";
import routes from "../../frontRoutes";
import { Card } from "@mui/material";
import footerRoutes from "../../components/Footers/footer.routes";
import DefaultFooter from "../../components/Footers/DefaultFooter";
import bgImage from "../../assets/images/background-accueil.jpg";

function Legals() {

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
      />
      <Card
        sx={{
          p: 2,
          mx: { xs: 2, lg: 3 },
          mt: -80,
          mb: 4,
          backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <MKBox mt={2} width="80%" mx="auto">
          <h2>Conditions Générales d'Utilisation et Mentions Légales</h2>
          <MKBox mt={2}>
            <MKBox mt={1}>
              Date de publication : 19 mars 2025
            </MKBox>
            <h3>1. Introduction</h3>
            <p>
              Bienvenue sur notre plateforme de stockage de fichiers (ci-après dénommée "Keep It File").
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la Plateforme.
              En utilisant nos services, vous acceptez sans réserve les présentes CGU.
            </p>
          </MKBox>
          <MKBox mt={2}>
            <h3>2. Partie I : Conditions Générales d'Utilisation (CGU)</h3>
            <MKBox mt={1}>
              <strong>2.1. Préalable</strong>
              <br />
              En utilisant la Plateforme, vous acceptez sans réserve les présentes CGU.
            </MKBox>
            <MKBox mt={1}>
              <strong>2.2. Description des services</strong>
              <br />
              La Plateforme permet aux utilisateurs de stocker, gérer et partager des fichiers en ligne. Les fonctionnalités incluent :
              <MKBox sx={{ marginLeft: "2rem"}}>
                <ul>
                  <li>Le téléversement et la sauvegarde de fichiers.</li>
                  <li>L'accès et le partage des fichiers stockés.</li>
                </ul>
              </MKBox>
            </MKBox>
            <MKBox mt={1}>
              <strong>2.3. Obligations des utilisateurs</strong>
              <br />
              L'accès à la Plateforme nécessite la création d'un compte utilisateur. Vous êtes responsable de
              la confidentialité de vos identifiants et de toutes les activités effectuées sous votre compte.
              <MKBox sx={{ marginLeft: "2rem"}}>
                <ul>
                  <li>Ne pas utiliser la Plateforme à des fins illégales ou contraires aux bonnes mœurs.</li>
                  <li>Ne pas téléverser de contenu illégal, offensant, ou portant atteinte aux droits de tiers.</li>
                  <li>Respecter les lois en vigueur, notamment celles relatives à la propriété intellectuelle.</li>
                </ul>
              </MKBox>
            </MKBox>
          </MKBox>
          <MKBox mt={2}>
            <h3>3. Partie II : Mentions Légales</h3>
            <MKBox mt={1}>
              <strong>3.1. Éditeur de la Plateforme</strong>
              <br />
              Contact : keepitFile@support.com
            </MKBox>
            <MKBox mt={1}>
              <strong>3.2. Hébergeur</strong>
              <br />
              Nom de l’hébergeur : o2switch
              <br />
              Adresse : Chemin des Pardiaux - 63000 Clermont-Ferrand
              <br />
              Contact : support@o2switch.fr
            </MKBox>
            <MKBox mt={1}>
              <strong>3.3. Données personnelles</strong>
              <br />
              Vos données personnelles sont collectées et traitées conformément à notre politique de confidentialité.
            </MKBox>
          </MKBox>
          <MKBox mt={1}>
              <strong>3.4. Propriété intellectuelle</strong>
              <br />
              Tous les contenus présents sur la Plateforme (textes, images, logos, etc.) sont protégés par les
              lois relatives à la propriété intellectuelle. Toute reproduction ou utilisation non autorisée
              est strictement interdite.
          </MKBox>
          <MKBox mt={1}>
              <strong>3.5. Données personnelles</strong>
              <br />
            Conformément à la loi "Informatique et Libertés" et au RGPD, vous disposez d'un droit d'accès,
            de rectification et de suppression de vos données personnelles. Vous pouvez exercer ce droit
            en nous contactant à l'adresse suivante : keepitFile@support.com
          </MKBox>
          <MKBox mt={1}>
            <strong>3.6. Limitations de responsabilité</strong>
            <br />
            Nous nous efforçons de garantir la disponibilité et la sécurité de la Plateforme,
            mais nous ne pouvons pas être tenus responsables des dommages directs ou indirects
            liés à l'utilisation de nos services.
          </MKBox>
          <MKBox mt={1}>
            <strong>3.7. Modification des CGU</strong>
            <br />
            Nous nous réservons le droit de modifier les présentes CGU à tout moment.
            Vous serez informé des modifications par le biais de la Plateforme.
          </MKBox>
          <MKBox mt={1}>
            <strong>3.8. Contact</strong>
            <br />
            Pour toute question concernant les présentes CGU, vous pouvez nous contacter
            à l'adresse suivante : <strong>keepitFile@support.com</strong>
          </MKBox>
        </MKBox>
      </Card>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Legals;
