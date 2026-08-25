import { Box } from "@mui/material";
import JewelleryCard from "./JewelleryCard";

export default function JewelleryCarousel({ items, selectedId, onSelect }) {
  return (
    <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1, px: 0.5, "&::-webkit-scrollbar": { height: 5 } }}>
      {items.map((item) => (
        <JewelleryCard key={item.id} item={item} selected={item.id === selectedId} onClick={() => onSelect(item)} />
      ))}
    </Box>
  );
}
