// roundRect polyfill
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (typeof r === 'number') r = [r, r, r, r];
    var tl = r[0], tr = r[1], br = r[2], bl = r[3];
    this.moveTo(x + tl, y);
    this.lineTo(x + w - tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + tr);
    this.lineTo(x + w, y + h - br);
    this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    this.lineTo(x + bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - bl);
    this.lineTo(x, y + tl);
    this.quadraticCurveTo(x, y, x + tl, y);
    this.closePath();
    return this;
  };
}

/* =============================================
   BULB SCENE
   ============================================= */
(function() {
  var canvas = document.getElementById('bulb-canvas');
  var ctx = canvas.getContext('2d');
  var hitarea = document.getElementById('rope-hitarea');
  var heroSection = document.querySelector('.hero');

  var W, H, dpr;
  var bulbOn = false;
  var glowIntensity = 0;
  var mainBulbSway = 0;
  var mainBulbSwayV = 0;
  var MAIN_SCALE = 1.5;
  var flickerPhase = 0;
  var flickerIntensity = 1;
  var bgBulbs = [];
  var mainBulb = { x: 0, y: 0 };

  var rope = {
    anchorX: 0, anchorY: 0,
    endX: 0, endY: 0,
    restLength: 140 * MAIN_SCALE,
    dragging: false,
    dragOffsetY: 0,
    velocityY: 0,
    pulled: false,
    toggleThreshold: 110 * MAIN_SCALE,
    cooldown: false
  };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = heroSection.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    mainBulb.x = W * 0.22;
    mainBulb.y = H * 0.42;

    var baseOffset = 55 * MAIN_SCALE;
    rope.anchorX = mainBulb.x;
    rope.anchorY = mainBulb.y + baseOffset;

    if (!rope.dragging) {
      rope.endX = rope.anchorX;
      rope.endY = rope.anchorY + rope.restLength;
    }
    generateBgBulbs();
  }

  function generateBgBulbs() {
    bgBulbs = [];
    var cols = Math.max(3, Math.floor(W / 130));
    var rows = Math.max(3, Math.floor(H / 150));
    var cellW = W / cols;
    var cellH = H / rows;
    var types = ['classic', 'elongated', 'edison', 'oillamp', 'candle'];
    var seed = 42;
    function rand() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }

    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        var bx = cellW * (col + 0.3) + (rand() - 0.5) * cellW * 0.5;
        var by = cellH * (row + 0.35) + (rand() - 0.5) * cellH * 0.3;
        var scale = 0.3 + rand() * 0.3;
        var phase = rand() * Math.PI * 2;
        var flickerSpeed = 0.3 + rand() * 0.8;
        var flickerAmt = 0.15 + rand() * 0.4;
        var type = types[Math.floor(rand() * types.length)];
        var mdx = bx - mainBulb.x;
        var mdy = by - mainBulb.y;
        if (Math.abs(mdx) < 100 * MAIN_SCALE && Math.abs(mdy) < 100 * MAIN_SCALE) continue;
        bgBulbs.push({ x: bx, y: by, scale: scale, phase: phase, flickerSpeed: flickerSpeed, flickerAmt: flickerAmt, type: type });
      }
    }
  }

  function isLight() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  function drawGlassAndGlow(outline, cx, cy, glowR, glowAmt, flick) {
    var light = isLight();
    ctx.beginPath();
    ctx.moveTo(outline[0][0], outline[0][1]);
    for (var i = 1; i < outline.length; i++) {
      var p = outline[i];
      if (p.length === 6) ctx.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
      else if (p.length === 4) ctx.quadraticCurveTo(p[0], p[1], p[2], p[3]);
      else ctx.lineTo(p[0], p[1]);
    }
    ctx.closePath();

    if (glowAmt > 0.01) {
      var gg = ctx.createRadialGradient(cx, cy, 3, cx, cy, glowR);
      gg.addColorStop(0, 'rgba(255,230,150,' + ((0.12 + 0.28 * glowAmt) * flick) + ')');
      gg.addColorStop(0.7, 'rgba(255,213,128,' + ((0.06 + 0.12 * glowAmt) * flick) + ')');
      gg.addColorStop(1, 'rgba(245,166,35,' + ((0.02 + 0.04 * glowAmt) * flick) + ')');
      ctx.fillStyle = gg;
    } else {
      ctx.fillStyle = light ? 'rgba(100,85,55,0.28)' : 'rgba(130,118,90,0.22)';
    }
    ctx.fill();
    ctx.strokeStyle = glowAmt > 0.01
      ? 'rgba(200,175,120,' + ((0.18 + 0.22 * glowAmt) * flick) + ')'
      : light ? 'rgba(110,95,60,0.6)' : 'rgba(160,145,110,0.5)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(outline[0][0] - 2, outline[0][1] - 3);
    for (var j = 1; j < Math.min(outline.length, 3); j++) {
      var q = outline[j];
      if (q.length === 6) ctx.bezierCurveTo(q[0] - 2, q[1] - 3, q[2] - 2, q[3] - 3, q[4] - 2, q[5] - 3);
      else ctx.lineTo(q[0] - 2, q[1] - 3);
    }
    ctx.strokeStyle = glowAmt > 0.01
      ? 'rgba(255,245,210,' + (0.15 * glowAmt * flick) + ')'
      : light ? 'rgba(160,140,100,0.25)' : 'rgba(200,190,165,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawFilament(fx, fy, glowAmt, flick) {
    if (glowAmt <= 0.01) return;
    ctx.strokeStyle = 'rgba(255,220,120,' + (0.7 * glowAmt * flick) + ')';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(fx - 6, fy + 4); ctx.quadraticCurveTo(fx - 8, fy - 6, fx - 2, fy - 12);
    ctx.quadraticCurveTo(fx + 2, fy - 18, fx + 2, fy - 12);
    ctx.quadraticCurveTo(fx + 8, fy - 6, fx + 6, fy + 4);
    ctx.stroke();
    var fg = ctx.createRadialGradient(fx, fy - 5, 1, fx, fy - 5, 14);
    fg.addColorStop(0, 'rgba(255,230,150,' + (0.4 * glowAmt * flick) + ')');
    fg.addColorStop(1, 'rgba(255,230,150,0)');
    ctx.fillStyle = fg;
    ctx.beginPath(); ctx.arc(fx, fy - 5, 14, 0, Math.PI * 2); ctx.fill();
  }

  function drawScrewBase(bx, by) {
    ctx.fillStyle = '#8A7E6B';
    ctx.beginPath(); ctx.roundRect(bx - 16, by, 32, 20, 3); ctx.fill();
    ctx.fillStyle = '#6B6050';
    for (var i = 0; i < 2; i++) ctx.fillRect(bx - 14, by + 4 + i * 7, 28, 2);
    ctx.fillStyle = '#5A5040';
    ctx.beginPath(); ctx.roundRect(bx - 10, by + 20, 20, 5, 2); ctx.fill();
  }

  function drawBulbShape(x, y, scale, glowAmt, flick, swayAngle) {
    var light = isLight();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(swayAngle || 0);
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.moveTo(-28, 15);
    ctx.bezierCurveTo(-32, -10, -26, -40, 0, -48);
    ctx.bezierCurveTo(26, -40, 32, -10, 28, 15);
    ctx.closePath();

    if (glowAmt > 0.01) {
      var gg = ctx.createRadialGradient(0, -20, 5, 0, -10, 40);
      gg.addColorStop(0, 'rgba(255,230,150,' + (0.3 * glowAmt * flick) + ')');
      gg.addColorStop(0.7, 'rgba(255,213,128,' + (0.12 * glowAmt * flick) + ')');
      gg.addColorStop(1, 'rgba(245,166,35,' + (0.04 * glowAmt * flick) + ')');
      ctx.fillStyle = gg;
    } else {
      ctx.fillStyle = light ? 'rgba(100,85,55,0.28)' : 'rgba(130,118,90,0.22)';
    }
    ctx.fill();
    ctx.strokeStyle = glowAmt > 0.01 ? 'rgba(200,175,120,' + ((0.2 + 0.28 * glowAmt) * flick) + ')'
      : light ? 'rgba(110,95,60,0.6)' : 'rgba(160,145,110,0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (glowAmt > 0.01) {
      ctx.strokeStyle = 'rgba(255,220,120,' + (0.85 * glowAmt * flick) + ')';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-8, 10); ctx.quadraticCurveTo(-12, -8, -4, -20);
      ctx.quadraticCurveTo(4, -30, 4, -20); ctx.quadraticCurveTo(12, -8, 8, 10);
      ctx.stroke();
      var fg = ctx.createRadialGradient(0, -10, 2, 0, -10, 22);
      fg.addColorStop(0, 'rgba(255,230,150,' + (0.55 * glowAmt * flick) + ')');
      fg.addColorStop(1, 'rgba(255,230,150,0)');
      ctx.fillStyle = fg;
      ctx.beginPath(); ctx.arc(0, -10, 22, 0, Math.PI * 2); ctx.fill();
    }

    ctx.fillStyle = '#8A7E6B';
    ctx.beginPath(); ctx.roundRect(-20, 15, 40, 28, 4); ctx.fill();
    ctx.fillStyle = '#6B6050';
    for (var i = 0; i < 3; i++) ctx.fillRect(-18, 19 + i * 8, 36, 2);
    ctx.fillStyle = '#5A5040';
    ctx.beginPath(); ctx.roundRect(-14, 43, 28, 6, 3); ctx.fill();

    ctx.restore();
  }

  function drawBgBulbShape(x, y, scale, glowAmt, flick, type) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    switch (type) {
      case 'elongated':
        drawGlassAndGlow([[-18, 15], [-22, -8, -18, -50, 0, -62], [18, -50, 22, -8, 18, 15]], 0, -25, 38, glowAmt, flick);
        drawFilament(0, -20, glowAmt, flick);
        drawScrewBase(0, 15);
        break;
      case 'edison':
        drawGlassAndGlow([[-22, 12], [22, 12], [22, -20], [22, -44, 6, -56, 0, -56], [-6, -56, -22, -44, -22, -20]], 0, -22, 36, glowAmt, flick);
        if (glowAmt > 0.01) {
          ctx.strokeStyle = 'rgba(255,200,80,' + (0.6 * glowAmt * flick) + ')';
          ctx.lineWidth = 1.2;
          for (var i = 0; i < 3; i++) {
            var sx = -8 + i * 8;
            ctx.beginPath();
            ctx.moveTo(sx, 6); ctx.quadraticCurveTo(sx - 3, -8, sx + 1, -20);
            ctx.quadraticCurveTo(sx + 5, -32, sx + 2, -38);
            ctx.stroke();
          }
        }
        drawScrewBase(0, 12);
        break;
      case 'oillamp':
        var light = isLight();
        ctx.beginPath();
        ctx.moveTo(-26, 10);
        ctx.bezierCurveTo(-30, -4, -24, -16, -10, -16);
        ctx.lineTo(10, -16);
        ctx.bezierCurveTo(24, -16, 30, -4, 26, 10);
        ctx.closePath();
        ctx.fillStyle = glowAmt > 0.01 ? 'rgba(255,230,150,' + ((0.08 + 0.18 * glowAmt) * flick) + ')' : light ? 'rgba(100,85,55,0.28)' : 'rgba(130,118,90,0.22)';
        ctx.fill();
        ctx.strokeStyle = glowAmt > 0.01 ? 'rgba(200,175,120,' + ((0.15 + 0.2 * glowAmt) * flick) + ')' : light ? 'rgba(110,95,60,0.6)' : 'rgba(160,145,110,0.5)';
        ctx.lineWidth = 1.3; ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-8, -16); ctx.lineTo(-6, -44);
        ctx.bezierCurveTo(-5, -50, 5, -50, 6, -44);
        ctx.lineTo(8, -16);
        ctx.fillStyle = glowAmt > 0.01 ? 'rgba(255,220,120,' + ((0.06 + 0.14 * glowAmt) * flick) + ')' : light ? 'rgba(100,85,55,0.22)' : 'rgba(130,118,90,0.18)';
        ctx.fill();
        ctx.strokeStyle = glowAmt > 0.01 ? 'rgba(200,175,120,' + ((0.12 + 0.16 * glowAmt) * flick) + ')' : light ? 'rgba(110,95,60,0.5)' : 'rgba(160,145,110,0.4)';
        ctx.stroke();
        if (glowAmt > 0.01) {
          ctx.fillStyle = 'rgba(255,200,60,' + (0.5 * glowAmt * flick) + ')';
          ctx.beginPath();
          ctx.moveTo(0, -16); ctx.quadraticCurveTo(-5, -26, 0, -34);
          ctx.quadraticCurveTo(5, -26, 0, -16); ctx.fill();
          var fg = ctx.createRadialGradient(0, -25, 1, 0, -25, 16);
          fg.addColorStop(0, 'rgba(255,230,150,' + (0.4 * glowAmt * flick) + ')');
          fg.addColorStop(1, 'rgba(255,230,150,0)');
          ctx.fillStyle = fg;
          ctx.beginPath(); ctx.arc(0, -25, 16, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#8A7E6B';
        ctx.beginPath(); ctx.roundRect(-20, 10, 40, 16, 3); ctx.fill();
        ctx.fillStyle = '#5A5040';
        ctx.beginPath(); ctx.roundRect(-14, 26, 28, 5, 2); ctx.fill();
        ctx.strokeStyle = '#6B6050'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(26, 4);
        ctx.bezierCurveTo(38, 0, 38, -16, 22, -14); ctx.stroke();
        break;
      case 'candle':
        var lt = isLight();
        ctx.fillStyle = glowAmt > 0.01 ? 'rgba(255,245,210,' + ((0.1 + 0.2 * glowAmt) * flick) + ')' : lt ? 'rgba(150,135,100,0.35)' : 'rgba(200,190,170,0.3)';
        ctx.beginPath(); ctx.roundRect(-10, -10, 20, 40, 2); ctx.fill();
        ctx.strokeStyle = glowAmt > 0.01 ? 'rgba(200,175,120,' + ((0.15 + 0.18 * glowAmt) * flick) + ')' : lt ? 'rgba(110,95,60,0.55)' : 'rgba(160,145,110,0.45)';
        ctx.lineWidth = 1.3; ctx.stroke();
        if (glowAmt > 0.01) {
          ctx.fillStyle = 'rgba(255,190,40,' + (0.55 * glowAmt * flick) + ')';
          ctx.beginPath(); ctx.moveTo(0, -10); ctx.quadraticCurveTo(-7, -22, 0, -34); ctx.quadraticCurveTo(7, -22, 0, -10); ctx.fill();
          ctx.fillStyle = 'rgba(255,240,180,' + (0.35 * glowAmt * flick) + ')';
          ctx.beginPath(); ctx.moveTo(0, -14); ctx.quadraticCurveTo(-3, -22, 0, -28); ctx.quadraticCurveTo(3, -22, 0, -14); ctx.fill();
          var cg = ctx.createRadialGradient(0, -20, 1, 0, -20, 18);
          cg.addColorStop(0, 'rgba(255,230,150,' + (0.35 * glowAmt * flick) + ')');
          cg.addColorStop(1, 'rgba(255,230,150,0)');
          ctx.fillStyle = cg;
          ctx.beginPath(); ctx.arc(0, -20, 18, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#8A7E6B';
        ctx.beginPath(); ctx.roundRect(-14, 30, 28, 8, 3); ctx.fill();
        ctx.fillStyle = '#5A5040';
        ctx.beginPath(); ctx.roundRect(-16, 38, 32, 5, 2); ctx.fill();
        break;
      default:
        drawGlassAndGlow([[-28, 15], [-32, -10, -26, -40, 0, -48], [26, -40, 32, -10, 28, 15]], 0, -15, 36, glowAmt, flick);
        drawFilament(0, -10, glowAmt, flick);
        drawScrewBase(0, 15);
    }
    ctx.restore();
  }

  function drawMainGlow() {
    if (glowIntensity <= 0) return;
    var cx = mainBulb.x, cy = mainBulb.y - 10 * MAIN_SCALE;
    var g1 = ctx.createRadialGradient(cx, cy, 10, cx, cy, 250 * MAIN_SCALE);
    g1.addColorStop(0, 'rgba(255,213,128,' + (0.22 * glowIntensity) + ')');
    g1.addColorStop(0.3, 'rgba(245,166,35,' + (0.1 * glowIntensity) + ')');
    g1.addColorStop(1, 'rgba(245,166,35,0)');
    ctx.fillStyle = g1;
    ctx.beginPath(); ctx.arc(cx, cy, 250 * MAIN_SCALE, 0, Math.PI * 2); ctx.fill();
    var g2 = ctx.createRadialGradient(cx, cy - 8 * MAIN_SCALE, 3, cx, cy - 8 * MAIN_SCALE, 55 * MAIN_SCALE);
    g2.addColorStop(0, 'rgba(255,245,200,' + (0.35 * glowIntensity) + ')');
    g2.addColorStop(1, 'rgba(255,245,200,0)');
    ctx.fillStyle = g2;
    ctx.beginPath(); ctx.arc(cx, cy - 8 * MAIN_SCALE, 55 * MAIN_SCALE, 0, Math.PI * 2); ctx.fill();
  }

  function drawRope() {
    ctx.beginPath();
    ctx.moveTo(rope.anchorX, rope.anchorY);
    ctx.lineTo(rope.endX, rope.endY);
    ctx.strokeStyle = '#6B6050';
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(rope.endX, rope.endY, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#5A5040';
    ctx.fill();
    ctx.strokeStyle = '#4A4030';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  function update() {
    flickerPhase += 0.15;
    flickerIntensity = bulbOn ? (0.92 + 0.08 * Math.sin(flickerPhase) + 0.04 * Math.sin(flickerPhase * 2.7)) : 0;
    if (bulbOn && glowIntensity < 1) glowIntensity = Math.min(1, glowIntensity + 0.02);
    else if (!bulbOn && glowIntensity > 0) glowIntensity = Math.max(0, glowIntensity - 0.012);

    var swayTarget = rope.dragging ? (rope.endX - rope.anchorX) * 0.0025 : 0;
    mainBulbSwayV += (swayTarget - mainBulbSway) * 0.07;
    mainBulbSwayV *= 0.91;
    mainBulbSway += mainBulbSwayV;
    if (Math.abs(mainBulbSway) < 0.0001 && Math.abs(mainBulbSwayV) < 0.0001) {
      mainBulbSway = 0; mainBulbSwayV = 0;
    }

    if (!rope.dragging) {
      var dy = (rope.anchorY + rope.restLength) - rope.endY;
      var dx = rope.anchorX - rope.endX;
      rope.velocityY += dy * 0.1;
      rope.velocityY *= 0.87;
      rope.endY += rope.velocityY;
      rope.endX += dx * 0.08;
      if (Math.abs(rope.velocityY) < 0.1 && Math.abs(dy) < 0.5) {
        rope.endY = rope.anchorY + rope.restLength;
        rope.endX = rope.anchorX;
        rope.velocityY = 0;
      }
    }

    var pullDist = rope.endY - (rope.anchorY + rope.restLength);
    if (pullDist > rope.toggleThreshold && !rope.pulled && !rope.cooldown) {
      rope.pulled = true;
      rope.cooldown = true;
      toggleTheme();
      setTimeout(function() { rope.cooldown = false; }, 800);
    }
    if (pullDist < 30) rope.pulled = false;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var time = performance.now() / 1000;
    bgBulbs.forEach(function(b) {
      var flick = 0.7 + b.flickerAmt * Math.sin(time * b.flickerSpeed + b.phase);
      drawBgBulbShape(b.x, b.y, b.scale, 0.12, flick, b.type);
    });
    drawMainGlow();
    drawBulbShape(mainBulb.x, mainBulb.y, MAIN_SCALE, glowIntensity, flickerIntensity, mainBulbSway);
    drawRope();
  }

  function loop() { update(); draw(); requestAnimationFrame(loop); }

  function getLocal(e) {
    var rect = canvas.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function onRopeStart(e) {
    e.preventDefault();
    var p = getLocal(e);
    if (Math.hypot(p.x - rope.endX, p.y - rope.endY) < 60) {
      rope.dragging = true;
      rope.dragOffsetY = p.y - rope.endY;
      hitarea.style.cursor = 'grabbing';
    }
  }

  function onRopeMove(e) {
    if (!rope.dragging) return;
    e.preventDefault();
    var p = getLocal(e);
    rope.endY = Math.max(rope.anchorY + 20, Math.min(H * 0.9, p.y - rope.dragOffsetY));
    rope.endX = Math.max(rope.anchorX - 90, Math.min(rope.anchorX + 90, p.x));
  }

  function onRopeEnd() {
    rope.dragging = false;
    hitarea.style.cursor = 'grab';
  }

  hitarea.addEventListener('mousedown', onRopeStart);
  hitarea.addEventListener('touchstart', onRopeStart, { passive: false });
  window.addEventListener('mousemove', onRopeMove);
  window.addEventListener('touchmove', onRopeMove, { passive: false });
  window.addEventListener('mouseup', onRopeEnd);
  window.addEventListener('touchend', onRopeEnd);

  window.addEventListener('resize', resize);
  resize();
  loop();

  setTimeout(function() {
    bulbOn = true;
    setTimeout(function() { document.body.classList.remove('loading'); }, 1200);
  }, 500 + Math.random() * 1500);
})();

/* =============================================
   THEME TOGGLE
   ============================================= */
function toggleTheme() {
  var html = document.documentElement;
  html.setAttribute('data-theme', html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

/* =============================================
   SCROLL REVEAL
   ============================================= */
(function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
})();

/* =============================================
   BOOKING — Calendar + Time Slots + SMS + QR
   ============================================= */
(function() {
  var monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  var dayLabels = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  var HOURS = [];
  for (var h = 12; h <= 23; h++) HOURS.push(h);

  var today = new Date(); today.setHours(0,0,0,0);
  var viewMonth = today.getMonth(), viewYear = today.getFullYear();
  var selectedDate = null;
  var selectedSlots = new Set();
  var selectedRoom = 'small', roomPrice = 1500;

  var grid = document.getElementById('cal-grid');
  var monthLabel = document.getElementById('cal-month');
  var prevBtn = document.getElementById('cal-prev');
  var nextBtn = document.getElementById('cal-next');
  var timeGrid = document.getElementById('time-grid');
  var dateLabel = document.getElementById('time-date');
  var bookBtn = document.getElementById('book-btn');
  var smsVerify = document.getElementById('sms-verify');
  var smsHint = document.getElementById('sms-hint');
  var confirmBtn = document.getElementById('confirm-btn');
  var smsCodeDisplay = document.getElementById('sms-code-display');
  var nameInput = document.getElementById('book-name');
  var phoneInput = document.getElementById('book-phone');
  var bookingPanel = document.querySelector('.booking-panel');

  var smsCode = '';
  var bookingConfirmed = false;

  /* ---- Calendar ---- */
  function renderCalendar() {
    grid.innerHTML = '';
    monthLabel.textContent = monthNames[viewMonth] + ' ' + viewYear;
    prevBtn.disabled = (viewYear === today.getFullYear() && viewMonth === today.getMonth());

    dayLabels.forEach(function(d) {
      var lbl = document.createElement('div');
      lbl.className = 'calendar-day-label';
      lbl.textContent = d;
      grid.appendChild(lbl);
    });

    var firstDay = new Date(viewYear, viewMonth, 1);
    var startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    var maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 13);

    for (var i = 0; i < startDay; i++) {
      var empty = document.createElement('div');
      empty.className = 'calendar-day empty';
      grid.appendChild(empty);
    }

    for (var d = 1; d <= daysInMonth; d++) {
      (function(dayNum) {
        var date = new Date(viewYear, viewMonth, dayNum);
        date.setHours(0,0,0,0);
        var btn = document.createElement('button');
        btn.className = 'calendar-day';
        btn.textContent = dayNum;
        var isPast = date < today;
        var isFuture = date > maxDate;
        var isToday = date.getTime() === today.getTime();
        var isSelected = selectedDate && date.getTime() === selectedDate.getTime();
        if (isPast || isFuture) btn.classList.add('disabled');
        if (isToday) btn.classList.add('today');
        if (isSelected) btn.classList.add('selected');
        if (!isPast && !isFuture) {
          btn.addEventListener('click', function() {
            selectedDate = date;
            renderCalendar();
            renderTimeSlots();
          });
        }
        grid.appendChild(btn);
      })(d);
    }
  }

  prevBtn.addEventListener('click', function() {
    if (viewYear === today.getFullYear() && viewMonth === today.getMonth()) return;
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });

  nextBtn.addEventListener('click', function() {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });

  renderCalendar();

  /* ---- Time Slots ---- */
  function getBookedSlots(date) {
    if (!date) return new Set();
    var seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    var booked = new Set();
    var count = 2 + (seed % 4);
    for (var i = 0; i < count; i++) booked.add(HOURS[(seed * (i + 3) * 7) % HOURS.length]);
    return booked;
  }

  function renderTimeSlots() {
    timeGrid.innerHTML = '';
    selectedSlots.clear();

    if (!selectedDate) {
      dateLabel.textContent = 'Сначала выберите дату';
      HOURS.forEach(function(h) {
        var s = document.createElement('div');
        s.className = 'time-slot';
        s.textContent = h + ':00';
        s.style.opacity = '0.3';
        s.style.cursor = 'not-allowed';
        timeGrid.appendChild(s);
      });
      updateSummary();
      return;
    }

    dateLabel.textContent = selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' });

    var booked = getBookedSlots(selectedDate);
    var isTodaySel = selectedDate.getTime() === today.getTime();
    var currentHour = new Date().getHours();

    HOURS.forEach(function(h, idx) {
      var slot = document.createElement('div');
      slot.className = 'time-slot';
      slot.textContent = h + ':00';
      slot.dataset.hour = h;
      slot.dataset.idx = idx;
      if (booked.has(h) || (isTodaySel && h <= currentHour)) slot.classList.add('booked');
      timeGrid.appendChild(slot);
    });

    var dragStartIdx = -1;
    var dragMoved = false;
    var startCX = 0, startCY = 0;

    function clearSel() {
      timeGrid.querySelectorAll('.time-slot.selecting').forEach(function(s) { s.classList.remove('selecting'); });
    }

    function highlightRange(toIdx) {
      var all = timeGrid.querySelectorAll('.time-slot');
      var lo = Math.min(dragStartIdx, toIdx), hi = Math.max(dragStartIdx, toIdx);
      all.forEach(function(s, i) {
        s.classList.remove('selecting');
        if (i >= lo && i <= hi && !s.classList.contains('booked')) s.classList.add('selecting');
      });
    }

    function applyRange(toIdx) {
      var all = timeGrid.querySelectorAll('.time-slot');
      var lo = Math.min(dragStartIdx, toIdx), hi = Math.max(dragStartIdx, toIdx);
      var hasBooked = false;
      for (var i = lo; i <= hi; i++) { if (all[i].classList.contains('booked')) { hasBooked = true; break; } }
      clearSel();
      if (hasBooked) { selectedSlots.clear(); all.forEach(function(s) { s.classList.remove('selected'); }); updateSummary(); return; }
      var newSel = new Set();
      for (var j = lo; j <= hi; j++) newSel.add(parseInt(all[j].dataset.hour));
      var isSame = newSel.size === selectedSlots.size && Array.from(newSel).every(function(h) { return selectedSlots.has(h); });
      all.forEach(function(s) { s.classList.remove('selected'); });
      selectedSlots.clear();
      if (!isSame) {
        for (var k = lo; k <= hi; k++) { selectedSlots.add(parseInt(all[k].dataset.hour)); all[k].classList.add('selected'); }
      }
      updateSummary();
    }

    function toggleSlot(e) {
      var s = e.target.closest('.time-slot');
      if (!s || s.classList.contains('booked') || s.style.cursor === 'not-allowed') return;
      var hour = parseInt(s.dataset.hour);
      if (selectedSlots.has(hour)) {
        selectedSlots.delete(hour);
        s.classList.remove('selected');
      } else {
        selectedSlots.add(hour);
        s.classList.add('selected');
      }
      updateSummary();
    }

    function onDown(e) {
      var s = e.target.closest('.time-slot');
      if (!s || s.classList.contains('booked') || s.style.cursor === 'not-allowed') return;
      var cx = e.touches ? e.touches[0].clientX : e.clientX;
      var cy = e.touches ? e.touches[0].clientY : e.clientY;
      dragStartIdx = parseInt(s.dataset.idx);
      dragMoved = false;
      startCX = cx;
      startCY = cy;
      highlightRange(dragStartIdx);
    }

    function onMove(e) {
      if (dragStartIdx < 0) return;
      var cx = e.touches ? e.touches[0].clientX : e.clientX;
      var cy = e.touches ? e.touches[0].clientY : e.clientY;
      if (Math.abs(cx - startCX) > 8 || Math.abs(cy - startCY) > 8) dragMoved = true;
      if (!dragMoved) return;
      var el = document.elementFromPoint(cx, cy);
      var s = el && el.closest('.time-slot');
      if (s && !s.classList.contains('booked')) highlightRange(parseInt(s.dataset.idx));
    }

    function onUp(e) {
      if (dragStartIdx < 0) return;
      var cx = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      var cy = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
      if (dragMoved) {
        var el = document.elementFromPoint(cx, cy);
        var s = el && el.closest('.time-slot');
        if (s && !s.classList.contains('booked')) applyRange(parseInt(s.dataset.idx));
        else clearSel();
      }
      dragStartIdx = -1;
      dragMoved = false;
    }

    timeGrid.addEventListener('mousedown', onDown);
    timeGrid.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    timeGrid.addEventListener('touchstart', onDown, { passive: true });
    timeGrid.addEventListener('touchmove', onMove, { passive: true });
    timeGrid.addEventListener('touchend', onUp);
    timeGrid.addEventListener('click', toggleSlot);

    updateSummary();
  }

  renderTimeSlots();

  /* ---- Room ---- */
  document.querySelectorAll('.room-option').forEach(function(roomBtn) {
    roomBtn.addEventListener('click', function() {
      document.querySelectorAll('.room-option').forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      selectedRoom = this.dataset.room;
      roomPrice = parseInt(this.dataset.price);
      updateSummary();
    });
  });

  /* ---- Summary ---- */
  function updateSummary() {
    var roomName = selectedRoom === 'small' ? 'Малый зал' : 'Всё анти-кафе';
    var count = selectedSlots.size;
    document.getElementById('sum-room').textContent = roomName;

    if (count === 0) {
      document.getElementById('sum-time').textContent = '—';
      document.getElementById('sum-duration').textContent = '—';
      document.getElementById('promo-row').style.display = 'none';
      document.getElementById('sum-total').textContent = '—';
      bookBtn.disabled = true;
      return;
    }

    var sorted = Array.from(selectedSlots).sort(function(a, b) { return a - b; });
    document.getElementById('sum-time').textContent = sorted[0] + ':00 — ' + (sorted[sorted.length - 1] + 1) + ':00';

    var promoActive = count === 3;
    var payHours = promoActive ? 3 : count;
    document.getElementById('sum-duration').textContent = count + ' ч';
    document.getElementById('promo-row').style.display = promoActive ? 'flex' : 'none';
    document.getElementById('sum-total').textContent = (payHours * roomPrice).toLocaleString('ru-RU') + ' ₽';
    bookBtn.disabled = false;
  }

  /* ---- Phone mask ---- */
  phoneInput.addEventListener('input', function() {
    var val = this.value.replace(/\D/g, '');
    if (val.length === 0) { this.value = ''; updateBookBtn(); return; }
    if (val[0] === '8') val = '7' + val.slice(1);
    if (val[0] !== '7') val = '7' + val;
    var formatted = '+7';
    if (val.length > 1) formatted += ' (' + val.slice(1, 4);
    if (val.length >= 4) formatted += ') ';
    if (val.length > 4) formatted += val.slice(4, 7);
    if (val.length > 7) formatted += '-' + val.slice(7, 9);
    if (val.length > 9) formatted += '-' + val.slice(9, 11);
    this.value = formatted;
    updateBookBtn();
  });

  /* ---- Book button ---- */
  function updateBookBtn() {
    if (bookingConfirmed) return;
    var hasPhone = phoneInput.value.replace(/\D/g, '').length >= 11;
    var hasName = nameInput.value.trim().length > 0;
    if (hasPhone && hasName) {
      bookBtn.textContent = 'Подтвердить';
      bookBtn.dataset.step = 'confirm';
    } else {
      bookBtn.textContent = 'Забронировать';
      bookBtn.dataset.step = 'book';
    }
  }

  nameInput.addEventListener('input', updateBookBtn);

  bookBtn.addEventListener('click', function() {
    if (bookingConfirmed) return;
    if (selectedSlots.size === 0) return;

    if (!nameInput.value.trim()) {
      nameInput.focus();
      nameInput.style.borderColor = 'var(--red)';
      setTimeout(function() { nameInput.style.borderColor = ''; }, 1500);
      return;
    }
    if (phoneInput.value.replace(/\D/g, '').length < 11) {
      phoneInput.focus();
      phoneInput.style.borderColor = 'var(--red)';
      setTimeout(function() { phoneInput.style.borderColor = ''; }, 1500);
      return;
    }

    if (bookBtn.dataset.step === 'confirm') {
      smsCode = String(Math.floor(1000 + Math.random() * 9000));
      smsCodeDisplay.textContent = smsCode;
      smsVerify.style.display = 'block';
      smsHint.style.display = 'block';
      bookBtn.style.display = 'none';
      document.getElementById('sms-code').focus();
    }
  });

  confirmBtn.addEventListener('click', function() {
    var codeInput = document.getElementById('sms-code').value.trim();
    if (codeInput === smsCode) {
      bookingConfirmed = true;
      showBookingResult();
    } else {
      var codeField = document.getElementById('sms-code');
      codeField.style.borderColor = 'var(--red)';
      setTimeout(function() { codeField.style.borderColor = ''; }, 1500);
    }
  });

  /* ---- Show booking result with QR ---- */
  function showBookingResult() {
    var sorted = Array.from(selectedSlots).sort(function(a, b) { return a - b; });
    var roomName = selectedRoom === 'small' ? 'Малый зал' : 'Всё анти-кафе';
    var dateStr = selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' });
    var timeStr = sorted[0] + ':00 — ' + (sorted[sorted.length - 1] + 1) + ':00';
    var total = document.getElementById('sum-total').textContent;

    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var qrFg = isDark ? '#F5A623' : '#D4880A';
    var qrBg = isDark ? '#1A1610' : '#FFF0D0';

    var qrText = 'https://www.google.com';

    var resultHTML = '<div class="booking-result">' +
      '<div class="result-icon"><svg class="bulb-svg" viewBox="0 0 64 64" width="64" height="64"><path class="bulb-glass" d="M32 4c-11 0-20 8-20 19 0 7 3 13 8 17v10h24V40c5-4 8-10 8-17 0-11-9-19-20-19z" fill="none" stroke="currentColor" stroke-width="2"/><path class="bulb-filament" d="M26 28c0-4 2-8 6-10 4 2 6 6 6 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect class="bulb-base" x="24" y="43" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><line class="bulb-thread" x1="26" y1="47" x2="38" y2="47" stroke="currentColor" stroke-width="1.5"/><line class="bulb-thread" x1="26" y1="50" x2="38" y2="50" stroke="currentColor" stroke-width="1.5"/><circle class="bulb-glow" cx="32" cy="24" r="22" fill="none" stroke="none"/></svg></div>' +
      '<h3>Бронирование подтверждено</h3>' +
      '<div class="result-details">' +
        '<div class="result-row"><span class="result-label">Имя</span><span class="result-value">' + nameInput.value + '</span></div>' +
        '<div class="result-row"><span class="result-label">Телефон</span><span class="result-value">' + phoneInput.value + '</span></div>' +
        '<div class="result-row"><span class="result-label">Дата</span><span class="result-value">' + dateStr + '</span></div>' +
        '<div class="result-row"><span class="result-label">Время</span><span class="result-value">' + timeStr + '</span></div>' +
        '<div class="result-row"><span class="result-label">Зал</span><span class="result-value">' + roomName + '</span></div>' +
        '<div class="result-row result-total"><span class="result-label">Итого</span><span class="result-value">' + total + '</span></div>' +
      '</div>' +
      '<div class="result-qr"><div id="qr-container"></div><p>Покажите QR-код на стойке</p></div>' +
    '</div>';

    bookingPanel.innerHTML = resultHTML;

    new QRCode(document.getElementById('qr-container'), {
      text: qrText,
      width: 180,
      height: 180,
      colorDark: qrFg,
      colorLight: qrBg,
      correctLevel: QRCode.CorrectLevel.M
    });

    setTimeout(function() {
      var resultIcon = document.querySelector('.result-icon');
      if (resultIcon) resultIcon.classList.add('bulb-on');
    }, 1500);
  }
})();
