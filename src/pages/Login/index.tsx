import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, useHistory } from "react-router-dom";
import { useUserStore } from "../../api/services/User";
import { ERoute } from "../../types/global";

const LoginPage: React.FC = () => {
  const { t } = useTranslation("app");
  const history = useHistory();
  const userStore = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState(false);

  if (userStore.sessionActive) {
    return <Redirect to={ERoute.HOME} />;
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(false);
    const ok = userStore.login(email, password);
    if (!ok) {
      setSubmitError(true);
      return;
    }
    history.replace(ERoute.HOME);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            {t("login.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("login.subtitle")}
          </Typography>
          <form onSubmit={onSubmit} noValidate>
            <TextField
              fullWidth
              required
              margin="normal"
              id="email"
              name="email"
              label={t("login.email")}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={submitError}
              aria-invalid={submitError}
            />
            <TextField
              fullWidth
              required
              margin="normal"
              id="password"
              name="password"
              label={t("login.password")}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={submitError}
              aria-invalid={submitError}
            />
            {submitError && (
              <Typography color="error" variant="caption" sx={{ display: "block", mt: 1 }}>
                {t("login.errorEmpty")}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              {t("login.submit")}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default observer(LoginPage);
