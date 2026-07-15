(function() {
    'use strict';

    // DOM refs
    const opening = document.getElementById('opening');
    const btnOpen = document.getElementById('btnOpen');
    const audio = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('music-btn');
    const musicIcon = document.getElementById('musicIcon');

    // AudioContext & GainNode (for smooth fade)
    let audioCtx = null;
    let gainNode = null;
    let source = null;
    let isPlaying = false;

    function initAudioContext() {
        if (!audioCtx) {
            audioCtx = new(window.AudioContext || window.webkitAudioContext)();
            source = audioCtx.createMediaElementSource(audio);
            gainNode = audioCtx.createGain();
            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            gainNode.gain.value = 1;
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // ----- BUKA UNDANGAN -----
    btnOpen.addEventListener('click', function() {
        opening.classList.add('hide');
        initAudioContext();
        audio.play().catch(function(err) {
            console.warn('Audio play failed:', err);
        });
        musicBtn.classList.remove('paused');
        musicIcon.className = 'fas fa-pause';
        isPlaying = true;
    });

    // ----- MUSIC BUTTON (toggle with fade) -----
    function fadeVolume(target, duration) {
        duration = duration || 600;
        if (!gainNode) return;
        const start = gainNode.gain.value;
        const startTime = audioCtx.currentTime;
        const endTime = startTime + duration / 1000;

        function update() {
            const now = audioCtx.currentTime;
            const progress = Math.min(1, (now - startTime) / (duration / 1000));
            const currentVal = start + (target - start) * progress;
            gainNode.gain.setValueAtTime(currentVal, audioCtx.currentTime);
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        update();
    }

    musicBtn.addEventListener('click', function() {
        initAudioContext();

        if (audio.paused) {
            audio.play().catch(function(err) {
                console.warn('Audio play failed:', err);
            });
            fadeVolume(1, 500);
            musicBtn.classList.remove('paused');
            musicIcon.className = 'fas fa-pause';
            isPlaying = true;
        } else {
            fadeVolume(0, 400);
            setTimeout(function() {
                audio.pause();
                musicBtn.classList.add('paused');
                musicIcon.className = 'fas fa-play';
                isPlaying = false;
            }, 450);
        }
    });

    // ----- RESTORE STATE ON LOAD -----
    window.addEventListener('load', function() {
        if (opening.classList.contains('hide')) {
            if (!audio.paused) {
                musicBtn.classList.remove('paused');
                musicIcon.className = 'fas fa-pause';
                if (!audioCtx) initAudioContext();
                if (gainNode) gainNode.gain.value = 1;
                isPlaying = true;
            } else {
                musicBtn.classList.add('paused');
                musicIcon.className = 'fas fa-play';
                isPlaying = false;
            }
        } else {
            audio.pause();
            musicBtn.classList.add('paused');
            musicIcon.className = 'fas fa-play';
            isPlaying = false;
        }
    });

    // ============================================================
//  RSVP FORM HANDLING
// ============================================================

// Replace with your Google Apps Script Web App URL
const RSVP_API_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

const rsvpForm = document.getElementById('rsvpForm');
const rsvpSubmitBtn = document.getElementById('rsvpSubmitBtn');
const rsvpSuccess = document.getElementById('rsvpSuccess');
const rsvpError = document.getElementById('rsvpError');
const rsvpNama = document.getElementById('rsvpNama');
const rsvpJumlah = document.getElementById('rsvpJumlah');
const rsvpPesan = document.getElementById('rsvpPesan');
const rsvpPhone = document.getElementById('rsvpPhone');
const jumlahTamuWrapper = document.getElementById('jumlahTamuWrapper');

// ===== Auto-fill name from URL parameter =====
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
const guestName = getQueryParam('to');
if (guestName) {
    rsvpNama.value = decodeURIComponent(guestName);
    rsvpNama.readOnly = true;
    rsvpNama.style.background = '#f0ede8';
    rsvpNama.style.color = '#555';
}

// ===== Toggle "Jumlah Tamu" field based on status =====
document.querySelectorAll('input[name="status"]').forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'Hadir') {
            jumlahTamuWrapper.style.display = 'block';
            rsvpJumlah.required = true;
        } else {
            jumlahTamuWrapper.style.display = 'none';
            rsvpJumlah.required = false;
        }
    });
});

// ===== Submit handler =====
rsvpForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Hide previous messages
    rsvpError.style.display = 'none';
    rsvpSuccess.style.display = 'none';
    
    // Get form data
    const status = document.querySelector('input[name="status"]:checked');
    if (!status) {
        rsvpError.textContent = '❌ Silakan pilih status kehadiran.';
        rsvpError.style.display = 'block';
        return;
    }
    
    const formData = {
        nama: rsvpNama.value.trim(),
        status: status.value,
        jumlah: status.value === 'Hadir' ? rsvpJumlah.value : '0',
        pesan: rsvpPesan.value.trim(),
        phone: rsvpPhone.value || ''
    };
    
    if (!formData.nama) {
        rsvpError.textContent = '❌ Silakan masukkan nama lengkap.';
        rsvpError.style.display = 'block';
        return;
    }
    
    // Disable button and show loading
    rsvpSubmitBtn.disabled = true;
    rsvpSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    
    try {
        const response = await fetch(RSVP_API_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        // Since we use 'no-cors', we can't read the response directly
        // So we assume success if no network error
        
        // Hide form, show success
        rsvpForm.style.display = 'none';
        rsvpSuccess.style.display = 'block';
        
    } catch (error) {
        console.error('RSVP Error:', error);
        rsvpError.textContent = '❌ Gagal mengirim RSVP. Silakan coba lagi.';
        rsvpError.style.display = 'block';
    } finally {
        rsvpSubmitBtn.disabled = false;
        rsvpSubmitBtn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right:10px;"></i> Kirim RSVP';
    }
});

// ===== Reset form (for "Kirim RSVP Lain" button) =====
function resetForm() {
    rsvpForm.style.display = 'block';
    rsvpSuccess.style.display = 'none';
    rsvpForm.reset();
    jumlahTamuWrapper.style.display = 'none';
    rsvpNama.readOnly = false;
    rsvpNama.style.background = '#faf9f6';
    rsvpNama.style.color = 'inherit';
    rsvpError.style.display = 'none';
    // Scroll to form
    document.getElementById('rsvp').scrollIntoView({ behavior: 'smooth' });
}
    
    // ----- COPY REKENING (CLIPBOARD API) -----
    const btnCopy = document.getElementById('btnCopyRekening');
    const rekeningText = document.getElementById('rekeningDisplay').innerText;
    const feedback = document.getElementById('copyFeedback');

    btnCopy.addEventListener('click', function() {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(rekeningText).then(function() {
                showCopiedFeedback();
            }).catch(function() {
                fallbackCopy();
            });
        } else {
            fallbackCopy();
        }
    });

    function fallbackCopy() {
        const textArea = document.createElement('textarea');
        textArea.value = rekeningText;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showCopiedFeedback();
        } catch (err) {
            feedback.textContent = 'Gagal menyalin, silakan salin manual.';
            feedback.style.color = '#b33c3c';
        }
        document.body.removeChild(textArea);
    }

    function showCopiedFeedback() {
        btnCopy.classList.add('copied');
        btnCopy.innerHTML = '<i class="fas fa-check" style="margin-right:10px;"></i> ✓ Nomor Rekening Disalin';
        feedback.textContent = '';
        setTimeout(function() {
            btnCopy.classList.remove('copied');
            btnCopy.innerHTML = '<i class="fas fa-copy" style="margin-right:10px;"></i> Salin Nomor Rekening';
        }, 3000);
    }

    // ----- INTERSECTION OBSERVER (fade-up, fade-in) -----
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .fade-in').forEach(function(el) {
        observer.observe(el);
    });

    // ----- PARALLAX RINGAN (hero) -----
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', function() {
        const offset = window.pageYOffset;
        if (offset < window.innerHeight) {
            hero.style.backgroundPositionY = offset * 0.3 + 'px';
        }
    }, { passive: true });

    // ----- SMOOTH SCROLL for anchors -----
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

})();
