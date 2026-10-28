/* ============================================================
   1) محرك الصوت — كسر خفيف مُولَّد (بدون ملفات)
   ============================================================ */
let audioCtx = null;

function ensureAudio() {
    if (!audioCtx) {
        try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
        catch (e) { return false; }
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return true;
}

function playCrack() {
    if (!ensureAudio()) return;
    const ctx = audioCtx;
    const now = ctx.currentTime;

    // ضجيج أبيض قصير مع انحدار
    const dur = 0.07;
    const size = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < size; i++) {
        const t = i / size;
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1200 + Math.random() * 900;

    const g1 = ctx.createGain();
    g1.gain.setValueAtTime(0.11, now);
    g1.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    noise.connect(hp);
    hp.connect(g1);
    g1.connect(ctx.destination);
    noise.start(now);

    // نغمة عالية قصيرة
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400 + Math.random() * 700, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.06);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.04, now);
    g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(g2);
    g2.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
}

/* ============================================================
   2) إيجاد موقع المؤشر داخل الحقل (لغة عربية RTL)
   ============================================================ */
function getCaretCoords(input) {
    const rect  = input.getBoundingClientRect();
    const style = window.getComputedStyle(input);

    const mirror = document.createElement('span');
    mirror.style.cssText = `
        position: absolute; top: -9999px; left: -9999px; visibility: hidden;
        white-space: pre; direction: rtl;
        font-family: ${style.fontFamily};
        font-size: ${style.fontSize};
        font-weight: ${style.fontWeight};
        letter-spacing: ${style.letterSpacing};
    `;
    const pos = input.selectionStart != null ? input.selectionStart : input.value.length;
    mirror.textContent = input.value.substring(0, pos);
    document.body.appendChild(mirror);
    const textWidth = mirror.offsetWidth;
    mirror.remove();

    const bR = parseFloat(style.borderRightWidth) || 0;
    const bL = parseFloat(style.borderLeftWidth)  || 0;
    const pR = parseFloat(style.paddingRight)     || 0;
    const pL = parseFloat(style.paddingLeft)      || 0;

    let x = rect.right - bR - pR - textWidth;
    x = Math.max(rect.left + bL + pL + 2, Math.min(rect.right - bR - pR - 2, x));
    const y = rect.top + rect.height / 2;
    return { x, y };
}

/* ============================================================
   3) الشظايا + الموجة
   ============================================================ */
const SHARD_COLORS = ['#73022c', '#a52a4e', '#facc15', '#eab308', '#5a021f'];

function spawnShards(x, y, count = 7) {
    for (let i = 0; i < count; i++) {
        const shard = document.createElement('div');
        const s = 3 + Math.random() * 5;
        shard.style.cssText = `
            position: fixed; left: ${x}px; top: ${y}px;
            width: ${s}px; height: ${s}px;
            background: ${SHARD_COLORS[Math.floor(Math.random() * SHARD_COLORS.length)]};
            pointer-events: none; z-index: 9999; border-radius: 1px;
            box-shadow: 0 0 4px rgba(250, 204, 21, 0.7);
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        `;
        document.body.appendChild(shard);

        const angle = Math.random() * Math.PI * 2;
        const dist  = 20 + Math.random() * 45;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 8;
        const rot = (Math.random() - 0.5) * 720;
        const dur = 450 + Math.random() * 350;

        shard.animate([
            { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
            { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(0.15)`, opacity: 0 }
        ], { duration: dur, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)', fill: 'forwards' })
        .onfinish = () => shard.remove();
    }
}

function spawnRipple(x, y) {
    const ring = document.createElement('div');
    ring.style.cssText = `
        position: fixed; left: ${x}px; top: ${y}px;
        width: 40px; height: 40px; margin-left: -20px; margin-top: -20px;
        border: 2px solid #facc15; border-radius: 50%;
        pointer-events: none; z-index: 9998;
    `;
    document.body.appendChild(ring);
    ring.animate([
        { transform: 'scale(0.2)', opacity: 0.9 },
        { transform: 'scale(1.4)', opacity: 0 }
    ], { duration: 380, easing: 'ease-out' })
    .onfinish = () => ring.remove();
}

/* ============================================================
   4) ربط التأثير بكل حقل كتابة
   ============================================================ */
document.querySelectorAll('.type-crack').forEach(input => {
    input.addEventListener('input', (e) => {
        if (e.inputType && e.inputType.startsWith('delete')) return;
        if (e.inputType === 'insertFromPaste') return;
        if (e.data == null) return;

        playCrack();
        const { x, y } = getCaretCoords(input);
        spawnShards(x, y, 7);
        spawnRipple(x, y);

        input.classList.remove('input-cracking');
        void input.offsetWidth;
        input.classList.add('input-cracking');
    });

    input.addEventListener('animationend', () => {
        input.classList.remove('input-cracking');
    });
});

/* ============================================================
   5) اختيار المقاس
   ============================================================ */
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('[data-card]');
        card.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        card.querySelector('.selected-size-label').innerText = btn.dataset.size;
    });
});

/* ============================================================
   6) إرسال واتساب (مستقل لكل بطاقة)
   ============================================================ */
const whatsappNumber = '212771642822';
const detailsUrl = 'index.html';

function sendWhatsAppOrder(btn) {
    const card = btn.closest('[data-card]');
    const size = card.querySelector('.size-btn.active')?.dataset.size || 'XXL';
    const name = card.querySelector('.name-input').value.trim() || 'غير محدد';
    const city = card.querySelector('.city-input').value.trim() || 'غير محدد';
    const pid  = card.dataset.productId;
    const price = card.dataset.productPrice;

    const message =
        `*السلام عليكم،*\n*أريد طلب المنتج رقم: ${pid}*\n` +
        `> الحجم المختار: ${size}\n> السعر: ${price}.\n` +
        `> الاسم: ${name}\n> المدينة/العنوان: ${city}\n*يرجى تأكيد الطلب.*`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
}

function goToDetails() {
    window.location.href = detailsUrl;
}
