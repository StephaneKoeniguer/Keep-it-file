import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Grid } from "@mui/material/";
import MKBox from "../../../components/Box";
import MKTypography from "../../../components/Typography";
import MKInput from "../../../components/Input";
import MKButton from "../../../components/Button";
import DefaultNavbar from "../../../components/Navbars/DefaultNavbar";
import SimpleFooter from "../../../components/Footers/SimpleFooter";
import routes from "../../../frontRoutes";
import bgImage from "../../../assets/images/shapes/waves-white.svg";
import { useAuth } from "../../../../shared/context/AuthProvider";
import UserAPI from "../../../../back/api/users";
import Typography from "@mui/material/Typography";

function SignInBasic() {
  const [emailError, setEmailError] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // validate email format
  const validateInputs = () => {
    const email = document.getElementById("email");
    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Saisir un email valide");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    return isValid;
  };

  const connectUser = async (formData) => {
    try {
      // Data conversion to JSON
      const data = {
        username: formData.get("email"),
        password: formData.get("password"),
      };

      // Call API
      const user = await UserAPI.ConnectUser(data);
      login(user);
      navigate("/dashboard");
    } catch (error) {
      setLoginError("Adresse email ou mot de passe incorrect.");
    }
  };

  // on submit form
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoginError("");

    if (emailError) {
      return;
    }
    const data = new FormData(event.currentTarget);
    connectUser(data);
  };

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
                <MKTypography variant="h3" fontWeight="medium" color="white" mt={1}>
                  Connexion
                </MKTypography>
              </MKBox>
              <MKBox pt={4} pb={3} px={3}>
                <MKBox component="form" onSubmit={handleSubmit}>
                  <MKBox mb={2}>
                    {loginError && (
                      <Typography variant="body1" color="error" textAlign="center" sx={{ mb: 2 }}>
                        {loginError}
                      </Typography>
                    )}

                    <MKInput
                      id="email"
                      type="email"
                      label="Email"
                      name="email"
                      required
                      fullWidth
                      error={emailError}
                      color={emailError ? "error" : "primary"}
                    />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      type="password"
                      label="mot de passe"
                      name="password"
                      required
                      fullWidth
                    />
                  </MKBox>
                  <MKBox mt={4} mb={1}>
                    <MKButton
                      type="submit"
                      variant="gradient"
                      color="info"
                      fullWidth
                      onClick={validateInputs}
                    >
                      se connecter
                    </MKButton>
                  </MKBox>
                  <MKBox mt={3} mb={1} textAlign="center">
                    <MKTypography variant="button" color="text">
                      Pas de compte ?{" "}
                      <MKTypography
                        component={Link}
                        to="/register"
                        variant="button"
                        color="info"
                        fontWeight="medium"
                        textGradient
                      >
                        Créer un compte
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

export default SignInBasic;
