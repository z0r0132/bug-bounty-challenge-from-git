import type { OsapiensThemeTokens } from "./tokens";

declare module "@mui/material/styles" {
  interface Theme {
    tokens: OsapiensThemeTokens;
  }
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    mobile: true;
    tablet: true;
    laptop: true;
    desktop: true;
  }
}
