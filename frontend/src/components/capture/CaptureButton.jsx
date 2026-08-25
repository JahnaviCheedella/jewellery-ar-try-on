import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import { Fab } from "@mui/material";

export default function CaptureButton({ onClick, disabled }) {
  return (
    <Fab
      color="secondary"
      aria-label="Capture photo"
      onClick={onClick}
      disabled={disabled}
      sx={{
        width: 68,
        height: 68,
        border: "4px solid rgba(255,255,255,.9)",
        boxShadow: "0 8px 30px rgba(0,0,0,.28)",
      }}
    >
      <CameraAltRoundedIcon />
    </Fab>
  );
}
