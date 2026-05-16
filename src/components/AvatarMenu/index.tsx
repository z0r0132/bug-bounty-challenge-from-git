import { mdiLogoutVariant, mdiTag } from "@mdi/js";
import Icon from "@mdi/react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Tooltip,
  Typography
} from "@mui/material";
import { indigo } from "@mui/material/colors";
import Menu from "@mui/material/Menu";
import { useTheme } from "@mui/material/styles";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useUserStore } from "../../api/services/User";
import { DEFAULT_ORGANIZATION } from "../../mock/organization";
import { ERoute } from "../../types/global";
import type { User } from "../../types/user";
import { stringAvatar } from "./avatarUtils";
import LegalDialog, { LegalDialogVariant } from "./LegalDialog";
import OrganizationDialog from "./OrganizationDialog";
import ProfileDialog from "./ProfileDialog";

interface AvatarMenuProps {
  user: User;
  challengeEnded?: boolean;
}

const AvatarMenu = observer((props: AvatarMenuProps) => {
  const { user, challengeEnded = false } = props;
  const userStore = useUserStore();
  const history = useHistory();
  const theme = useTheme();
  const { t } = useTranslation("app");
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [profileOpen, setProfileOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState<LegalDialogVariant | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (challengeEnded) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    userStore.logout();
    history.replace(ERoute.LOGIN);
  };

  const saveProfile = (profile: Pick<User, "firstName" | "lastName" | "eMail">) => {
    userStore.updateProfile(profile);
    setProfileOpen(false);
    enqueueSnackbar(t("common.saved"), { variant: "success" });
  };

  const saveOrg = (name: string) => {
    const trimmed = name.trim() || DEFAULT_ORGANIZATION.name;
    userStore.updateOrganization({ name: trimmed });
    setOrgOpen(false);
    enqueueSnackbar(t("common.saved"), { variant: "success" });
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
            onClick={() => {
              handleClose();
              setProfileOpen(true);
            }}
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
          sx={{ color: theme.palette.grey[500] }}
        >
          <Button
            color="inherit"
            variant="text"
            size="small"
            disabled={challengeEnded}
            onClick={() => {
              handleClose();
              setOrgOpen(true);
            }}
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
              setLegalOpen("privacy");
            }}
            sx={{
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
              setLegalOpen("imprint");
            }}
            sx={{
              color: indigo[500],
              textTransform: "none"
            }}
          >
            {t("avatarMenu.imprint")}
          </Button>
        </Box>
      </Menu>

      <ProfileDialog
        open={profileOpen}
        user={user}
        onClose={() => setProfileOpen(false)}
        onSave={saveProfile}
      />
      <OrganizationDialog
        open={orgOpen}
        organizationName={userStore.organization.name}
        onClose={() => setOrgOpen(false)}
        onSave={saveOrg}
      />
      {legalOpen && (
        <LegalDialog
          open
          variant={legalOpen}
          onClose={() => setLegalOpen(null)}
        />
      )}
    </div>
  );
});

export default AvatarMenu;
