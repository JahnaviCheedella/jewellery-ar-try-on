import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack } from "@mui/material";
import { downloadDataUrl } from "../../utils/capture";

export default function CapturePreview({ open, image, onClose, onViewProduct }) {
  if (!image) return null;

  const share = async () => {
    try {
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], "nandi-virtual-try-on.jpg", { type: "image/jpeg" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Nandi Jewellers Virtual Try-On" });
      } else if (navigator.share) {
        await navigator.share({ title: "Nandi Jewellers Virtual Try-On", text: "My virtual try-on" });
      }
    } catch {
      // User cancelled sharing or browser does not support it.
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Your Try-On
        <IconButton onClick={onClose} sx={{ float: "right" }} aria-label="Close">
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box component="img" src={image} alt="Captured virtual try-on" sx={{ width: "100%", borderRadius: 3 }} />
      </DialogContent>
      <DialogActions sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
        <Button startIcon={<ReplayRoundedIcon />} onClick={onClose}>Retake</Button>
        <Button startIcon={<DownloadRoundedIcon />} onClick={() => downloadDataUrl(image)}>Download</Button>
        <Button startIcon={<IosShareRoundedIcon />} onClick={share}>Share</Button>
        <Button variant="contained" onClick={onViewProduct}>View Product</Button>
      </DialogActions>
    </Dialog>
  );
}
