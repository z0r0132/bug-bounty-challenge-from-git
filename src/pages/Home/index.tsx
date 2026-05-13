import { Box, Container, Typography } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useTranslation, Trans } from "react-i18next";

const ISSUE_KEYS = [
  "issue_1",
  "issue_2",
  "issue_3",
  "issue_4",
  "issue_5"
] as const;
const ISSUE_ICONS = ["🐞", "🐞", "🐞", "🐞", "⭐️"] as const;

const Home = () => {
  const { t } = useTranslation("app");
  const issues = ISSUE_KEYS.map((key, i) => ({
    id: i + 1,
    icon: ISSUE_ICONS[i],
    title: t(`home.issues.${key}.title`),
    description: t(`home.issues.${key}.description`)
  }));

  return (
    <Box p={2} maxHeight="calc(100vh - 64px)" overflow={["auto", "auto"]}>
      <Container>
        <Typography variant="h1" textAlign="center">
          {t("home.welcome")}
        </Typography>
        <Typography variant="subtitle1" textAlign="center">
          <Trans i18nKey="home.intro" components={{ b: <strong /> }} />
        </Typography>
        <Typography variant="body2" textAlign="center" color="textSecondary">
          {t("home.sidenote")}
        </Typography>
        <List>
          {issues.map((issue) => (
            <ListItem key={issue.id}>
              <Typography variant="h5" sx={{ p: 2 }}>
                {issue.icon}
              </Typography>
              <ListItemText
                primary={issue.title}
                secondary={issue.description}
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
};

export default observer(Home);
