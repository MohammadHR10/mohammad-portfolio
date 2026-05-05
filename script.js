const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let points = [];
const pointer = { x: 0, y: 0, active: false };

function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(42, Math.min(86, Math.floor(width * height / 18000)));
  points = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    phase: index * 0.33,
  }));
}

function draw(time) {
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = "source-over";

  for (const point of points) {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < -20) point.x = width + 20;
    if (point.x > width + 20) point.x = -20;
    if (point.y < -20) point.y = height + 20;
    if (point.y > height + 20) point.y = -20;

    if (pointer.active) {
      const dx = pointer.x - point.x;
      const dy = pointer.y - point.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 160) {
        point.x -= dx * 0.0009;
        point.y -= dy * 0.0009;
      }
    }
  }

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const a = points[i];
      const b = points[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 138) {
        const alpha = (1 - distance / 138) * 0.17;
        ctx.strokeStyle = `rgba(94, 225, 197, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  for (const point of points) {
    const pulse = 0.65 + Math.sin(time * 0.001 + point.phase) * 0.35;
    ctx.fillStyle = `rgba(241, 189, 87, ${0.16 + pulse * 0.16})`;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 1.4 + pulse * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.active = true;
});
window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

resize();
requestAnimationFrame(draw);

const uploadedLetterUrls = new Map();
const letterInput = document.querySelector("[data-letter-upload]");
const letterList = document.querySelector("[data-letter-list]");

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

letterInput?.addEventListener("change", () => {
  uploadedLetterUrls.forEach((url) => URL.revokeObjectURL(url));
  uploadedLetterUrls.clear();

  const files = Array.from(letterInput.files ?? []);
  if (!letterList) return;

  if (files.length === 0) {
    letterList.innerHTML = '<span class="quiet-link">No files selected yet.</span>';
    return;
  }

  letterList.innerHTML = "";

  files.forEach((file, index) => {
    const url = URL.createObjectURL(file);
    const key = `${index}-${file.name}`;
    uploadedLetterUrls.set(key, url);

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.innerHTML = `<span>${file.name}</span><small>${formatBytes(file.size)}</small>`;
    letterList.append(link);
  });
});
