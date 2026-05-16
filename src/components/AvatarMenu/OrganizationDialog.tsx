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

export interface OrganizationDialogProps {
  open: boolean;
  organizationName: string;
  onClose: () => void;
  onSave: (name: string) => void;
}

const OrganizationDialog: React.FC<OrganizationDialogProps> = ({
  open,
  organizationName,
  onClose,
  onSave
}) => {
  const { t } = useTranslation("app");
  const [orgName, setOrgName] = React.useState(organizationName);

  React.useEffect(() => {
    if (open) {
      setOrgName(organizationName);
    }
  }, [open, organizationName]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
        <Button onClick={onClose}>{t("common.cancel")}</Button>
        <Button
          onClick={() => onSave(orgName)}
          variant="contained"
          color="primary"
        >
          {t("common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrganizationDialog;
