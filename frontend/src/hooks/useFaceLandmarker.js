import { useCallback, useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export default function useFaceLandmarker(videoRef, enabled = true) {
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const landmarksRef = useRef([]);
  const [status, setStatus] = useState("idle");
  const [faceCount, setFaceCount] = useState(0);
  const [fps, setFps] = useState(0);
  const [error, setError] = useState("");

  const stop = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!enabled) return;

      try {
        setStatus("loading");
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_URL,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 2,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
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
        setError("Unable to load the face tracking model.");
      }
    }

    init();

    return () => {
      cancelled = true;
      stop();
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, [enabled, stop]);

  useEffect(() => {
    if (!enabled || status !== "ready") return;

    let frameCount = 0;
    let lastFpsTime = performance.now();

    const process = () => {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;

      if (video && landmarker && video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
        const result = landmarker.detectForVideo(video, performance.now());
        landmarksRef.current = result.faceLandmarks || [];
        setFaceCount(landmarksRef.current.length);
        lastVideoTimeRef.current = video.currentTime;

        frameCount += 1;
        const now = performance.now();
        if (now - lastFpsTime >= 1000) {
          setFps(frameCount);
          frameCount = 0;
          lastFpsTime = now;
        }
      }

      animationRef.current = requestAnimationFrame(process);
    };

    animationRef.current = requestAnimationFrame(process);
    return stop;
  }, [enabled, status, stop, videoRef]);

  return { landmarksRef, status, faceCount, fps, error };
}
