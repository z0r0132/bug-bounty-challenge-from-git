import { mdiLogoutVariant, mdiTag } from "@mdi/js";
import Icon from "@mdi/react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { indigo } from "@mui/material/colors";
import Menu from "@mui/material/Menu";
import { useTheme } from "@mui/material/styles";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useUserStore } from "../../api/services/User";
import { User } from "../../api/services/User/store";
import { DEFAULT_ORGANIZATION } from "../../mock/organization";

interface AvatarMenuProps {
  user: User;
  challengeEnded?: boolean;
}

const getInitials = (user: User) => {
  if (user.firstName || user.lastName) {
    const initials = [user.firstName, user.lastName]
      .map((n) => (n?.[0] ? n[0].toLocaleUpperCase() : ""))
      .join("");
    return initials;
  }
  return "";
};

const stringAvatar = (user: User) => {
  const initials = getInitials(user);
  const r = Math.floor(parseInt(initials[0] ? initials[0] : "k", 36) * 7);
  const g = Math.floor(parseInt(initials[1] ? initials[1] : "l", 36) * 7);
  const b = Math.floor(
    parseInt(user?.firstName?.[1] ? user.firstName[1] : "m", 36) * 7
  );
  return {
    sx: { bgcolor: `rgb(${r},${g},${b})`, cursor: "pointer" },
    children: initials
  };
};

const AvatarMenu = observer((props: AvatarMenuProps) => {
  const { user, challengeEnded = false } = props;
  const userStore = useUserStore();
  const theme = useTheme();
  const { t } = useTranslation("app");
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [profileOpen, setProfileOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [imprintOpen, setImprintOpen] = useState(false);

  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [eMail, setEMail] = useState(user.eMail ?? "");
  const [orgName, setOrgName] = useState(userStore.organization.name);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (challengeEnded) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openProfile = () => {
    handleClose();
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setEMail(user.eMail ?? "");
    setProfileOpen(true);
  };

  const openOrg = () => {
    handleClose();
    setOrgName(userStore.organization.name);
    setOrgOpen(true);
  };

  const saveProfile = () => {
    userStore.updateProfile({ firstName, lastName, eMail });
    setProfileOpen(false);
    enqueueSnackbar(t("common.saved"), { variant: "success" });
  };

  const saveOrg = () => {
    const name = orgName.trim() || DEFAULT_ORGANIZATION.name;
    userStore.updateOrganization({ name });
    setOrgOpen(false);
    enqueueSnackbar(t("common.saved"), { variant: "success" });
  };

  const handleLogout = () => {
    handleClose();
    userStore.logout();
  };

  const avatarProps = stringAvatar(user);
  return (
    <div>
      <Tooltip
        title={
          (challengeEnded
            ? t("challenge.menuDisabledHint")
            : t("avatarMenu.openMenu")) as string
        }
      >
        <span>
          <Avatar
            onClick={handleClick}
            sx={{
              ...avatarProps.sx,
              ...(challengeEnded ? { opacity: 0.5, cursor: "not-allowed" } : {})
            }}
            aria-disabled={challengeEnded}
          >
            {avatarProps.children}
          </Avatar>
        </span>
      </Tooltip>
      <Menu
        id="user-menu"
        aria-labelledby="user-menu-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" p={1}>
          <Typography variant="subtitle2" color="textSecondary">
            {userStore.organization.name}
          </Typography>
          <Typography variant="h6">{`${user.firstName ?? ""} ${user.lastName ?? ""}`}</Typography>
          <Typography variant="body2" color="textSecondary">
            {user.eMail}
          </Typography>
          <Box m={1} />
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            disabled={challengeEnded}
            onClick={openProfile}
          >
            {t("avatarMenu.editProfile")}
          </Button>
        </Box>
        <Box
          p={1}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          style={{ color: theme.palette.grey[500] }}
        >
          <Button
            color="inherit"
            variant="text"
            size="small"
            disabled={challengeEnded}
            onClick={openOrg}
          >
            <Icon path={mdiTag} size={0.75} />
            <Box m={0.5} />
            {t("avatarMenu.editOrganization")}
          </Button>
        </Box>
        <Divider />
        <Box display="flex" flexDirection="column" alignItems="center" p={2}>
          <Tooltip title={t("logout") as string}>
            <Button onClick={handleLogout} variant="text">
              <Icon path={mdiLogoutVariant} size={1} />
              <Box m={0.5} />
              {t("logout")}
            </Button>
          </Tooltip>
        </Box>
        <Divider />
        <Box display="flex" flexDirection="row" alignItems="center" p={2}>
          <Button
            variant="text"
            size="small"
            onClick={() => {
              handleClose();
              setPrivacyOpen(true);
            }}
            style={{
              color: indigo[500],
              textTransform: "none"
            }}
          >
            {t("avatarMenu.dataPrivacy")}
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => {
              handleClose();
              setImprintOpen(true);
            }}
            style={{
              color: indigo[500],
              textTransform: "none"
            }}
          >
            {t("avatarMenu.imprint")}
          </Button>
        </Box>
      </Menu>

      <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t("profileDialog.title")}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label={t("profileDialog.firstName")}
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            margin="dense"
            label={t("profileDialog.lastName")}
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            margin="dense"
            label={t("profileDialog.email")}
            fullWidth
            type="email"
            value={eMail}
            onChange={(e) => setEMail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileOpen(false)}>{t("common.cancel")}</Button>
          <Button onClick={saveProfile} variant="contained" color="primary">
            {t("common.save")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={orgOpen} onClose={() => setOrgOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t("organizationDialog.title")}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label={t("organizationDialog.name")}
            fullWidth
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrgOpen(false)}>{t("common.cancel")}</Button>
          <Button onClick={saveOrg} variant="contained" color="primary">
            {t("common.save")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t("legal.privacyTitle")}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {t("legal.privacyBody")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrivacyOpen(false)}>{t("common.close")}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={imprintOpen} onClose={() => setImprintOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t("legal.imprintTitle")}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {t("legal.imprintBody")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImprintOpen(false)}>{t("common.close")}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default AvatarMenu;
