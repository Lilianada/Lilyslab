const COLORS = ["#E8ADB1", "#CCA7ED", "#9EAAFA", "#FAE680", "#F29874", "#A2CBAF", "#F4DAA0"];
const PETAL_COUNT = 70;
const DURATION_MS = 4500;

let isRunning = false;

/** Drops a one-off shower of petals over the page, then cleans up after itself. */
export function startPetalShower() {
  if (isRunning || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  isRunning = true;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:60";
  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");
  if (!context) {
    canvas.remove();
    isRunning = false;
    return;
  }

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  const petals = Array.from({ length: PETAL_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.8,
    size: 5 + Math.random() * 7,
    fall: 1.5 + Math.random() * 2.5,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.02 + Math.random() * 0.03,
    spin: Math.random() * Math.PI,
    spinSpeed: (Math.random() - 0.5) * 0.08,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

  const start = performance.now();

  const frame = (now: number) => {
    const elapsed = now - start;
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Fade out over the final second rather than vanishing.
    context.globalAlpha = Math.min(1, (DURATION_MS - elapsed) / 1000);

    for (const petal of petals) {
      petal.y += petal.fall;
      petal.sway += petal.swaySpeed;
      petal.spin += petal.spinSpeed;

      context.save();
      context.translate(petal.x + Math.sin(petal.sway) * 26, petal.y);
      context.rotate(petal.spin);
      context.fillStyle = petal.color;
      context.beginPath();
      context.ellipse(0, 0, petal.size, petal.size * 0.5, 0, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    if (elapsed < DURATION_MS) {
      requestAnimationFrame(frame);
    } else {
      window.removeEventListener("resize", resize);
      canvas.remove();
      isRunning = false;
    }
  };

  requestAnimationFrame(frame);
}
