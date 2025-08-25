
(function(){
  const ease = t => t<.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
  const animate = (setter, from, to, ms=900)=>{
    const t0 = performance.now();
    const step = (now)=>{
      const p = Math.min(1, (now - t0)/ms);
      const v = from + (to-from)*ease(p);
      setter(v);
      if(p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  document.querySelectorAll('.compare').forEach(cmp=>{
    const mask = cmp.querySelector('.mask');
    const range = cmp.querySelector('.range');
    const divider = cmp.querySelector('.divider');
    const start = parseInt(cmp.getAttribute('data-start')||'70',10);
    const setPct = (pct)=>{
      pct = Math.max(0, Math.min(100, pct));
      mask.style.clipPath = `inset(0 ${100-pct}% 0 0)`;
      divider.style.left = pct + '%';
      range.value = Math.round(pct);
    };
    setPct(start);
    setTimeout(()=> animate(setPct, start, 56, 1200), 400);
    const onDrag = x=>{
      const r = cmp.getBoundingClientRect();
      setPct(((x - r.left)/r.width)*100);
    };
    cmp.addEventListener('pointerdown', e=>{ cmp.setPointerCapture(e.pointerId); onDrag(e.clientX); });
    cmp.addEventListener('pointermove', e=>{ if(e.pressure || e.buttons) onDrag(e.clientX); });
    range.addEventListener('input', ()=> setPct(range.value));
  });
})();

// ===== Fundo de Partículas + Animações de Scroll =====
(function(){
  const canvas = document.getElementById('bg-particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize(); window.addEventListener('resize', resize);

  const particles = [];
  const COLORS = ['#FFFFFF', '#D4AF37', 'rgba(255,255,255,.6)'];
  const COUNT = Math.min(160, Math.floor((window.innerWidth * window.innerHeight)/12000));

  for (let i=0; i<COUNT; i++){
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      vx: (Math.random()-.5)*0.8,
      vy: (Math.random()-.5)*0.8,
      r: Math.random()*1.8+0.7,
      c: COLORS[Math.floor(Math.random()*COLORS.length)]
    });
  }

  function step(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // draw links
    for (let i=0;i<particles.length;i++){
      const p = particles[i];
      for (let j=i+1;j<particles.length;j++){
        const q = particles[j];
        const dx = q.x-p.x, dy = q.y-p.y;
        const d2 = dx*dx+dy*dy;
        if (d2 < 180*180){
          const a = 1 - (Math.sqrt(d2)/180);
          ctx.strokeStyle = 'rgba(212,175,55,' + (0.10*a) + ')'; // dourado suave
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    // draw nodes + move
    particles.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.c;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x<0||p.x>canvas.width) p.vx*=-1;
      if (p.y<0||p.y>canvas.height) p.vy*=-1;
    });
    requestAnimationFrame(step);
  }
  step();
})();

// ===== Reveal on scroll (IntersectionObserver) =====
(function(){
  const els = document.querySelectorAll('section, .card-servico, .plano-card-dark, .tabela-precos-dark, header, footer');
  els.forEach(el=> el.classList.add('reveal'));
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if (e.isIntersecting) e.target.classList.add('show'); });
  }, { threshold: 0.12 });
  els.forEach(el=> io.observe(el));
})();


// Garantir que o canvas da animação cubra todo o fundo dinamicamente
window.addEventListener("resize", function() {
    const particlesCanvas = document.getElementById("particles-js");
    if (particlesCanvas) {
        particlesCanvas.style.height = window.innerHeight + "px";
    }
});
