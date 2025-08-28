
(function(){
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  document.body.prepend(canvas);
  document.body.classList.add('has-particles');
  const ctx = canvas.getContext('2d', { alpha: true });
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let w, h;

  function resize(){
    w = canvas.width = Math.floor(innerWidth * dpr);
    h = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }
  resize();
  addEventListener('resize', resize);

  const count = Math.min(140, Math.floor((innerWidth*innerHeight)/14000));
  const particles = Array.from({length: count}, () => {
    const speed = 0.2 + Math.random()*0.8;
    return {
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()-0.5) * speed,
      vy: (Math.random()-0.5) * speed,
      r: 1 + Math.random()*2.8,
      hue: 190 + Math.random()*120
    };
  });

  function step(){
    ctx.clearRect(0,0,w,h);
    // gradient background glow
    const grad = ctx.createRadialGradient(w*0.7, h*0.2, 0, w*0.7, h*0.2, Math.max(w,h)*0.8);
    grad.addColorStop(0, 'rgba(34,211,238,0.10)');
    grad.addColorStop(1, 'rgba(124,58,237,0.04)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,w,h);

    // draw particles
    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > w) p.vx *= -1;
      if(p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r*dpr, 0, Math.PI*2);
      ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, 0.8)`;
      ctx.fill();
    }

    // connective lines
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist2 = dx*dx + dy*dy;
        if(dist2 < (130*dpr)*(130*dpr)){
          const alpha = 1 - (Math.sqrt(dist2)/(130*dpr));
          ctx.strokeStyle = `rgba(124,58,237,${alpha*0.25})`;
          ctx.lineWidth = 1 * dpr * alpha;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }
  step();
})();
