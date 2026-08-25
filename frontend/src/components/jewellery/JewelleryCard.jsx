import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";

export default function JewelleryCard({ item, selected, onClick }) {
  return (
    <Card
      variant="outlined"
      sx={{
        flex: "0 0 104px",
        borderColor: selected ? "secondary.main" : "divider",
        borderWidth: selected ? 2 : 1,
        bgcolor: "rgba(255,255,255,.92)",
      }}
    >
      <CardActionArea onClick={onClick}>
        <Box sx={{ height: 88, display: "grid", placeItems: "center", bgcolor: "#F4EEE5" }}>
          <Box component="img" src={item.image_url} alt={item.name} sx={{ maxWidth: "78%", maxHeight: "78%", objectFit: "contain" }} />
        </Box>
        <CardContent sx={{ p: 1.1, "&:last-child": { pb: 1.1 } }}>
          <Typography variant="caption" fontWeight={700} noWrap display="block">{item.name.replace("Demo ", "")}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
