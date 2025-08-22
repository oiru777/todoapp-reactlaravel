import React from "react";
import {
  Box,
  Typography,
  Modal,
  Button,
} from "@mui/material";

interface ConfirmStatusModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetLabel: string; // "完了" or "未完了"
  message?: string;
}

const ConfirmStatusModal: React.FC<ConfirmStatusModalProps> = ({
  open,
  onClose,
  onConfirm,
  targetLabel,
  message = "",
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          width: 320,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6">
          {targetLabel}に切り替えますか？
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button variant="contained" fullWidth onClick={onConfirm}>
            はい
          </Button>
          <Button variant="outlined" onClick={onClose} fullWidth>
            キャンセル
          </Button>
        </Box>

        {message && (
          <Typography color="error" variant="body2">
            {message}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default ConfirmStatusModal;
