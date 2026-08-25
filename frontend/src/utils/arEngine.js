import { angle, distance, landmarkToCanvas } from "./coordinates";

// MediaPipe Face Mesh landmarks
// In mirrored selfie view:
// Landmark 454 & 361 are on the screen-left (person's anatomical left ear)
// Landmark 234 & 132 are on the screen-right (person's anatomical right ear)
const SCREEN_LEFT_EAR_TRAGUS = 454;
const SCREEN_LEFT_EAR_LOBE = 361;

const SCREEN_RIGHT_EAR_TRAGUS = 234;
const SCREEN_RIGHT_EAR_LOBE = 132;

const NOSE = 1;
const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;

export function getHeadRollAngle(landmarks, canvas) {
  if (!landmarks?.length || !canvas) return 0;
  const left = landmarks[SCREEN_LEFT_EAR_TRAGUS] || landmarks[SCREEN_LEFT_EAR_LOBE];
  const right = landmarks[SCREEN_RIGHT_EAR_TRAGUS] || landmarks[SCREEN_RIGHT_EAR_LOBE];
  if (!left || !right) return 0;

  const l = landmarkToCanvas(left, canvas, true);
  const r = landmarkToCanvas(right, canvas, true);
  if (!l || !r) return 0;

  // Horizontal tilt of the head from screen-left to screen-right (0 is level)
  return angle(l, r);
}

export function calculateEarringTransform(
  landmarks,
  side,
  jewellery,
  canvas
) {
  if (!landmarks?.length || !canvas) return null;

  const isLeft = side === "left";
  const earLobe = isLeft
    ? landmarks[SCREEN_LEFT_EAR_LOBE] || landmarks[SCREEN_LEFT_EAR_TRAGUS]
    : landmarks[SCREEN_RIGHT_EAR_LOBE] || landmarks[SCREEN_RIGHT_EAR_TRAGUS];

  const leftTragus = landmarks[SCREEN_LEFT_EAR_TRAGUS];
  const rightTragus = landmarks[SCREEN_RIGHT_EAR_TRAGUS];

  if (!earLobe || !leftTragus || !rightTragus) return null;

  const anchor = landmarkToCanvas(earLobe, canvas, true);
  const leftPoint = landmarkToCanvas(leftTragus, canvas, true);
  const rightPoint = landmarkToCanvas(rightTragus, canvas, true);

  const faceWidth = distance(leftPoint, rightPoint);
  if (!faceWidth) return null;

  const scale = jewellery.scale || 1;
  const width = faceWidth * 0.19 * scale;
  const height = width * 1.35;

  // Direction: move screen-left outward (-1, left) and screen-right outward (+1, right)
  const direction = isLeft ? -1 : 1;
  const xOffset = direction * faceWidth * 0.055 + (jewellery.offset_x || 0);
  const yOffset = height * 0.22 + (jewellery.offset_y || 0);

  // Common head roll angle for both ears so neither flips upside down
  const headRotation = jewellery.rotation_enabled
    ? getHeadRollAngle(landmarks, canvas)
    : 0;

  return {
    x: anchor.x + xOffset,
    y: anchor.y + yOffset,
    width,
    height,
    rotation: headRotation,
    opacity: 1,
  };
}

// Nostril landmarks (left nostril for traditional Indian nath placement)
const SCREEN_LEFT_NOSTRIL = 327; // anatomical left nostril (screen-left in mirrored view)
const SCREEN_RIGHT_NOSTRIL = 98; // anatomical right nostril (screen-right in mirrored view)
const SCREEN_LEFT_ALAR_RIM = 279; // outer nostril wing edge

export function calculateNoseRingTransform(
  landmarks,
  jewellery,
  canvas
) {
  if (!landmarks?.length || !canvas) return null;

  const leftNostril = landmarks[SCREEN_LEFT_ALAR_RIM] || landmarks[SCREEN_LEFT_NOSTRIL];
  const rightNostril = landmarks[SCREEN_RIGHT_NOSTRIL];
  const noseTip = landmarks[NOSE];

  if (!leftNostril || !rightNostril) return null;

  const l = landmarkToCanvas(leftNostril, canvas, true);
  const r = landmarkToCanvas(rightNostril, canvas, true);
  const tip = noseTip ? landmarkToCanvas(noseTip, canvas, true) : null;

  const noseWidth = distance(l, r);
  if (!noseWidth) return null;

  const scale = jewellery.scale || 1;
  const isTraditionalNath = jewellery.ar_asset_url?.includes("nosering2");

  const width = noseWidth * (isTraditionalNath ? 1.05 : 0.85) * scale;
  const height = width * (isTraditionalNath ? 1.35 : 1.0);

  const headRotation = jewellery.rotation_enabled
    ? getHeadRollAngle(landmarks, canvas)
    : 0;

  // Anchor to the nostril wing curve on the left side of the nose
  const x = l.x - (isTraditionalNath ? width * 0.12 : width * 0.05) + (jewellery.offset_x || 0);
  const y = (tip ? (l.y + tip.y) / 2 : l.y) + (height * 0.18) + (jewellery.offset_y || 0);

  return {
    x,
    y,
    width,
    height,
    rotation: headRotation,
    opacity: 1,
  };
}

export function calculateNecklaceTransform(
  faceLandmarks,
  poseLandmarks,
  jewellery,
  canvas
) {
  if (!canvas) return null;

  // 1. Primary: Use Face landmarks (chin 152 + jaw/cheeks) so close-up selfies work reliably
  if (faceLandmarks?.length) {
    const chin = faceLandmarks[152]; // Chin tip
    const forehead = faceLandmarks[10]; // Top of head
    const leftCheek = faceLandmarks[SCREEN_LEFT_EAR_TRAGUS]; // 454
    const rightCheek = faceLandmarks[SCREEN_RIGHT_EAR_TRAGUS]; // 234

    if (chin && leftCheek && rightCheek) {
      const chinPoint = landmarkToCanvas(chin, canvas, true);
      const lPoint = landmarkToCanvas(leftCheek, canvas, true);
      const rPoint = landmarkToCanvas(rightCheek, canvas, true);
      const foreheadPoint = forehead ? landmarkToCanvas(forehead, canvas, true) : null;

      const faceWidth = distance(lPoint, rPoint);
      const faceHeight = foreheadPoint ? distance(foreheadPoint, chinPoint) : faceWidth * 1.3;

      if (faceWidth > 0) {
        const headRotation = jewellery.rotation_enabled
          ? getHeadRollAngle(faceLandmarks, canvas)
          : 0;

        const scale = jewellery.scale || 1;
        const width = faceWidth * 1.15 * scale;
        const height = width * 0.90;

        // Anchor the necklace comfortably at the throat/collarbone level
        const neckTopY = chinPoint.y + faceHeight * 0.06;
        const centerX = chinPoint.x + (jewellery.offset_x || 0);
        const centerY = neckTopY + (height * 0.42) + (jewellery.offset_y || 0);

        return {
          x: centerX,
          y: centerY,
          width,
          height,
          rotation: headRotation,
          opacity: 1,
        };
      }
    }
  }

  // 2. Secondary fallback: Use Pose landmarks if body tracking is active and shoulders are visible
  if (poseLandmarks?.length) {
    const pose = poseLandmarks[0];
    const leftShoulder = pose[LEFT_SHOULDER];
    const rightShoulder = pose[RIGHT_SHOULDER];

    if (leftShoulder && rightShoulder) {
      const l = landmarkToCanvas(leftShoulder, canvas, true);
      const r = landmarkToCanvas(rightShoulder, canvas, true);
      const shoulderWidth = distance(l, r);

      if (shoulderWidth) {
        const center = {
          x: (l.x + r.x) / 2 + (jewellery.offset_x || 0),
          y: (l.y + r.y) / 2 + (jewellery.offset_y || 0),
        };

        const width = shoulderWidth * 0.75 * (jewellery.scale || 1);
        const height = width * 0.75;

        return {
          x: center.x,
          y: center.y,
          width,
          height,
          rotation: jewellery.rotation_enabled ? angle(l, r) : 0,
          opacity: 1,
        };
      }
    }
  }

  return null;
}

export function calculateJewelleryTransforms({
  category,
  faceLandmarks,
  poseLandmarks,
  jewellery,
  canvas,
}) {
  if (category === "earrings") {
    return {
      left: calculateEarringTransform(
        faceLandmarks,
        "left",
        jewellery,
        canvas
      ),

      right: calculateEarringTransform(
        faceLandmarks,
        "right",
        jewellery,
        canvas
      ),
    };
  }

  if (category === "nose-rings") {
    return {
      nose: calculateNoseRingTransform(
        faceLandmarks,
        jewellery,
        canvas
      ),
    };
  }

  if (category === "necklaces") {
    return {
      necklace: calculateNecklaceTransform(
        faceLandmarks,
        poseLandmarks,
        jewellery,
        canvas
      ),
    };
  }

  return {};
}