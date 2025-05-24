/* eslint-disable */
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "../shared/context";
import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Sidenav from "./examples/Sidenav";
import Configurator from "./examples/Configurator";
import ConfigsButton from "./examples/ConfigButton";
import theme from "../shared/assets/theme";
import themeDark from "../shared/assets/theme-dark";
import brandWhite from "./assets/images/logo-ct.png";
import brandDark from "./assets/images/logo-ct-dark.png";
import routes from "./backRoutes";

import { useAuth } from "../shared/context/AuthProvider";
import ProtectedRoute from "./examples/ProtectedRoutes";

export default function AppBack() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // Appel de la fonction logout
  };

  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);


  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={
              <ProtectedRoute>
                {route.component}
              </ProtectedRoute>
            }
            key={route.key}
          />
        );
      }

      return null;
    });

  // display navBar for routes in BackRoutes.js (not Page d'accueil)
  const isPathInRoutes = (allRoutes, path) => {
    for (const route of allRoutes) {
      if (route.collapse) {
        if (isPathInRoutes(route.collapse, path)) return true;
      }

      if (route.route === path) return true;
    }
    return false;
  };


  return (
    isPathInRoutes(routes, pathname) && pathname !== "/" ? (
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <CssBaseline />
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="Keep It File"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          <ConfigsButton onClick={handleConfiguratorOpen} />
          {layout === "vr" && <Configurator />}
          <Routes>
            {getRoutes(routes)}
          </Routes>
        </>
      </ThemeProvider>
    ) : null
  );

}
