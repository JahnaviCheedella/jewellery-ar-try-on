import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { Alert, Button, Stack } from "@mui/material";

export default function CameraError({ message, onRetry }) {
  return (
    <Stack spacing={2} sx={{ p: 3, alignItems: "center", textAlign: "center" }}>
      <ErrorOutlineRoundedIcon sx={{ fontSize: 48 }} />
      <Alert severity="error">{message}</Alert>
      <Button variant="contained" onClick={onRetry}>Try Again</Button>
    </Stack>
  );
}
