import {
  Box,
  Grow,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import type { User } from "../../types/user";
import { useChallengeCountdown } from "../../hooks/useChallengeCountdown";
import { CHALLENGE_DURATION_SECONDS } from "../../mock/constants";
import AvatarMenu from "../AvatarMenu";

interface AppBarProps extends MuiAppBarProps {
  theme?: Theme;
}

interface AppHeaderProps {
  user: User;
  pageTitle: string;
}

const typoStyle = {
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  lineHeight: 1
};

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  height: theme.tokens.header.height
}));

const AppHeader = React.forwardRef<HTMLDivElement, AppHeaderProps>(
  (props, ref) => {
    const { user, pageTitle } = props;
    const { t, i18n } = useTranslation("app");
    const currentLang = i18n.language?.startsWith("de") ? "de" : "en";
    const theme = useTheme();

    const { ended, minutesLabel, secondsLabel } = useChallengeCountdown(
      CHALLENGE_DURATION_SECONDS
    );

    return (
      <AppBar ref={ref} position="fixed" sx={{ width: "100vw" }}>
        <Toolbar sx={{ bgcolor: "common.black" }}>
          <Box sx={{ width: "100%", flexDirection: "row", display: "flex" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap"
              }}
            >
              {ended ? (
                <Typography
                  variant="subtitle2"
                  component="div"
                  color="warning.light"
                  sx={{ fontWeight: 600 }}
                  id="challenge-ended-label"
                >
                  {t("challenge.ended")}
                </Typography>
              ) : (
                <Typography
                  variant="h6"
                  component="div"
                  color="primary"
                  aria-live="polite"
                >
                  {minutesLabel}:{secondsLabel}
                </Typography>
              )}
              <ToggleButtonGroup
                exclusive
                size="small"
                value={currentLang}
                disabled={ended}
                onChange={(_, value: string | null) => {
                  if (value) i18n.changeLanguage(value);
                }}
                aria-label={t("language.ariaLabel")}
                sx={{
                  "& .MuiToggleButton-root": {
                    color: "common.white",
                    borderColor: "rgba(255,255,255,0.35)",
                    py: 0.25,
                    px: 1,
                    minWidth: 40
                  },
                  "& .MuiToggleButton-root.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "common.black",
                    borderColor: "primary.main",
                    "&:hover": { bgcolor: "primary.light" }
                  }
                }}
              >
                <ToggleButton value="en">{t("language.en")}</ToggleButton>
                <ToggleButton value="de">{t("language.de")}</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box sx={{ width: 20, height: 20, flex: 1 }} />
            <Box sx={{ flex: 2 }}>
              <Typography
                sx={{
                  ...typoStyle,
                  color: theme.palette.primary.main,
                  mb: theme.spacing(0.5)
                }}
                variant="h6"
                component="div"
              >
                {t("appTitle").toLocaleUpperCase()}
              </Typography>
              <Typography
                sx={{ ...typoStyle }}
                variant="overline"
                component="div"
                noWrap
              >
                {pageTitle.toLocaleUpperCase()}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, justifyContent: "flex-end", display: "flex" }}>
              {user && user.eMail && (
                <Grow in={Boolean(user && user.eMail)}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AvatarMenu user={user} challengeEnded={ended} />
                  </Box>
                </Grow>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }
);

export default AppHeader;
