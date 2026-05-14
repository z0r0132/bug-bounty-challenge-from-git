import {
  Alert,
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Slide
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useUserStore } from "../../api/services/User";
import AppHeader from "../../components/AppHeader";
import useMatchedRoute from "../../hooks/useMatchedRoute";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation
} from "react-router-dom";
import { TRoute, ERoute } from "../../types/global";
import AccessDenied from "../AccessDenied";
import LoginPage from "../Login";
import { routes as useRoutes } from "../routes";

const hideSplashScreen = () => {
  const splashscreen = document.getElementById("app-splashscreen");

  if (splashscreen) {
    splashscreen.className = "";
    setTimeout(() => {
      splashscreen.remove();
    }, 300);
  }
};

const MainLayout = observer(() => {
  const { t } = useTranslation("app");
  const userStore = useUserStore();
  const { user, userLoading, userLoadError } = userStore;
  const theme = useTheme();
  const location = useLocation();
  const history = useHistory();
  const routes: TRoute[] = [...useRoutes];
  const [fallbackRoute] = routes;
  const Fallback = fallbackRoute.Component;
  const { route = fallbackRoute, MatchedElement } = useMatchedRoute(
    routes,
    Fallback,
    { matchOnSubPath: true }
  );

  let pageTitle = t(`routes.${route.path}`);

  if (
    route.path.indexOf("data") > -1 ||
    route.path.indexOf("settings") > -1
  ) {
    const [, groupName] = route.path.split("/");
    pageTitle = t(`routes./${groupName}`);
  }

  const loadingApp = false;
  const accessDenied = false;

  useEffect(() => {
    if (location.pathname === ERoute.ROOT) {
      history.replace(ERoute.HOME);
    }
  }, [location.pathname, history]);

  useEffect(() => {
    if (!user && !userLoadError) {
      userStore.getOwnUser();
    }
  }, [user, userLoadError, userStore]);

  if (accessDenied) {
    return <AccessDenied />;
  }

  if (location.pathname === ERoute.ROOT) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress color="primary" aria-label={t("common.loading")} />
      </Box>
    );
  }

  const showUserError = !userLoading && !!userLoadError && !user;

  return (
    <div
      id="portal-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh"
      }}
    >
      {loadingApp && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <CircularProgress color="primary" size={100} />
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "#f5f5f5"
        }}
      >
        <Slide direction="down" in={!loadingApp} mountOnEnter>
          <AppHeader user={user ?? {}} pageTitle={pageTitle} />
        </Slide>
        {userLoading && (
          <LinearProgress
            sx={{
              position: "fixed",
              top: theme.tokens.header.height,
              left: 0,
              width: "100%",
              zIndex: theme.zIndex.appBar
            }}
            aria-busy="true"
          />
        )}
        <Box
          component="main"
          sx={{
            position: "relative",
            height: `calc(100% - ${theme.tokens.header.height})`,
            width: "100%",
            marginTop:
              theme.tokens.header.height /* Necessary because of AppBar */
          }}
        >
          {showUserError && (
            <Box sx={{ p: 2, maxWidth: 480, mx: "auto" }}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {userLoadError}
              </Alert>
              <Button
                variant="contained"
                onClick={() => userStore.retryLoadUser()}
              >
                {t("common.retry")}
              </Button>
            </Box>
          )}
          {!showUserError && user && MatchedElement}
          {!showUserError && !user && userLoading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="40vh"
            >
              <CircularProgress aria-label={t("common.loading")} />
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
});

const Root = observer(() => {
  const userStore = useUserStore();

  useEffect(() => {
    hideSplashScreen();
  }, []);

  return (
    <Switch>
      <Route exact path={ERoute.LOGIN} component={LoginPage} />
      <Route
        render={() =>
          userStore.sessionActive ? (
            <MainLayout />
          ) : (
            <Redirect to={ERoute.LOGIN} />
          )
        }
      />
    </Switch>
  );
});

export default Root;
