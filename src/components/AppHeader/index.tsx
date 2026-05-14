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
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User } from "../../api/services/User/store";
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

    const [count, setCount] = useState(0);
    const hours = 1;
    const minutes = hours * 60;
    const seconds = minutes * 60;
    const countdown = Math.max(0, seconds - count);
    const countdownMinutes = String(Math.floor(countdown / 60)).padStart(
      2,
      "0"
    );
    const countdownSeconds = String(countdown % 60).padStart(2, "0");

    useEffect(() => {
      const intervalId = window.setInterval(() => {
        setCount((c) => c + 1);
      }, 1000);
      return () => window.clearInterval(intervalId);
    }, []);

    return (
    <AppBar ref={ref} position="fixed" sx={{ width: "100vw" }}>
      <Toolbar sx={{ background: "#08140C 0% 0% no-repeat padding-box" }}>
        <Box sx={{ width: "100%", flexDirection: "row", display: "flex" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" component="div" color="primary">
              {countdownMinutes}:{countdownSeconds}
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={currentLang}
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
                <Box sx={{ display: "flex" }}>
                  <AvatarMenu user={user} />
                </Box>
              </Grow>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default AppHeader;
