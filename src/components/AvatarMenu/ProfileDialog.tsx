import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import type { User } from "../../types/user";

export interface ProfileDialogProps {
  open: boolean;
  user: User;
  onClose: () => void;
  onSave: (profile: Pick<User, "firstName" | "lastName" | "eMail">) => void;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({
  open,
  user,
  onClose,
  onSave
}) => {
  const { t } = useTranslation("app");
  const [firstName, setFirstName] = React.useState(user.firstName ?? "");
  const [lastName, setLastName] = React.useState(user.lastName ?? "");
  const [eMail, setEMail] = React.useState(user.eMail ?? "");

  React.useEffect(() => {
    if (open) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setEMail(user.eMail ?? "");
    }
  }, [open, user.firstName, user.lastName, user.eMail]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
        <Button onClick={onClose}>{t("common.cancel")}</Button>
        <Button
          onClick={() => onSave({ firstName, lastName, eMail })}
          variant="contained"
          color="primary"
        >
          {t("common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;
