import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, getJewellery } from "../services/api";
import { DEMO_CATEGORIES, DEMO_JEWELLERY } from "../utils/demoData";

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(DEMO_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [items, setItems] = useState(DEMO_JEWELLERY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCategories()
        .then((cats) => {
          if (cats?.length) setCategories(cats);
        })
        .catch(() => { }),
      getJewellery()
        .then((data) => {
          if (data?.length) setItems(data);
          else setItems(DEMO_JEWELLERY);
        })
        .catch(() => setItems(DEMO_JEWELLERY)),
    ]).finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const handleTryOn = (item) => {
    navigate(`/try-on?category=${item.category}&id=${item.id}&autoStart=true`, {
      state: {
        item,
        category: item.category,
        autoStart: true,
      },
    });
  };

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "#FBF8F3" }}>
      {/* Header Bar */}
      <Box
        component="header"
        sx={{
          borderBottom: "1px solid",
          borderColor: "rgba(182, 138, 58, 0.2)",
          bgcolor: "rgba(255, 253, 249, 0.95)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          py: 2,
        }}
      >
        <Container
          maxWidth="lg"
        // sx={{
        //   display: "flex",
        //   justifyContent: "space-between",
        //   alignItems: "center",
        // }}
        >
          {/* <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}> */}
          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: ".15em",
              color: "#B68A3A",
            }}
          >
            NANDI JEWELLERS
          </Typography>
          {/* <Typography
              variant="caption"
              sx={{
                letterSpacing: ".2em",
                color: "#B68A3A",
                fontWeight: 800,
                display: { xs: "none", sm: "inline" },
              }}
            >
              JEWELLERS
            </Typography> */}
          {/* </Box> */}

          {/* <Button
            variant="contained"
            startIcon={<CameraAltRoundedIcon />}
            onClick={() => navigate("/try-on")}
            sx={{
              bgcolor: "#211D19",
              color: "#FFF",
              "&:hover": { bgcolor: "#B68A3A" },
            }}
          >
            Launch Camera AR
          </Button> */}
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 6 }, pb: 3 }}>
        <Box
          sx={{
            p: { xs: 3.5, md: 5 },
            borderRadius: 5,
            bgcolor: "#1E1A16",
            background:
              "radial-gradient(ellipse at 80% 20%, #6E5325 0%, #29231D 50%, #151310 100%)",
            color: "#FFF",
            position: "relative",
            overflow: "hidden",
            mb: 5,
            boxShadow: "0 16px 36px rgba(33, 29, 25, 0.15)",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Chip
                icon={<AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: "#D8B46A !important" }} />}
                label="LIVE AR EXPERIENCE"
                size="small"
                sx={{
                  bgcolor: "rgba(216, 180, 106, 0.15)",
                  color: "#E2C382",
                  fontWeight: 700,
                  letterSpacing: ".1em",
                  border: "1px solid rgba(216, 180, 106, 0.3)",
                  mb: 2,
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2rem", md: "3.2rem" },
                  color: "#FFF",
                  fontWeight: 500,
                  mb: 1.5,
                }}
              >
                Virtual Jewellery Try-On
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.78)",
                  maxWidth: 580,
                  fontSize: { xs: 15, md: 17 },
                }}
              >
                Select any jewellery piece below and tap <strong>Try On</strong> to instantly see it on your face or body in real-time AR.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Category Tabs */}
        <Box sx={{ mb: 4, borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedCategory}
            onChange={(_, val) => setSelectedCategory(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                fontWeight: 700,
                fontSize: 15,
                textTransform: "none",
                minHeight: 48,
              },
              "& .Mui-selected": {
                color: "#B68A3A !important",
              },
              "& .MuiTabs-indicator": {
                bgcolor: "#B68A3A",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            <Tab label={`All Collections (${items.length})`} value="all" />
            {categories.map((cat) => {
              const count = items.filter((x) => x.category === cat.slug).length;
              return (
                <Tab
                  key={cat.slug}
                  label={`${cat.name} (${count})`}
                  value={cat.slug}
                />
              );
            })}
          </Tabs>
        </Box>

        {/* Jewellery Products Grid */}
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
          {filteredItems.map((item) => (
            <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={item.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "rgba(182, 138, 58, 0.18)",
                  bgcolor: "#FFFDF9",
                  transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 28px rgba(182, 138, 58, 0.16)",
                    borderColor: "#B68A3A",
                  },
                }}
              >
                {/* Product Image Area */}
                <Box
                  sx={{
                    bgcolor: "#F7F2EA",
                    position: "relative",
                    p: { xs: 1.5, sm: 2.5, md: 3 },
                    display: "grid",
                    placeItems: "center",
                    minHeight: { xs: 140, sm: 180, md: 210 },
                  }}
                >
                  <Box
                    component="img"
                    src={item.image_url || item.ar_asset_url}
                    alt={item.name}
                    onError={(e) => {
                      if (item.ar_asset_url && !e.target.src.endsWith(item.ar_asset_url)) {
                        e.target.src = item.ar_asset_url;
                      }
                    }}
                    sx={{
                      maxWidth: { xs: 90, sm: 130, md: 150 },
                      maxHeight: { xs: 90, sm: 130, md: 150 },
                      objectFit: "contain",
                    }}
                  />
                  <Chip
                    label={item.purity ? `${item.purity} ${item.material}` : item.category}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(4px)",
                      fontWeight: 700,
                      fontSize: 11,
                      color: "#6F665D",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  />
                </Box>

                {/* Product Info */}
                <CardContent sx={{ flexGrow: 1, pb: 1, pt: { xs: 1, sm: 2 }, px: { xs: 1.5, sm: 2 } }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: 13, sm: 15, md: 17 },
                      fontWeight: 700,
                      color: "#211D19",
                      mb: 0.5,
                      lineHeight: 1.3,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.name.replace("Demo ", "")}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6F665D",
                      fontSize: { xs: 11, sm: 13 },
                      mb: 1,
                      display: { xs: "none", sm: "-webkit-box" },
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.description}
                  </Typography>

                  <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: "#B68A3A",
                        fontSize: { xs: 13, sm: 16, md: 18 },
                      }}
                    >
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </Typography>
                    {item.weight && (
                      <Typography variant="caption" sx={{ color: "#8E8478", fontWeight: 600, display: { xs: "none", sm: "block" } }}>
                        {item.weight}g
                      </Typography>
                    )}
                  </Stack>
                </CardContent>

                {/* Actions */}
                <CardActions sx={{ p: { xs: 1, sm: 1.5, md: 2 }, pt: 0, display: "flex", gap: 0.75 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<CameraAltRoundedIcon sx={{ fontSize: { xs: 14, sm: 18 } }} />}
                    onClick={() => handleTryOn(item)}
                    sx={{
                      bgcolor: "#B68A3A",
                      color: "#FFF",
                      fontWeight: 700,
                      borderRadius: 3,
                      py: { xs: 0.75, sm: 1 },
                      fontSize: { xs: 12, sm: 14 },
                      "&:hover": {
                        bgcolor: "#9B742D",
                      },
                    }}
                  >
                    Try On
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/product/${item.id}`)}
                    sx={{
                      minWidth: { xs: 34, sm: 44 },
                      px: { xs: 0.75, sm: 1.5 },
                      borderRadius: 3,
                      borderColor: "rgba(0,0,0,0.12)",
                      color: "#6F665D",
                      "&:hover": {
                        borderColor: "#211D19",
                        color: "#211D19",
                      },
                    }}
                    aria-label="View Details"
                  >
                    <InfoOutlinedIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
