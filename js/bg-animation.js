
const canvas = document.getElementById("bg-animation");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];
const particleCount = 90;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            radius: 2,
            color: randomColor()
        });
    }
}

function randomColor() {
    const colors = ["#ff4d4d", "#4dff4d", "#4d4dff", "#ffff4d", "#ff4dff"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = "rgba(255,255,255,0.1)";
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

function updateParticles() {
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
    });
}

function animate() {
    drawParticles();
    updateParticles();
    requestAnimationFrame(animate);
}

createParticles();
animate();
