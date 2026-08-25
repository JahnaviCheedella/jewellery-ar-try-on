import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Alert, Box, CircularProgress, IconButton, Snackbar, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import CameraPermission from "../components/camera/CameraPermission";
import CameraView from "../components/camera/CameraView";
import CameraError from "../components/camera/CameraError";
import ARCanvas from "../components/ar/ARCanvas";
import LandmarkDebug from "../components/ar/LandmarkDebug";
import CaptureButton from "../components/capture/CaptureButton";
import CapturePreview from "../components/capture/CapturePreview";
import useCamera from "../hooks/useCamera";
import useFaceLandmarker from "../hooks/useFaceLandmarker";
import usePoseLandmarker from "../hooks/usePoseLandmarker";
import { getCategories, getJewellery, trackEvent } from "../services/api";
import { captureComposite } from "../utils/capture";
import { DEMO_CATEGORIES, DEMO_JEWELLERY } from "../utils/demoData";

const SESSION_ID = crypto.randomUUID?.() || `session-${Date.now()}-${Math.random()}`;

export default function TryOn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const initialCat = location.state?.category || searchParams.get("category") || "earrings";
  const initialItemId = location.state?.item?.id || searchParams.get("id");
  const autoStart = location.state?.autoStart || searchParams.get("autoStart") === "true";

  const { videoRef, status: cameraStatus, error: cameraError, startCamera, stopCamera } = useCamera();
  const [started, setStarted] = useState(false);
  const [debug, setDebug] = useState(false);
  const [categories, setCategories] = useState(DEMO_CATEGORIES);
  const [category, setCategory] = useState(initialCat);

  const initialCategoryItems = useMemo(
    () => DEMO_JEWELLERY.filter((x) => x.category === initialCat),
    [initialCat]
  );

  const [items, setItems] = useState(initialCategoryItems);
  const [selected, setSelected] = useState(() => {
    if (location.state?.item) return location.state.item;
    if (initialItemId) {
      const match = DEMO_JEWELLERY.find((x) => String(x.id) === String(initialItemId));
      if (match) return match;
    }
    return initialCategoryItems[0];
  });

  const [capturedImage, setCapturedImage] = useState("");
  const [snack, setSnack] = useState("");
  const canvasRef = useRef(null);

  const poseEnabled = category === "necklaces";
  const face = useFaceLandmarker(videoRef, started);
  const pose = usePoseLandmarker(videoRef, poseEnabled);

  const start = async () => {
    const ok = await startCamera();
    if (ok) {
      setStarted(true);
      trackEvent({ event_name: "camera_started", session_id: SESSION_ID });
    }
  };

  useEffect(() => {
    trackEvent({ event_name: "try_on_opened", session_id: SESSION_ID });
    Promise.all([
      getCategories().then((cats) => {
        if (cats?.length) setCategories(cats);
      }).catch(() => { }),
    ]);

    if (autoStart) {
      start();
    }
  }, []);

  useEffect(() => {
    let active = true;
    getJewellery(category)
      .then((data) => {
        if (!active) return;
        const list = data?.length ? data : DEMO_JEWELLERY.filter((x) => x.category === category);
        setItems(list);

        setSelected((prev) => {
          if (prev && prev.category === category) {
            const same = list.find((x) => x.id === prev.id);
            if (same) return same;
          }
          if (initialItemId) {
            const requested = list.find((x) => String(x.id) === String(initialItemId));
            if (requested) return requested;
          }
          return list[0];
        });
      })
      .catch(() => {
        const fallback = DEMO_JEWELLERY.filter((x) => x.category === category);
        setItems(fallback);
        setSelected((prev) => (prev && prev.category === category ? prev : fallback[0]));
      });

    trackEvent({ event_name: "category_selected", category, session_id: SESSION_ID });
    return () => { active = false; };
  }, [category]);

  const currentCategory = useMemo(
    () => categories.find((x) => x.slug === category),
    [categories, category]
  );

  const selectItem = (item) => {
    setSelected(item);
    trackEvent({
      event_name: "jewellery_selected",
      jewellery_id: item.id,
      category: item.category,
      session_id: SESSION_ID,
    });
  };

  const capture = () => {
    try {
      const image = captureComposite(videoRef.current, canvasRef.current);
      setCapturedImage(image);
      setSnack("Photo captured");
      trackEvent({
        event_name: "photo_captured",
        jewellery_id: selected?.id,
        category,
        session_id: SESSION_ID,
      });
    } catch {
      setSnack("Could not capture the photo.");
    }
  };

  if (!started) {
    if (cameraStatus === "denied" || cameraStatus === "unavailable" || cameraStatus === "unsupported") {
      return (
        <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
          <CameraError message={cameraError} onRetry={start} />
        </Box>
      );
    }
    return <CameraPermission onStart={start} />;
  }

  const modelLoading = face.status === "loading";

  return (
    <Box sx={{ width: "100%", height: "100dvh", bgcolor: "#111", overflow: "hidden", position: "relative" }}>
      <CameraView videoRef={videoRef} canvasRef={canvasRef}>
        <ARCanvas
          videoRef={videoRef}
          canvasRef={canvasRef}
          faceLandmarksRef={face.landmarksRef}
          poseLandmarksRef={pose.landmarksRef}
          jewellery={selected}
          debug={debug}
        />

        <LandmarkDebug
          enabled={debug}
          landmarks={face.landmarksRef.current?.[0]}
          fps={face.fps}
          faceCount={face.faceCount}
          poseStatus={pose.status}
        />

        <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, pt: "env(safe-area-inset-top)", zIndex: 20 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 1.5, background: "linear-gradient(to bottom, rgba(0,0,0,.65), transparent)" }}>
            <Typography sx={{ color: "#fff", fontFamily: "Georgia, serif", fontWeight: 700, letterSpacing: ".14em", fontSize: 16 }}>
              NANDI JEWELLERS
            </Typography>
            <IconButton
              sx={{
                color: "#fff",
                bgcolor: "rgba(0,0,0,0.35)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.65)" },
              }}
              onClick={() => {
                stopCamera();
                navigate("/");
              }}
              aria-label="Close try-on"
            >
              <CloseRoundedIcon />
            </IconButton>
          </Box>
        </Box>

        {modelLoading && (
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 15, color: "#fff", textAlign: "center" }}>
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 1 }}>Preparing Virtual Try-On...</Typography>
          </Box>
        )}

        {face.status === "ready" && face.faceCount === 0 && !modelLoading && (
          <Box sx={{ position: "absolute", top: "28%", left: "50%", transform: "translateX(-50%)", zIndex: 10, width: "calc(100% - 40px)", maxWidth: 420 }}>
            <Alert severity="info" icon={<InfoOutlinedIcon />}>
              No face detected. Please position your face inside the frame.
            </Alert>
          </Box>
        )}

        {face.faceCount > 1 && (
          <Box sx={{ position: "absolute", top: "28%", left: "50%", transform: "translateX(-50%)", zIndex: 10, width: "calc(100% - 40px)", maxWidth: 420 }}>
            <Alert severity="warning">For the best experience, only one person should be visible.</Alert>
          </Box>
        )}

        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 20,
            pb: "calc(env(safe-area-inset-bottom) + 24px)",
            pt: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
          }}
        >
          {selected && (
            <Box
              sx={{
                px: 2,
                py: 0.6,
                borderRadius: 999,
                bgcolor: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(8px)",
                color: "#FFF",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13, letterSpacing: ".05em" }}>
                {selected?.name?.replace("Demo ", "")}
              </Typography>
            </Box>
          )}

          <CaptureButton onClick={capture} disabled={!selected || face.faceCount === 0} />
        </Box>
      </CameraView>

      <CapturePreview
        open={Boolean(capturedImage)}
        image={capturedImage}
        onClose={() => setCapturedImage("")}
        onViewProduct={() => navigate(`/product/${selected?.id}`)}
      />

      <Snackbar open={Boolean(snack)} autoHideDuration={2500} onClose={() => setSnack("")} message={snack} />
    </Box>
  );
}
