import { Box } from "@mui/material";

export default function CameraView({ videoRef, canvasRef, children }) {
  return (
    <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", bgcolor: "#111" }}>
      <Box
        component="video"
        ref={videoRef}
        playsInline
        muted
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)",
        }}
      />
      <Box
        component="canvas"
        ref={canvasRef}
        sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />
      {children}
    </Box>
  );
}
