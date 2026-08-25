import { useEffect, useRef } from "react";
import { calculateJewelleryTransforms } from "../../utils/arEngine";
import { smoothTransform } from "../../utils/smoothing";

function drawAsset(ctx, image, transform, mirror = false) {
  if (!image || !transform || transform.opacity <= 0) return;

  ctx.save();
  ctx.globalAlpha = transform.opacity;

  ctx.translate(transform.x, transform.y);

  if (mirror) {
    ctx.scale(-1, 1);
    ctx.rotate(-(transform.rotation || 0));
  } else {
    ctx.rotate(transform.rotation || 0);
  }

  ctx.drawImage(
    image,
    -transform.width / 2,
    -transform.height / 2,
    transform.width,
    transform.height
  );

  ctx.restore();
}

/**
 * Compute the visible region of the video when objectFit="cover" is applied.
 * Returns { scaleX, scaleY, offsetX, offsetY } to convert from landmark
 * normalised coords [0..1] to canvas CSS pixels, correctly accounting
 * for the crop introduced by cover fitting.
 */
function getCoverMapping(videoNativeW, videoNativeH, displayW, displayH) {
  if (!videoNativeW || !videoNativeH || !displayW || !displayH) {
    return { scaleX: displayW, scaleY: displayH, offsetX: 0, offsetY: 0 };
  }

  const nativeAR = videoNativeW / videoNativeH;
  const displayAR = displayW / displayH;

  let renderW, renderH;
  if (nativeAR > displayAR) {
    // Native is wider than display → pillar-box crop (sides cropped)
    renderH = displayH;
    renderW = displayH * nativeAR;
  } else {
    // Native is taller than display → letter-box crop (top/bottom cropped)
    renderW = displayW;
    renderH = displayW / nativeAR;
  }

  const offsetX = (displayW - renderW) / 2;
  const offsetY = (displayH - renderH) / 2;

  return {
    scaleX: renderW,
    scaleY: renderH,
    offsetX,
    offsetY,
  };
}

export default function ARCanvas({
  videoRef,
  canvasRef,
  faceLandmarksRef,
  poseLandmarksRef,
  jewellery,
  debug,
}) {
  const imagesRef = useRef({});
  const previousRef = useRef({});
  const animationRef = useRef(null);

  useEffect(() => {
    if (!jewellery?.ar_asset_url) return;
    const image = new Image();
    image.src = jewellery.ar_asset_url;
    imagesRef.current[jewellery.id] = image;
  }, [jewellery]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const render = () => {
      const displayW = video.clientWidth || 1;
      const displayH = video.clientHeight || 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (
        canvas.width !== Math.round(displayW * dpr) ||
        canvas.height !== Math.round(displayH * dpr)
      ) {
        canvas.width = Math.round(displayW * dpr);
        canvas.height = Math.round(displayH * dpr);
      }

      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, displayW, displayH);

      // Get intrinsic video resolution to correct objectFit:cover mapping
      const nativeW = video.videoWidth || displayW;
      const nativeH = video.videoHeight || displayH;
      const coverMap = getCoverMapping(nativeW, nativeH, displayW, displayH);

      // Pass a virtual canvas size that represents the full video mapped region
      // so landmarks map correctly after objectFit:cover crop
      const virtualCanvas = {
        width: coverMap.scaleX,
        height: coverMap.scaleY,
        offsetX: coverMap.offsetX,
        offsetY: coverMap.offsetY,
      };

      const faceLandmarks = faceLandmarksRef.current?.[0] || [];
      const poseLandmarks = poseLandmarksRef.current || [];
      const current = calculateJewelleryTransforms({
        category: jewellery?.category,
        faceLandmarks,
        poseLandmarks,
        jewellery: jewellery || {},
        canvas: virtualCanvas,
      });

      if (jewellery && Object.keys(current).length) {
        const smoothed = {};
        Object.entries(current).forEach(([key, transform]) => {
          if (transform) {
            // Shift coordinates from virtual space back into display space
            const shifted = {
              ...transform,
              x: transform.x + coverMap.offsetX,
              y: transform.y + coverMap.offsetY,
            };
            smoothed[key] = smoothTransform(previousRef.current[key], shifted, 0.35);
          } else {
            smoothed[key] = null;
          }
        });
        previousRef.current = smoothed;

        const image = imagesRef.current[jewellery.id];
        if (jewellery.category === "earrings") {
          drawAsset(ctx, image, smoothed.left, false);
          drawAsset(ctx, image, smoothed.right, true);
        } else if (jewellery.category === "nose-rings") {
          drawAsset(ctx, image, smoothed.nose);
        } else if (jewellery.category === "necklaces") {
          drawAsset(ctx, image, smoothed.necklace);
        }
      }

      if (debug && faceLandmarks.length) {
        ctx.fillStyle = "rgba(255, 210, 100, .85)";
        faceLandmarks.forEach((point) => {
          const x = (1 - point.x) * coverMap.scaleX + coverMap.offsetX;
          const y = point.y * coverMap.scaleY + coverMap.offsetY;
          ctx.beginPath();
          ctx.arc(x, y, 1.4, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationRef.current);
  }, [canvasRef, videoRef, faceLandmarksRef, poseLandmarksRef, jewellery, debug]);

  return null;
}
