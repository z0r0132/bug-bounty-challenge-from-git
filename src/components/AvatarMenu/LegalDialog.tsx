import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export type LegalDialogVariant = "privacy" | "imprint";

export interface LegalDialogProps {
  open: boolean;
  variant: LegalDialogVariant;
  onClose: () => void;
}

const titleKey: Record<LegalDialogVariant, string> = {
  privacy: "legal.privacyTitle",
  imprint: "legal.imprintTitle"
};

const bodyKey: Record<LegalDialogVariant, string> = {
  privacy: "legal.privacyBody",
  imprint: "legal.imprintBody"
};

const LegalDialog: React.FC<LegalDialogProps> = ({ open, variant, onClose }) => {
  const { t } = useTranslation("app");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t(titleKey[variant])}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
          {t(bodyKey[variant])}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common.close")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LegalDialog;
