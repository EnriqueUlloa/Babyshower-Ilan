/**
 * BABY SHOWER ILÁN - EXACT REPLICA WEB INVITATION
 * Interactive movements, audio lullaby, hotspots, and RSVP
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initEnvelope();
  initMusicBox();
  initCountdown();
  initHotspotsAndDock();
  initModals();
  initBunnyParallax();
});

/* =========================================================
   1. PARTICLES & FLOATING GOLDEN DUST CANVAS
   ========================================================= */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = 40;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Sparkle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.8 + 1.2;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.65 + 0.25;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulse = Math.random() * Math.PI;

      const rand = Math.random();
      if (rand < 0.5) {
        this.color = 'rgba(212, 175, 55, '; // Gold
      } else if (rand < 0.85) {
        this.color = 'rgba(138, 188, 230, '; // Baby Blue
      } else {
        this.color = 'rgba(255, 255, 255, '; // White
      }
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.pulse) * 0.2;
      this.pulse += this.pulseSpeed;

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      const currentAlpha = Math.max(0, Math.min(1, this.opacity * (0.6 + 0.4 * Math.sin(this.pulse))));
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + currentAlpha + ')';
      ctx.shadowBlur = 5;
      ctx.shadowColor = this.color + '0.5)';
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Sparkle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.65) return;
    const p = new Sparkle();
    p.x = e.clientX + (Math.random() - 0.5) * 20;
    p.y = e.clientY + (Math.random() - 0.5) * 20;
    p.speedY = -(Math.random() * 0.7 + 0.3);
    particles.push(p);
    if (particles.length > 65) particles.shift();
  });
}

/* =========================================================
   2. ENVELOPE OPENING CEREMONY
   ========================================================= */
function initEnvelope() {
  const envelopeModal = document.getElementById('envelope-overlay');
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('wax-seal');
  const openBtn = document.getElementById('open-btn');

  function openEnvelope() {
    if (envelope.classList.contains('open-animation')) return;

    playChime();
    envelope.classList.add('open-animation');

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#8abce6', '#d4af37', '#ffffff', '#558bbe']
      });
    }

    setTimeout(() => {
      envelopeModal.classList.add('opened');
      startMusicBox();
    }, 1100);
  }

  if (waxSeal) waxSeal.addEventListener('click', openEnvelope);
  if (openBtn) openBtn.addEventListener('click', openEnvelope);
  if (envelope) envelope.addEventListener('click', openEnvelope);
}

/* =========================================================
   3. AUDIO PLAYER (babyshower-music.mp3)
   ========================================================= */
let bgAudio = null;
let isMusicPlaying = false;

function getBgAudio() {
  if (!bgAudio) {
    bgAudio = document.getElementById('bg-music');
    if (!bgAudio) {
      bgAudio = new Audio('assets/babyshower-music.mp3');
      bgAudio.loop = true;
    }
    bgAudio.volume = 0.65;
  }
  return bgAudio;
}

function playNote(freq, duration = 0.8, volume = 0.15) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch (err) {
    // optional sound effect fallback
  }
}

function playChime() {
  playNote(659.25, 0.4, 0.15);
  setTimeout(() => playNote(783.99, 0.5, 0.15), 110);
  setTimeout(() => playNote(1046.50, 0.8, 0.2), 220);
}

function startMusicBox() {
  const audio = getBgAudio();
  const musicBtn = document.getElementById('music-control-btn');

  audio.play().then(() => {
    isMusicPlaying = true;
    if (musicBtn) {
      musicBtn.classList.add('playing');
      musicBtn.classList.remove('paused');
    }
  }).catch((err) => {
    console.log("Audio autoplay waiting for user interaction:", err);
  });
}

function stopMusicBox() {
  const audio = getBgAudio();
  const musicBtn = document.getElementById('music-control-btn');

  audio.pause();
  isMusicPlaying = false;
  if (musicBtn) {
    musicBtn.classList.remove('playing');
    musicBtn.classList.add('paused');
  }
}

function initMusicBox() {
  const musicBtn = document.getElementById('music-control-btn');
  if (!musicBtn) return;

  musicBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
      stopMusicBox();
      showToast("Música pausada 🔇");
    } else {
      startMusicBox();
      showToast("Reproduciendo música 🎵");
    }
  });
}

/* =========================================================
   4. TOAST NOTIFICATIONS
   ========================================================= */
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.innerText = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* =========================================================
   5. HOTSPOTS, DOCK & CLIPBOARD ACTIONS
   ========================================================= */
function initHotspotsAndDock() {
  const mesaCode = '60041743';

  function copyLiverpoolCode() {
    navigator.clipboard.writeText(mesaCode).then(() => {
      showToast(`¡Código Liverpool ${mesaCode} copiado! ✓`);
      playNote(880, 0.25, 0.15);
    }).catch(() => {
      prompt('Copia el código de Liverpool:', mesaCode);
    });
  }

  // Hotspot: Mesa de Regalos text & QR - Opens Liverpool link directly
  const liverpoolUrl = 'https://mesaderegalos.liverpool.com.mx/milistaderegalos/60041743';

  const hotspotRegistry = document.getElementById('hotspot-registry');
  if (hotspotRegistry) {
    hotspotRegistry.addEventListener('click', () => {
      showToast("Abriendo Mesa de Regalos Liverpool... 🎁");
    });
  }

  // Hotspot: QR Code - Expands QR in large modal
  const hotspotQr = document.getElementById('hotspot-qr');
  if (hotspotQr) {
    hotspotQr.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('qr-modal');
    });
  }

  // Modal copy button (if modal is opened)
  const modalCopyBtn = document.getElementById('modal-copy-btn');
  if (modalCopyBtn) {
    modalCopyBtn.addEventListener('click', copyLiverpoolCode);
  }

  // Hotspot: Fecha y Hora -> Calendar Modal
  const hotspotDatetime = document.getElementById('hotspot-datetime');
  if (hotspotDatetime) {
    hotspotDatetime.addEventListener('click', () => openModal('calendar-modal'));
  }

  // Dock: Calendar button
  const dockCalendarBtn = document.getElementById('dock-calendar-btn');
  if (dockCalendarBtn) {
    dockCalendarBtn.addEventListener('click', () => openModal('calendar-modal'));
  }

  // Setup Google Calendar & iCal
  const calGoogle = document.getElementById('cal-google');
  if (calGoogle) {
    const title = encodeURIComponent('Baby Shower de Ilán 🐰💙');
    const details = encodeURIComponent('Ven a celebrar la dulce espera de nuestro amado Ilán.\nMesa de regalos Liverpool: 60041743\nLugar: 21 sur #120, Colonia las Flores, Tehuacán, Pue. Salón los guisos');
    const location = encodeURIComponent('21 sur #120, Colonia las Flores, Tehuacán, Pue. Salón los guisos');
    const dates = '20261003T200000Z/20261004T010000Z';
    calGoogle.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  }

  const calIcs = document.getElementById('cal-ics');
  if (calIcs) {
    calIcs.addEventListener('click', () => {
      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Baby Shower Ilan//Elena y Enrique//ES',
        'BEGIN:VEVENT',
        'UID:babyshower-ilan-2026@elenayenrique.com',
        'DTSTAMP:20260916T120000Z',
        'DTSTART:20261003T200000Z',
        'DTEND:20261004T010000Z',
        'SUMMARY:Baby Shower de Ilán 🐰💙',
        'DESCRIPTION:Celebración de la dulce espera de Ilán. Mesa Liverpool: 60041743',
        'LOCATION:21 sur\\, #120\\, Colonia las Flores\\, Tehuacán\\, Pue. Salón los guisos',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Baby_Shower_Ilan.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Descargando evento de calendario... 📅");
    });
  }

  // Hotspot: RSVP
  const hotspotRsvp = document.getElementById('hotspot-rsvp');
  if (hotspotRsvp) {
    hotspotRsvp.addEventListener('click', () => openModal('rsvp-modal'));
  }

  // Dock: RSVP button
  const dockRsvpBtn = document.getElementById('dock-rsvp-btn');
  if (dockRsvpBtn) {
    dockRsvpBtn.addEventListener('click', () => openModal('rsvp-modal'));
  }
}

/* =========================================================
   6. COUNTDOWN TIMER
   ========================================================= */
function initCountdown() {
  const targetDate = new Date('2026-10-03T14:00:00-06:00').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minutesEl) minutesEl.innerText = '00';
      if (secondsEl) secondsEl.innerText = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(h).padStart(2, '0');
    if (minutesEl) minutesEl.innerText = String(m).padStart(2, '0');
    if (secondsEl) secondsEl.innerText = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* =========================================================
   7. MODALS & RSVP SUBMIT
   ========================================================= */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function initModals() {
  // Close buttons
  const closeQr = document.getElementById('close-qr-modal');
  if (closeQr) closeQr.addEventListener('click', () => closeModal('qr-modal'));

  const closeRsvp = document.getElementById('close-rsvp-modal');
  if (closeRsvp) closeRsvp.addEventListener('click', () => closeModal('rsvp-modal'));

  const closeCalendar = document.getElementById('close-calendar-modal');
  if (closeCalendar) closeCalendar.addEventListener('click', () => closeModal('calendar-modal'));

  const closeSuccess = document.getElementById('close-success-btn');
  if (closeSuccess) closeSuccess.addEventListener('click', () => closeModal('success-modal'));

  // Close when clicking outside
  document.querySelectorAll('.modal-backdrop').forEach(bd => {
    bd.addEventListener('click', (e) => {
      if (e.target === bd) {
        bd.classList.remove('active');
        bd.setAttribute('aria-hidden', 'true');
      }
    });
  });

  // Radio button toggle
  const choiceYes = document.getElementById('choice-yes');
  const choiceNo = document.getElementById('choice-no');
  const guestGroup = document.getElementById('guests-number-group');

  if (choiceYes && choiceNo) {
    choiceYes.addEventListener('click', () => {
      choiceYes.classList.add('selected');
      choiceNo.classList.remove('selected');
      if (guestGroup) guestGroup.style.display = 'block';
    });

    choiceNo.addEventListener('click', () => {
      choiceNo.classList.add('selected');
      choiceYes.classList.remove('selected');
      if (guestGroup) guestGroup.style.display = 'none';
    });
  }

  // RSVP Form Submit -> Direct WhatsApp Redirection
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('guest-name').value.trim();
      const isAttending = document.querySelector('input[name="attending"]:checked').value;
      let msg = '';
      if (isAttending === 'si') {
        if (name) {
          msg = `¡Hola Elena y Enrique! 💙 Soy ${name}. Confirmo con mucho gusto mi asistencia al Baby Shower de su amado Ilán el sábado 03 de octubre. ¡Nos vemos pronto! 🎉`;
        } else {
          msg = `¡Hola Elena y Enrique! 💙 Confirmo con mucho gusto mi asistencia al Baby Shower de su amado Ilán el sábado 03 de octubre. ¡Nos vemos pronto! 🎉`;
        }
      } else {
        if (name) {
          msg = `¡Hola Elena y Enrique! 💙 Soy ${name}. Muchas gracias por la invitación al Baby Shower de su amado Ilán. Lamentablemente no podré acompañarlos, ¡pero les deseo lo mejor y muchas bendiciones para el bebé! ✨`;
        } else {
          msg = `¡Hola Elena y Enrique! 💙 Muchas gracias por la invitación al Baby Shower de su amado Ilán. Lamentablemente no podré acompañarlos, ¡pero les deseo lo mejor y muchas bendiciones para el bebé! ✨`;
        }
      }

      if (isAttending === 'si' && typeof confetti === 'function') {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8abce6', '#d4af37', '#ffffff', '#558bbe']
        });
      }

      closeModal('rsvp-modal');
      showToast("Redirigiendo a WhatsApp... 💬");

      // Obfuscated WhatsApp dispatch - no plain text number, isolated closure, not accessible via window/console
      (() => {
        const _k = [0x5f, 0x1a, 0x7c, 0x33];
        const _d = [0x6a, 0x28, 0x4e, 0x00, 0x67, 0x2b, 0x4c, 0x03, 0x66, 0x2d, 0x4d, 0x00];
        const _dest = _d.map((b, i) => String.fromCharCode(b ^ _k[i % _k.length])).join('');
        const _ep = atob('aHR0cHM6Ly9hcGkud2hhdHNhcHAuY29tL3NlbmQ/cGhvbmU9');
        const waUrl = `${_ep}${_dest}&text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank');
      })();
    });
  }
}

/* =========================================================
   8. PETER RABBIT 3D CURSOR PARALLAX
   ========================================================= */
function initBunnyParallax() {
  const card = document.getElementById('invitation-card');
  const bunnyImg = document.getElementById('bunny-img');
  if (!card || !bunnyImg) return;

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const tiltX = (y / (rect.height / 2)) * -5;
      const tiltY = (x / (rect.width / 2)) * 5;

      bunnyImg.style.transform = `perspective(500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      bunnyImg.style.transform = '';
    });
  }
}
