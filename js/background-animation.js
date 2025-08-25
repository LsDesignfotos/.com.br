
const canvas = document.getElementById("bg-animation");
const ctx = canvas.getContext("2d");

canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = "-1"; 
canvas.style.width = "100%";
canvas.style.height = "100%";

function resizeCanvas() {
  canvas.width = document.documentElement.scrollWidth;
  canvas.height = document.documentElement.scrollHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
window.addEventListener("scroll", resizeCanvas);

let width = (canvas.width);
let height = (canvas.height);

const points = [];
const numPoints = 80;

for (let i = 0; i < numPoints; i++) {
  points.push({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.7,
    vy: (Math.random() - 0.5) * 0.7,
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffcc00";
  points.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  for (let i = 0; i < numPoints; i++) {
    for (let j = i + 1; j < numPoints; j++) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 204, 0, " + (1 - dist / 150) + ")";
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }
  }

  points.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  });

  requestAnimationFrame(draw);
}
draw();
