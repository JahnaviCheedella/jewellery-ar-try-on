import { useEffect, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker/float16/1/pose_landmarker.task";

export default function usePoseLandmarker(videoRef, enabled = false) {
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const landmarksRef = useRef([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!enabled) return;

      try {
        setStatus("loading");
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_URL,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.45,
          minPosePresenceConfidence: 0.45,
          minTrackingConfidence: 0.45,
        });

        if (cancelled) {
          landmarker.close();
          return;
        }

        landmarkerRef.current = landmarker;
        setStatus("ready");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setError("Unable to load body tracking.");
      }
    }

    init();

    return () => {
      cancelled = true;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || status !== "ready") return;

    let lastVideoTime = -1;

    const process = () => {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      if (video && landmarker && video.readyState >= 2 && video.currentTime !== lastVideoTime) {
        const result = landmarker.detectForVideo(video, performance.now());
        landmarksRef.current = result.landmarks || [];
        lastVideoTime = video.currentTime;
      }
      animationRef.current = requestAnimationFrame(process);
    };

    animationRef.current = requestAnimationFrame(process);
    return () => cancelAnimationFrame(animationRef.current);
  }, [enabled, status, videoRef]);

  return { landmarksRef, status, error };
}
