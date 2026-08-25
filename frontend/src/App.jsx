import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TryOn from "./pages/TryOn";
import ProductDetails from "./pages/ProductDetails";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/try-on" element={<TryOn />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </ThemeProvider>
  );
}
