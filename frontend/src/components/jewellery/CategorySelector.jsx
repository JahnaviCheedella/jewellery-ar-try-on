import { Box, Chip } from "@mui/material";

export default function CategorySelector({ categories, value, onChange }) {
  return (
    <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 0.5, "&::-webkit-scrollbar": { display: "none" } }}>
      {categories.map((category) => (
        <Chip
          key={category.slug}
          label={category.name}
          clickable
          color={value === category.slug ? "secondary" : "default"}
          variant={value === category.slug ? "filled" : "outlined"}
          onClick={() => onChange(category.slug)}
          sx={{ flexShrink: 0, bgcolor: value === category.slug ? undefined : "rgba(255,255,255,.82)" }}
        />
      ))}
    </Box>
  );
}
