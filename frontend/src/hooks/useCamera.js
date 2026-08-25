import { useCallback, useEffect, useRef, useState } from "react";

export default function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const attachStreamToVideo = useCallback(() => {
    const video = videoRef.current;
    const stream = streamRef.current;

    if (!video || !stream) {
      return;
    }

    // Avoid reassigning the same stream unnecessarily
    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }

    video.muted = true;
    video.playsInline = true;

    video.play().catch((err) => {
      console.warn("Video autoplay/play failed:", err);
    });
  }, []);

  const startCamera = useCallback(async () => {
    setStatus("loading");
    setError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      setError("Your browser does not support this camera experience.");
      return false;
    }

    try {
      // Stop an existing stream before starting a new one
      streamRef.current?.getTracks().forEach((track) => track.stop());

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "user" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      // This may be null because CameraView isn't mounted yet.
      // The effect below will attach the stream after it mounts.
      attachStreamToVideo();

      setStatus("granted");

      return true;
    } catch (err) {
      console.error("Camera error:", err);

      const denied =
        err?.name === "NotAllowedError" ||
        err?.name === "SecurityError";

      setStatus(denied ? "denied" : "unavailable");

      setError(
        denied
          ? "Camera access is blocked. Please enable camera permission in your browser settings."
          : "Camera is unavailable. Close other camera apps and try again."
      );

      return false;
    }
  }, [attachStreamToVideo]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setStatus("stopped");
  }, []);

  /*
   * Important:
   *
   * startCamera() can run before <video> is mounted.
   *
   * When TryOn sets started=true, CameraView mounts and
   * videoRef.current becomes available.
   *
   * This effect then attaches the existing MediaStream.
   */
  useEffect(() => {
    if (status === "granted") {
      attachStreamToVideo();
    }
  }, [status, attachStreamToVideo]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return {
    videoRef,
    status,
    error,
    startCamera,
    stopCamera,
  };
}