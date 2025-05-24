/**

 Once you add a new route on this file it will be visible automatically on
  the Navbar.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `name` key is used for the name of the route on the Navbar.
  2. The `icon` key is used for the icon of the route on the Navbar.
  3. The `collapse` key is used for making a collapsible item on the Navbar that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  4. The `route` key is used to store the route location which is used for the react router.
  5. The `href` key is used to store the external links location.
  6. The `component` key is used to store the component of its route.
  7. The `dropdown` key is used to define that the item should open a dropdown for its collapse items .
  8. The `description` key is used to define the description of
          a route under its name.
  9. The `columns` key is used to define that how the content should look inside the dropdown menu as columns,
          you can set the columns amount based on this key.
  10. The `rowsPerColumn` key is used to define that how many rows should be in a column.
*/

// @mui material components
import Icon from "@mui/material/Icon";

// Pages
import ContactUs from "./layouts/pages/contact";
import SignIn from "./layouts/pages/authentication/login";
import Presentation from "./layouts/pages/accueil";
import SignUp from "./pages/authentication/register";
import Documents from "../back/layouts/documents";
import Images from "../back/layouts/images";
import Dashboard from "../back/layouts/dashboard";
import Profile from "../back/layouts/profile";
import LegalsPage from "./layouts/pages/legals";

const frontRoutes = [
  {
    name: "Menu",
    icon: <Icon>dashboard</Icon>,
    columns: 1,
    rowsPerColumn: 2,
    collapse: [
      {
        name: "Présentation",
        collapse: [
          {
            name: "accueil",
            route: "/",
            component: <Presentation />,
          },
          {
            name: "contact",
            route: "/contact",
            component: <ContactUs />,
          },
        ],
      },
      {
        name: "compte",
        collapse: [
          {
            name: "connexion",
            route: "/login",
            component: <SignIn />,
          },
          {
            name: "Créer un compte",
            route: "/register",
            component: <SignUp />,
          },
          {
            name: "Déconnexion",
            route: "/",
          },
          {
            name: "Tableau de bord",
            route: "/dashboard",
            component: <Dashboard />,
          },
          {
            name: "Documents",
            route: "/documents",
            component: <Documents />,
          },
          {
            name: "Images",
            route: "/images",
            component: <Images />,
          },
          {
            name: "Profil",
            route: "/profil",
            component: <Profile />,
          },
          {
            name: "Mentions legales",
            route: "/legals",
            component: <LegalsPage />,
          },
        ],
      },
    ],
  },
];

export default frontRoutes;
