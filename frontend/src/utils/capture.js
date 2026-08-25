export function captureComposite(video, arCanvas) {
  if (!video || !arCanvas) throw new Error("Capture sources are unavailable.");

  const width = video.videoWidth || arCanvas.width;
  const height = video.videoHeight || arCanvas.height;
  const output = document.createElement("canvas");
  output.width = width;
  output.height = height;

  const ctx = output.getContext("2d");
  ctx.save();
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, width, height);
  ctx.restore();

  ctx.drawImage(arCanvas, 0, 0, width, height);

  return output.toDataURL("image/jpeg", 0.92);
}

export function downloadDataUrl(dataUrl, filename = "nandi-virtual-try-on.jpg") {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
