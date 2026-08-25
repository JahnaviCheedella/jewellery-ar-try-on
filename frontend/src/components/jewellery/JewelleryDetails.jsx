import { Button, Divider, Stack, Typography } from "@mui/material";

export default function JewelleryDetails({ item, onViewProduct }) {
  if (!item) return null;

  return (
    <Stack spacing={1.2}>
      <Typography variant="h6">{item.name.replace("Demo ", "")}</Typography>
      <Typography variant="body2" color="text.secondary">{item.description}</Typography>
      <Typography variant="h6">₹{Number(item.price).toLocaleString("en-IN")}</Typography>
      <Typography variant="caption" color="text.secondary">
        {item.purity} • {item.weight} g • {item.material}
      </Typography>
      <Divider />
      <Button variant="outlined" onClick={onViewProduct}>View Product</Button>
    </Stack>
  );
}
