import { Box, Fade, Grow, Slide, SlideProps } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  matchPath,
  Route,
  RouteChildrenProps,
  Switch,
  useLocation
} from "react-router-dom";
import { PathParams, TRoute } from "../types/global";
import { validateParams } from "../utils/router";

interface UseMatchedRouteOptions {
  notFoundComponent?: React.FC;
  matchOnSubPath?: boolean;
  transition?:
    | "none"
    | "fade"
    | "grow"
    | "slide-up"
    | "slide-down"
    | "slide-left"
    | "slide-right";
}

const useMatchedRoute = (
  routes: ReadonlyArray<TRoute>,
  fallbackComponent?: React.FC,
  options?: UseMatchedRouteOptions
): {
  route: TRoute;
  params: PathParams | null;
  MatchedElement: JSX.Element;
} => {
  const { notFoundComponent, matchOnSubPath, transition = "fade" } =
    options || {};
  const { t } = useTranslation("app");
  const location = useLocation();
  // `exact`, `sensitive` and `strict` options are set to true
  // to ensure type safety.
  const results = routes
    .map((route: TRoute): {
      route: TRoute;
      match: any | null;
    } => ({
      route,
      match: matchPath(location.pathname, {
        path: route.path,
        sensitive: !matchOnSubPath
      })
    }))
    .filter(({ match }) => !!match && (matchOnSubPath ? true : match.isExact));
  const [firstResult] = results;
  const { match, route } = firstResult || {};
  const resolvedRoute = route ?? routes[0];
  if (!resolvedRoute) {
    throw new Error("useMatchedRoute requires at least one route");
  }
  const Fallback = fallbackComponent;
  const NotFound = notFoundComponent || (() => <>{t("common.notFound")}</>);

  const Transition: React.FC<{ match: any }> = React.useMemo(() => {
    if (transition === "fade") {
      const FadeTransition: React.FC<{ match: any }> = ({
        children,
        match
      }) => (
        <Fade in={match ? true : false} timeout={300} unmountOnExit>
          <Box height={"100%"}>{children}</Box>
        </Fade>
      );

      return FadeTransition;
    }

    if (transition === "grow") {
      const GrowTransition: React.FC<{ match: any }> = ({
        children,
        match
      }) => (
        <Grow in={match ? true : false} timeout={300} unmountOnExit>
          <Box height={"100%"}>{children}</Box>
        </Grow>
      );

      return GrowTransition;
    }

    if (transition.startsWith("slide")) {
      const [, direction] = transition.split("-");
      const slideDirection = direction as SlideProps["direction"];
      const SlideTransition: React.FC<{ match: any }> = ({
        children,
        match
      }) => (
        <Slide
          in={match ? true : false}
          direction={slideDirection}
          timeout={300}
          unmountOnExit
        >
          <Box height={"100%"}>{children}</Box>
        </Slide>
      );

      return SlideTransition;
    }
    const Passthrough: React.FC<{ match: any; children?: React.ReactNode }> = ({
      children
    }) => <>{children}</>;
    return Passthrough;
  }, [transition]);

  return {
    route: resolvedRoute,
    params:
      match && validateParams(resolvedRoute.path, match.params)
        ? match.params
        : {},
    MatchedElement: (
      <Switch>
        {matchOnSubPath &&
          routes.map(({ path, Component: RouteComponent }, i) => (
            <Route
              key={path + "matchOnSubPath"}
              path={`/${path.split("/").slice(1, 2)}/*`}
            >
              {({ match }: RouteChildrenProps) => (
                <Transition match={match}>
                  <RouteComponent />
                </Transition>
              )}
            </Route>
          ))}
        {routes.map(({ path, Component: RouteComponent }, i) => (
          <Route key={path + "root"} sensitive strict exact path={path}>
            {({ match }: RouteChildrenProps) => (
              <Transition match={match}>
                <RouteComponent />
              </Transition>
            )}
          </Route>
        ))}
        {Fallback && (
          <Transition match={true}>
            <Fallback />
          </Transition>
        )}
        {!Fallback && (
          <Transition match={true}>
            <Route component={NotFound} />
          </Transition>
        )}
      </Switch>
    )
  };
};

export default useMatchedRoute;
