import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { Box, Button, Container, IconButton, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJewelleryById } from "../services/api";
import { DEMO_JEWELLERY } from "../utils/demoData";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const local = DEMO_JEWELLERY.find((x) => String(x.id) === String(id));
    setItem(local || null);
    getJewelleryById(id).then(setItem).catch(() => {});
  }, [id]);

  if (!item) {
    return <Container sx={{ py: 6 }}>Product not found.</Container>;
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, md: 5 } }}>
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          border: "1px solid",
          borderColor: "rgba(182, 138, 58, 0.2)",
          borderRadius: 5,
          bgcolor: "#FFFDF9",
          boxShadow: "0 12px 32px rgba(33, 29, 25, 0.08)",
        }}
      >
        {/* Top-right close cross button */}
        <IconButton
          onClick={() => navigate("/")}
          aria-label="Close product details"
          sx={{
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 10,
            bgcolor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            color: "#211D19",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 1)",
              color: "#B68A3A",
            },
          }}
        >
          <CloseRoundedIcon />
        </IconButton>

        {/* Product Image Box */}
        <Box sx={{ bgcolor: "#F4EEE5", display: "grid", placeItems: "center", py: { xs: 4, md: 5 }, px: 3 }}>
          <Box
            component="img"
            src={item.image_url || item.ar_asset_url}
            alt={item.name}
            onError={(e) => {
              if (item.ar_asset_url && !e.target.src.endsWith(item.ar_asset_url)) {
                e.target.src = item.ar_asset_url;
              }
            }}
            sx={{ width: "100%", maxWidth: 190, maxHeight: 190, objectFit: "contain" }}
          />
        </Box>
        <Stack spacing={2.2} sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="overline" color="secondary.main">DEMO PRODUCT</Typography>
          <Typography variant="h3">{item.name.replace("Demo ", "")}</Typography>
          <Typography variant="h5">₹{Number(item.price).toLocaleString("en-IN")}</Typography>
          <Typography color="text.secondary">{item.description}</Typography>
          <Typography>Purity: {item.purity}</Typography>
          <Typography>Approx. weight: {item.weight} g</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<CameraAltRoundedIcon />}
              onClick={() => navigate(`/try-on?category=${item.category}&id=${item.id}&autoStart=true`, {
                state: { item, category: item.category, autoStart: true }
              })}
              sx={{
                bgcolor: "#B68A3A",
                color: "#FFF",
                fontWeight: 700,
                "&:hover": { bgcolor: "#9B742D" },
              }}
            >
              Try On in AR
            </Button>
            <Button variant="outlined" onClick={() => window.location.href = "mailto:enquiries@nandijewellers.example?subject=Jewellery enquiry"}>Enquire Now</Button>
            <Button variant="outlined" startIcon={<FavoriteBorderRoundedIcon />}>Add to Wishlist</Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
