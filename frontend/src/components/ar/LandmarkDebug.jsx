import { Box, Chip, Stack, Typography } from "@mui/material";

export default function LandmarkDebug({ enabled, landmarks, fps, faceCount, poseStatus }) {
  if (!enabled) return null;

  return (
    <Box sx={{ position: "absolute", top: 76, left: 12, zIndex: 10, p: 1.2, borderRadius: 2, bgcolor: "rgba(0,0,0,.68)", color: "#fff" }}>
      <Typography variant="caption" display="block">DEBUG</Typography>
      <Stack direction="row" spacing={0.7} flexWrap="wrap">
        <Chip size="small" label={`Face: ${faceCount}`} />
        <Chip size="small" label={`FPS: ${fps}`} />
        <Chip size="small" label={`Pose: ${poseStatus}`} />
        <Chip size="small" label={`Landmarks: ${landmarks?.length || 0}`} />
      </Stack>
    </Box>
  );
}
