(function() {
    'use strict';

    // ============================================================
    //  1. UTILITY FUNCTIONS
    // ============================================================
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // ============================================================
    //  2. DOM REFS
    // ============================================================
    const opening = document.getElementById('opening');
    const btnOpen = document.getElementById('btnOpen');
    const audio = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('music-btn');
    const musicIcon = document.getElementById('musicIcon');

    // ============================================================
    //  3. AUDIO CONTEXT & GAIN (for smooth fade)
    // ============================================================
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

    // ============================================================
    //  4. OPENING SCREEN
    // ============================================================
    // Personalize greeting from URL
    const recipientName = getQueryParam('to');
    if (recipientName) {
        const decodedName = decodeURIComponent(recipientName);
        const openingGreeting = document.getElementById('openingGreeting');
        const heroGreeting = document.getElementById('heroGreeting');
        if (openingGreeting) {
            openingGreeting.innerHTML = `Kepada Yth. <strong>${decodedName}</strong>`;
        }
        if (heroGreeting) {
            heroGreeting.innerHTML = `Kepada Yth. <strong>${decodedName}</strong>`;
        }
    }

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

    // ============================================================
    //  5. MUSIC TOGGLE
    // ============================================================
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

    // ============================================================
    //  6. PAUSE MUSIC WHEN TAB NOT FOCUSED
    // ============================================================
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (!audio.paused) {
                audio.pause();
                audio.dataset.wasPlaying = 'true';
                musicBtn.classList.add('paused');
                musicIcon.className = 'fas fa-play';
            } else {
                audio.dataset.wasPlaying = 'false';
            }
        } else {
            if (audio.dataset.wasPlaying === 'true') {
                audio.play().catch(() => {});
                musicBtn.classList.remove('paused');
                musicIcon.className = 'fas fa-pause';
                audio.dataset.wasPlaying = 'false';
            }
        }
    });

    window.addEventListener('pagehide', function() {
        if (!audio.paused) {
            audio.pause();
            audio.dataset.wasPlaying = 'true';
        }
    });

    // ============================================================
    //  7. RESTORE STATE ON LOAD
    // ============================================================
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
    //  8. NAVBAR SCROLL EFFECT
    // ============================================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ============================================================
    //  9. LIGHTBOX (IMAGE VIEWER)
    // ============================================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightbox = document.getElementById('closeLightbox');

    document.querySelectorAll('.gallery-item').forEach(function(item) {
        item.addEventListener('click', function(e) {
            const src = this.dataset.src;
            if (src) {
                lightboxImg.src = src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightboxFn() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeLightbox) {
        closeLightbox.addEventListener('click', closeLightboxFn);
    }
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) closeLightboxFn();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightboxFn();
        }
    });

    // ============================================================
    //  10. COPY REKENING
    // ============================================================
    const btnCopy = document.getElementById('btnCopyRekening');
    const rekeningDisplay = document.getElementById('rekeningDisplay');
    const feedback = document.getElementById('copyFeedback');

    if (btnCopy && rekeningDisplay) {
        const rekeningText = rekeningDisplay.innerText;

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
                if (feedback) {
                    feedback.textContent = 'Gagal menyalin, silakan salin manual.';
                    feedback.style.color = '#b33c3c';
                }
            }
            document.body.removeChild(textArea);
        }

        function showCopiedFeedback() {
            btnCopy.classList.add('copied');
            btnCopy.innerHTML = '<i class="fas fa-check" style="margin-right:10px;"></i> ✓ Nomor Rekening Disalin';
            if (feedback) feedback.textContent = '';
            setTimeout(function() {
                btnCopy.classList.remove('copied');
                btnCopy.innerHTML = '<i class="fas fa-copy" style="margin-right:10px;"></i> Salin Nomor Rekening';
            }, 3000);
        }
    }

    // ============================================================
    //  11. INTERSECTION OBSERVER (fade-up, fade-in)
    // ============================================================
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

    // ============================================================
    //  12. PARALLAX RINGAN (hero)
    // ============================================================
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', function() {
        const offset = window.pageYOffset;
        if (offset < window.innerHeight) {
            hero.style.backgroundPositionY = offset * 0.3 + 'px';
        }
    }, { passive: true });

    // ============================================================
    //  13. SMOOTH SCROLL for anchors
    // ============================================================
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

    // ============================================================
    //  14. RSVP — KONFIRMASI KEHADIRAN
    // ============================================================
    // Konfigurasi — GANTI DENGAN URL APPS SCRIPT ANDA
    const RSVP_API_URL = 'https://script.google.com/macros/s/AKfycbwuo27BzNDsfwyxpcYK8wP9N6DSUUrXmdyefxc2_zVAoWlRXivYssB4bNEms5UoGo96/exec';

    // Ambil elemen
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSubmitBtn = document.getElementById('rsvpSubmitBtn');
    const rsvpSuccess = document.getElementById('rsvpSuccess');
    const rsvpError = document.getElementById('rsvpError');
    const rsvpNama = document.getElementById('rsvpNama');
    const rsvpJumlah = document.getElementById('rsvpJumlah');
    const rsvpPesan = document.getElementById('rsvpPesan');
    const rsvpPhone = document.getElementById('rsvpPhone');
    const jumlahTamuWrapper = document.getElementById('jumlahTamuWrapper');

    // Cek apakah elemen RSVP ada di halaman
    if (rsvpForm) {
        // ===== Auto-fill nama dari URL (jika ada) =====
        const guestName = getQueryParam('to');
        if (guestName && rsvpNama) {
            rsvpNama.value = decodeURIComponent(guestName);
            rsvpNama.readOnly = true;
            rsvpNama.style.background = '#f0ede8';
            rsvpNama.style.color = '#555';
        }

        // ===== Toggle "Jumlah Tamu" berdasarkan status =====
        const statusRadios = document.querySelectorAll('input[name="status"]');
        if (statusRadios.length) {
            statusRadios.forEach(function(radio) {
                radio.addEventListener('change', function() {
                    if (this.value === 'Hadir') {
                        if (jumlahTamuWrapper) {
                            jumlahTamuWrapper.style.display = 'block';
                        }
                        if (rsvpJumlah) {
                            rsvpJumlah.required = true;
                        }
                    } else {
                        if (jumlahTamuWrapper) {
                            jumlahTamuWrapper.style.display = 'none';
                        }
                        if (rsvpJumlah) {
                            rsvpJumlah.required = false;
                        }
                    }
                });
            });
        }

        // ===== Submit handler =====
        rsvpForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Sembunyikan pesan sebelumnya
            if (rsvpError) rsvpError.style.display = 'none';
            if (rsvpSuccess) rsvpSuccess.style.display = 'none';

            // Ambil status
            const statusRadio = document.querySelector('input[name="status"]:checked');
            if (!statusRadio) {
                if (rsvpError) {
                    rsvpError.textContent = '❌ Silakan pilih status kehadiran.';
                    rsvpError.style.display = 'block';
                }
                return;
            }

            // Siapkan data
            const formData = {
                nama: rsvpNama ? rsvpNama.value.trim() : '',
                status: statusRadio.value,
                jumlah: statusRadio.value === 'Hadir' ? (rsvpJumlah ? rsvpJumlah.value : '1') : '0',
                pesan: rsvpPesan ? rsvpPesan.value.trim() : '',
                phone: rsvpPhone ? rsvpPhone.value : ''
            };

            if (!formData.nama) {
                if (rsvpError) {
                    rsvpError.textContent = '❌ Silakan masukkan nama lengkap.';
                    rsvpError.style.display = 'block';
                }
                return;
            }

            // Disable tombol & loading
            if (rsvpSubmitBtn) {
                rsvpSubmitBtn.disabled = true;
                rsvpSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            }

            try {
                const response = await fetch(RSVP_API_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                // Karena mode 'no-cors', kita tidak bisa baca response
                // Tapi jika tidak ada error network, anggap sukses
                if (rsvpForm) rsvpForm.style.display = 'none';
                if (rsvpSuccess) rsvpSuccess.style.display = 'block';

            } catch (error) {
                console.error('RSVP Error:', error);
                if (rsvpError) {
                    rsvpError.textContent = '❌ Gagal mengirim RSVP. Silakan coba lagi.';
                    rsvpError.style.display = 'block';
                }
            } finally {
                if (rsvpSubmitBtn) {
                    rsvpSubmitBtn.disabled = false;
                    rsvpSubmitBtn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right:10px;"></i> Kirim RSVP';
                }
            }
        });
    }

    // ===== Reset form (untuk tombol "Kirim RSVP Lain") =====
    window.resetRsvpForm = function() {
        if (rsvpForm) {
            rsvpForm.style.display = 'block';
            if (rsvpSuccess) rsvpSuccess.style.display = 'none';
            rsvpForm.reset();
            if (jumlahTamuWrapper) jumlahTamuWrapper.style.display = 'none';
            
            // Jika nama diisi otomatis dari URL, jangan reset
            const guestNameFromUrl = getQueryParam('to');
            if (guestNameFromUrl && rsvpNama) {
                rsvpNama.value = decodeURIComponent(guestNameFromUrl);
                rsvpNama.readOnly = true;
                rsvpNama.style.background = '#f0ede8';
                rsvpNama.style.color = '#555';
            } else if (rsvpNama) {
                rsvpNama.readOnly = false;
                rsvpNama.style.background = '#faf9f6';
                rsvpNama.style.color = 'inherit';
            }
            
            if (rsvpError) rsvpError.style.display = 'none';
            
            // Scroll ke form
            const rsvpSection = document.getElementById('rsvp');
            if (rsvpSection) {
                rsvpSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

})();
