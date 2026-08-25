import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

export default function CameraPermission({ onStart }) {
  return (
    <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", p: 3, bgcolor: "#211D19" }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: { xs: 3, sm: 5 },
          borderRadius: 5,
          textAlign: "center",
          bgcolor: "#FFFDF9",
        }}
      >
        <Stack spacing={2.5} alignItems="center">
          <Box sx={{ width: 72, height: 72, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: "#F3E9D9", color: "#9B702C" }}>
            <CameraAltRoundedIcon fontSize="large" />
          </Box>
          <Typography variant="h4">Try jewellery on yourself</Typography>
          <Typography color="text.secondary">
            Camera access is required for Virtual Try-On. Your camera stays on this device.
          </Typography>
          <Button fullWidth variant="contained" size="large" onClick={onStart}>
            Start Virtual Try-On
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
