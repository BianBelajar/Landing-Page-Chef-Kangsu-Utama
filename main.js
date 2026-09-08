/* ==========================================================================
   Chef Kangsu - Interactive JavaScript Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. STICKY NAVBAR & ACTIVE SCROLL SPY
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const isHomePage = document.querySelector('.hero') !== null;
  const sections = isHomePage ? document.querySelectorAll('section[id]') : [];

  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (isHomePage && sections.length > 0) {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      if (current) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `index.html#${current}` || href === `#${current}`) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          } else if (current === 'home' && (href === 'index.html' || href === '#home')) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      }
    }
  });

  // 2. MOBILE HAMBURGER MENU TOGGLE
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = hamburger.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // 3. COURSE WISHLIST / BOOKMARK TOGGLE
  const wishlistButtons = document.querySelectorAll('.course-wishlist-btn');
  wishlistButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      if (btn.classList.contains('active')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
      } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
      }
    });
  });

  // 4. CATEGORY FILTER FOR COURSES
  const catCards = document.querySelectorAll('.cat-card');
  const courseCards = document.querySelectorAll('.card-course');

  let activeFilter = null;
  catCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedCat = card.getAttribute('data-cat');

      if (activeFilter === selectedCat) {
        // Reset to all
        activeFilter = null;
        courseCards.forEach(c => {
          c.style.display = 'block';
          c.style.animation = 'fadeIn 0.4s ease';
        });
      } else {
        activeFilter = selectedCat;
        courseCards.forEach(course => {
          const categories = course.getAttribute('data-category') || '';
          if (categories.includes(selectedCat)) {
            course.style.display = 'block';
            course.style.animation = 'fadeIn 0.4s ease';
          } else {
            course.style.display = 'none';
          }
        });

        // Scroll smoothly to courses section
        const kelasSec = document.getElementById('kelas');
        if (kelasSec) {
          kelasSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 4.1 CATEGORY MOBILE NUDGE/PEEK ANIMATION
  const categoryCardsContainer = document.querySelector('.category-cards');
  if (categoryCardsContainer) {
    let hasNudged = false;
    const nudgeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasNudged && window.innerWidth <= 768) {
          hasNudged = true;
          setTimeout(() => {
            categoryCardsContainer.scrollTo({ left: 100, behavior: 'smooth' });
            setTimeout(() => {
              categoryCardsContainer.scrollTo({ left: 0, behavior: 'smooth' });
            }, 600);
          }, 350);
          nudgeObserver.unobserve(categoryCardsContainer);
        }
      });
    }, { threshold: 0.25 });

    nudgeObserver.observe(categoryCardsContainer);
  }

  // 5. TESTIMONIAL SLIDER / CAROUSEL WITH TOUCH & AUTO-PLAY
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const testimonials = document.querySelectorAll('.card-testimonial');
  const sliderContainer = document.getElementById('testimonial-slider');

  let currentSlide = 0;
  const totalSlides = testimonials.length;
  let autoPlayTimer = null;

  function showSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });

    testimonials.forEach((card, idx) => {
      if (window.innerWidth <= 768) {
        card.style.display = (idx === currentSlide) ? 'block' : 'none';
      } else {
        card.style.display = 'block';
      }
    });
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      if (window.innerWidth <= 768) {
        showSlide(currentSlide + 1);
      }
    }, 5000);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      startAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      startAutoPlay();
    });

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index') || '0');
        showSlide(idx);
        startAutoPlay();
      });
    });

    window.addEventListener('resize', () => showSlide(currentSlide));

    // Touch Swipe support
    if (sliderContainer) {
      let touchStartX = 0;
      let touchEndX = 0;

      sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
      }, { passive: true });

      sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
          showSlide(currentSlide + 1); // Swipe left -> Next
        } else if (touchEndX - touchStartX > 50) {
          showSlide(currentSlide - 1); // Swipe right -> Prev
        }
        startAutoPlay();
      }, { passive: true });
    }

    startAutoPlay();
  }

  // 6. ENHANCED 3-STEP INTERACTIVE QUIZ MODAL
  const openQuizBtn = document.getElementById('open-quiz-btn');
  const quizModal = document.getElementById('quiz-modal');
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay');
  const quizBody = document.getElementById('quiz-body');
  const quizProgressBar = document.getElementById('quiz-progress-bar');

  const quizQuestions = [
    {
      step: 1,
      title: "Apa tujuan utama kamu belajar memasak?",
      options: [
        { label: "Ingin bisa masak sendiri dari nol untuk sehari-hari", value: "nol", icon: "fa-seedling" },
        { label: "Menyajikan variasi masakan sehat untuk keluarga", value: "keluarga", icon: "fa-utensils" },
        { label: "Membuka usaha kuliner / jualan dari rumah", value: "usaha", icon: "fa-store" }
      ]
    },
    {
      step: 2,
      title: "Berapa tingkat pengalaman memasakmu saat ini?",
      options: [
        { label: "Pemula total, belum terbiasa dengan bumbu & pisau", value: "pemula", icon: "fa-kitchen-set" },
        { label: "Sudah bisa masak menu dasar, ingin naik level", value: "menengah", icon: "fa-fire-burner" },
        { label: "Sudah mahir, ingin teknik pro & standarisasi rasa", value: "mahir", icon: "fa-award" }
      ]
    },
    {
      step: 3,
      title: "Jenis masakan apa yang paling ingin kamu kuasai?",
      options: [
        { label: "Masakan Nusantara & Aneka Sambal Juara", value: "nusantara", icon: "fa-bowl-rice" },
        { label: "Dessert Viral, Baking & Minuman Kekinian", value: "dessert", icon: "fa-cake-candles" },
        { label: "Camilan Gurih & Street Food Laris", value: "camilan", icon: "fa-burger" }
      ]
    }
  ];

  let currentQuizStep = 0;
  let userAnswers = {};

  function renderQuizStep(stepIndex) {
    if (!quizBody) return;

    if (stepIndex < quizQuestions.length) {
      const q = quizQuestions[stepIndex];
      const progressPercent = ((stepIndex + 1) / quizQuestions.length) * 100;
      if (quizProgressBar) quizProgressBar.style.width = `${progressPercent}%`;

      let optionsHTML = '';
      q.options.forEach(opt => {
        optionsHTML += `
          <button class="quiz-opt" data-value="${opt.value}">
            <span><i class="fa-solid ${opt.icon}" style="color: #F25A38; margin-right: 10px;"></i> ${opt.label}</span>
            <i class="fa-solid fa-chevron-right" style="font-size: 0.8rem; color: #94A3B8;"></i>
          </button>
        `;
      });

      quizBody.innerHTML = `
        <div class="quiz-step active">
          <div class="quiz-step-indicator">Langkah ${q.step} dari ${quizQuestions.length}</div>
          <h4>${q.title}</h4>
          <div class="quiz-options">
            ${optionsHTML}
          </div>
        </div>
      `;

      // Attach click listeners to options
      quizBody.querySelectorAll('.quiz-opt').forEach(button => {
        button.addEventListener('click', () => {
          userAnswers[`step_${q.step}`] = button.getAttribute('data-value');
          renderQuizStep(stepIndex + 1);
        });
      });
    } else {
      // Result Calculation & Display
      if (quizProgressBar) quizProgressBar.style.width = '100%';

      let recTitle = "Siomay Bandung Saus Kacang Juara";
      let recImg = "Asset/siomay.png";
      let recPrice = "Rp 79.000";
      let recTag = "Cocok untuk Jualan & Pemula";
      let recReason = "Cocok untuk pemula yang ingin belajar teknik mengolah adonan kenyal dan saus kacang gurih tahan lama.";

      if (userAnswers['step_3'] === 'dessert' || userAnswers['step_1'] === 'usaha') {
        recTitle = "Dessert Viral untuk Ide Jualan";
        recImg = "Asset/dubai.png";
        recPrice = "Rp 69.000";
        recTag = "Tanpa Oven & Modal Terjangkau";
        recReason = "Resep dessert praktis dengan teknik tanpa oven yang sangat diminati pasar dan berpeluang untung tinggi.";
      } else if (userAnswers['step_3'] === 'nusantara' || userAnswers['step_1'] === 'keluarga') {
        recTitle = "Masakan Nusantara untuk Keluarga";
        recImg = "Asset/nasi.png";
        recPrice = "Rp 89.000";
        recTag = "Menu Favorit Keluarga";
        recReason = "Kombinasi bumbu dasar nusantara yang wangi, otentik, dan mudah disajikan untuk hidangan harian.";
      }

      quizBody.innerHTML = `
        <div class="text-center" style="padding: 10px 0;">
          <div style="font-size: 2.8rem; color: #5B6B34; margin-bottom: 12px;">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <h4 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 6px;">Rekomendasi Terbaik Untukmu!</h4>
          <p style="color: #64748B; font-size: 0.88rem; margin-bottom: 16px;">${recReason}</p>
          
          <div class="quiz-recommendation-box">
            <img src="${recImg}" alt="${recTitle}" class="quiz-rec-img">
            <div class="quiz-rec-details">
              <span class="tag tag-yellow" style="margin-bottom: 6px; display: inline-block;">${recTag}</span>
              <div class="quiz-rec-title">${recTitle}</div>
              <div class="quiz-rec-price">${recPrice}</div>
            </div>
          </div>

          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <a href="#kelas" class="btn btn-primary btn-pill" id="quiz-cta-btn">Ambil Kelas Ini</a>
            <button class="btn btn-secondary-light btn-pill" id="quiz-restart-btn">Ulangi Kuis</button>
          </div>
        </div>
      `;

      const ctaBtn = document.getElementById('quiz-cta-btn');
      if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
          closeModal();
        });
      }

      const restartBtn = document.getElementById('quiz-restart-btn');
      if (restartBtn) {
        restartBtn.addEventListener('click', () => {
          currentQuizStep = 0;
          userAnswers = {};
          renderQuizStep(0);
        });
      }
    }
  }

  function openModal() {
    if (quizModal) {
      quizModal.classList.add('active');
      currentQuizStep = 0;
      userAnswers = {};
      renderQuizStep(0);
    }
  }

  function closeModal() {
    if (quizModal) quizModal.classList.remove('active');
  }

  if (openQuizBtn) openQuizBtn.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  // 7. SCROLL REVEAL ANIMATION (LIGHTWEIGHT OBSERVER)
  const revealElements = document.querySelectorAll('.card, .hero-content, .hero-stats, .level-flow, .pillars-card, .card-bundle, .card-promo-item, .card-catalog-item');
  revealElements.forEach(el => el.classList.add('reveal-item'));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // 8. BUNDLING & PROMO TAB SWITCHER (bundling.html)
  const tabPillButtons = document.querySelectorAll('.btn-tab-pill');
  const tabContents = document.querySelectorAll('.tab-content');

  tabPillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabPillButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // 9. KELAS CATALOG LIVE SEARCH & CATEGORY FILTER (kelas.html)
  const searchInput = document.getElementById('catalog-search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const categoryPills = document.querySelectorAll('.pill-category-btn');
  const catalogCards = document.querySelectorAll('.card-catalog-item');
  const resultsCount = document.getElementById('results-count');
  const noResultsBox = document.getElementById('no-results-box');
  const resetFilterBtn = document.getElementById('reset-filter-btn');

  if (catalogCards.length > 0) {
    let currentCategory = 'all';
    let currentSearchTerm = '';

    function filterCatalog() {
      let visibleCount = 0;
      catalogCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        const cardTitle = (card.getAttribute('data-title') || '').toLowerCase();

        const matchesCat = (currentCategory === 'all') || cardCategory.includes(currentCategory);
        const matchesSearch = !currentSearchTerm || cardTitle.includes(currentSearchTerm.toLowerCase());

        if (matchesCat && matchesSearch) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (resultsCount) {
        resultsCount.innerHTML = `Menampilkan <strong>${visibleCount}</strong> kelas`;
      }

      if (noResultsBox) {
        noResultsBox.style.display = (visibleCount === 0) ? 'block' : 'none';
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.trim();
        if (clearSearchBtn) {
          clearSearchBtn.style.display = currentSearchTerm ? 'block' : 'none';
        }
        filterCatalog();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          currentSearchTerm = '';
          clearSearchBtn.style.display = 'none';
          searchInput.focus();
          filterCatalog();
        }
      });
    }

    categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.getAttribute('data-filter') || 'all';
        filterCatalog();
      });
    });

    if (resetFilterBtn) {
      resetFilterBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        currentSearchTerm = '';
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        categoryPills.forEach(p => p.classList.remove('active'));
        const allPill = document.querySelector('.pill-category-btn[data-filter="all"]');
        if (allPill) allPill.classList.add('active');
        currentCategory = 'all';
        filterCatalog();
      });
    }
  }

  // 10. LIVE COUNTDOWN TIMER (kelas-detail.html)
  const timerHours = document.getElementById('timer-hours');
  const timerMinutes = document.getElementById('timer-minutes');
  const timerSeconds = document.getElementById('timer-seconds');

  if (timerHours && timerMinutes && timerSeconds) {
    let totalSeconds = (12 * 3600) + (59 * 60) + 10;

    function updateCountdown() {
      if (totalSeconds <= 0) {
        totalSeconds = 24 * 3600; // loop
      }
      totalSeconds--;

      const hrs = Math.floor(totalSeconds / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;

      timerHours.textContent = hrs < 10 ? '0' + hrs : hrs;
      timerMinutes.textContent = mins < 10 ? '0' + mins : mins;
      timerSeconds.textContent = secs < 10 ? '0' + secs : secs;
    }

    setInterval(updateCountdown, 1000);
  }

  // 11. TOAST NOTIFICATION (Tambah ke Keranjang & Wishlist)
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');
  const addCartButtons = document.querySelectorAll('.btn-add-cart, .btn-cart-icon');

  function showToast(msg) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = msg;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3200);
  }

  addCartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Kelas berhasil ditambahkan ke keranjang!');
    });
  });

  // 12. AUTHENTICATION PAGES (Login & Register Interactivity)
  const registerForm = document.getElementById('register-form');
  const registerError = document.getElementById('register-error');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const passwordToggles = document.querySelectorAll('.password-toggle, .password-toggle-btn');
  const googleRegisterBtns = document.querySelectorAll('.google-register-btn, .btn-google-auth');

  // Password Visibility Toggle
  passwordToggles.forEach(toggleBtn => {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const parentWrap = toggleBtn.closest('.input-wrapper-modern, .auth-input-wrap');
      const passwordInput = parentWrap ? parentWrap.querySelector('input[type="password"], input[type="text"]') : null;
      if (!passwordInput) return;

      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-eye', !isHidden);
        icon.classList.toggle('fa-eye-slash', isHidden);
      }
      toggleBtn.setAttribute('aria-label', isHidden ? 'Sembunyikan password' : 'Tampilkan password');
    });
  });

  // Password Strength Meter (Register Page)
  const registerPasswordInput = document.getElementById('register-password');
  const meterBarFill = document.getElementById('meter-bar-fill');
  const meterStrengthLabel = document.getElementById('meter-strength-label');
  const critLength = document.getElementById('crit-length');
  const critLetter = document.getElementById('crit-letter');

  if (registerPasswordInput && meterBarFill && meterStrengthLabel) {
    registerPasswordInput.addEventListener('input', () => {
      const val = registerPasswordInput.value;
      
      if (!val) {
        meterBarFill.className = 'meter-bar-fill';
        meterStrengthLabel.className = '';
        meterStrengthLabel.textContent = 'Belum diisi';
        if (critLength) critLength.classList.remove('valid');
        if (critLetter) critLetter.classList.remove('valid');
        return;
      }

      const hasMinLength = val.length >= 8;
      const hasLetterAndNumber = /[a-zA-Z]/.test(val) && /[0-9]/.test(val);
      const hasSpecial = /[^a-zA-Z0-9]/.test(val);

      if (critLength) critLength.classList.toggle('valid', hasMinLength);
      if (critLetter) critLetter.classList.toggle('valid', hasLetterAndNumber);

      let score = 0;
      if (val.length >= 6) score++;
      if (hasMinLength) score++;
      if (hasLetterAndNumber) score++;
      if (hasSpecial || val.length >= 12) score++;

      if (score <= 2) {
        meterBarFill.className = 'meter-bar-fill weak';
        meterStrengthLabel.className = 'weak';
        meterStrengthLabel.textContent = 'Lemah';
      } else if (score === 3) {
        meterBarFill.className = 'meter-bar-fill medium';
        meterStrengthLabel.className = 'medium';
        meterStrengthLabel.textContent = 'Cukup Kuat';
      } else {
        meterBarFill.className = 'meter-bar-fill strong';
        meterStrengthLabel.className = 'strong';
        meterStrengthLabel.textContent = 'Sangat Kuat & Aman';
      }
    });
  }

  // Google SSO Click Simulation
  googleRegisterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Integrasi Google SSO sedang dalam mode demo.');
    });
  });

  // Forgot password link click
  const forgotPassLink = document.getElementById('forgot-password-link');
  if (forgotPassLink) {
    forgotPassLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Tautan reset password telah disimulasikan ke email terdaftar.');
    });
  }

  // Register Form Submission
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('register-submit-btn') || registerForm.querySelector('button[type="submit"]');
      const formData = new FormData(registerForm);
      const name = String(formData.get('name') || '').trim();
      const phone = String(formData.get('phone') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const password = String(formData.get('password') || '');

      if (!name || !phone || !email || password.length < 8) {
        if (registerError) {
          registerError.textContent = 'Mohon lengkapi semua kolom dan gunakan password minimal 8 karakter.';
          registerError.style.display = 'block';
        }
        return;
      }

      if (registerError) {
        registerError.textContent = '';
        registerError.style.display = 'none';
      }

      // Button Loading state
      if (submitBtn) submitBtn.classList.add('is-loading');

      setTimeout(() => {
        if (submitBtn) submitBtn.classList.remove('is-loading');
        showToast(`Selamat bergabung, ${name}! Akunmu berhasil didaftarkan.`);
        registerForm.reset();
        if (meterBarFill) meterBarFill.className = 'meter-bar-fill';
        if (meterStrengthLabel) {
          meterStrengthLabel.className = '';
          meterStrengthLabel.textContent = 'Belum diisi';
        }
        if (critLength) critLength.classList.remove('valid');
        if (critLetter) critLetter.classList.remove('valid');
      }, 900);
    });
  }

  // Login Form Submission (Hardcoded: admin / admin123)
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('login-submit-btn') || loginForm.querySelector('button[type="submit"]');
      const formData = new FormData(loginForm);
      const email = String(formData.get('email') || '').trim().toLowerCase();
      const password = String(formData.get('password') || '');

      if (!email || !password) {
        if (loginError) {
          loginError.textContent = 'Mohon masukkan email atau username beserta password.';
          loginError.style.display = 'block';
        }
        return;
      }

      // Button Loading state
      if (submitBtn) submitBtn.classList.add('is-loading');
      if (loginError) {
        loginError.textContent = '';
        loginError.style.display = 'none';
      }

      setTimeout(() => {
        if (submitBtn) submitBtn.classList.remove('is-loading');

        // Validasi Hardcode Kredensial
        const isValidUser = (email === 'admin' || email === 'admin@chefkangsu.com');
        const isValidPass = (password === 'admin123');

        if (isValidUser && isValidPass) {
          // Simpan session simulasi
          localStorage.setItem('chef_auth_user', JSON.stringify({
            username: 'admin',
            name: 'Muhammad F.',
            initials: 'MF',
            role: 'admin',
            isLoggedIn: true,
            loginTime: new Date().toISOString()
          }));

          showToast('Login berhasil! Mengalihkan ke dashboard member...');
          loginForm.reset();

          // Redirect ke dashboard setelah 1 detik
          setTimeout(() => {
            window.location.href = 'user-dashboard.html';
          }, 900);
        } else {
          if (loginError) {
            loginError.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Akun atau password salah! <br><small>Gunakan Akun: <b>admin</b> &nbsp;|&nbsp; Password: <b>admin123</b></small>';
            loginError.style.display = 'block';
          }
        }
      }, 600);
    });
  }

  // 13. NAVBAR AUTH STATE SYNC (Landing Page & Catalogues)
  function syncNavbarAuthState() {
    const savedUserJson = localStorage.getItem('chef_auth_user');
    if (!savedUserJson) return;

    try {
      const user = JSON.parse(savedUserJson);
      if (!user || !user.isLoggedIn) return;

      const userName = user.name || 'Muhammad F.';
      const initials = user.initials || 'MF';

      // Desktop Navbar Action Replacement
      const navActions = document.querySelector('.nav-actions');
      if (navActions) {
        const loginBtn = navActions.querySelector('a[href="login.html"]');
        const signupBtn = navActions.querySelector('a[href="register.html"]');

        if (loginBtn) loginBtn.remove();
        if (signupBtn) signupBtn.remove();

        // Check if widget already exists
        if (!navActions.querySelector('.nav-user-dropdown-wrap')) {
          const userWidget = document.createElement('div');
          userWidget.className = 'nav-user-dropdown-wrap';
          userWidget.innerHTML = `
            <a href="user-dashboard.html" class="nav-auth-user-badge">
              <div class="nav-user-avatar-circle">${initials}</div>
              <span class="nav-user-name-text">${userName}</span>
              <i class="fa-solid fa-chevron-down nav-user-dropdown-arrow"></i>
            </a>
            <div class="nav-user-menu-box">
              <a href="user-dashboard.html" class="nav-menu-item-link"><i class="fa-solid fa-house"></i> Dashboard</a>
              <a href="user-kelas.html" class="nav-menu-item-link"><i class="fa-solid fa-book-open"></i> Kelas Saya</a>
              <a href="user-profile.html" class="nav-menu-item-link"><i class="fa-regular fa-user"></i> Profil Saya</a>
              <div class="nav-menu-divider"></div>
              <button type="button" class="nav-menu-item-link menu-logout btn-global-logout"><i class="fa-solid fa-arrow-right-from-bracket"></i> Keluar</button>
            </div>
          `;

          const hamburger = navActions.querySelector('.hamburger');
          if (hamburger) {
            navActions.insertBefore(userWidget, hamburger);
          } else {
            navActions.appendChild(userWidget);
          }

          userWidget.querySelector('.nav-auth-user-badge').addEventListener('click', (e) => {
            e.preventDefault();
            const menuBox = userWidget.querySelector('.nav-user-menu-box');
            if (menuBox) {
              menuBox.classList.toggle('is-open');
            }
          });

          document.addEventListener('click', (e) => {
            if (!userWidget.contains(e.target)) {
              const menuBox = userWidget.querySelector('.nav-user-menu-box');
              if (menuBox) menuBox.classList.remove('is-open');
            }
          });
        }
      }

      // Mobile Nav Actions Replacement
      const mobileNavActions = document.querySelector('.mobile-nav-actions');
      if (mobileNavActions) {
        mobileNavActions.innerHTML = `
          <a href="user-dashboard.html" class="btn btn-outline-dark btn-pill" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <div class="nav-user-avatar-circle" style="width: 24px; height: 24px; font-size: 0.68rem;">${initials}</div>
            <span>${userName}</span>
          </a>
          <button type="button" class="btn btn-primary btn-pill btn-global-logout">Keluar</button>
        `;
      }
    } catch (e) {
      console.error('Failed to parse auth user from localStorage', e);
    }
  }

  syncNavbarAuthState();

  // Global Logout Handler
  document.addEventListener('click', (e) => {
    const logoutBtn = e.target.closest('.btn-global-logout, #btn-user-logout, #btn-logout-all');
    if (logoutBtn) {
      e.preventDefault();
      localStorage.removeItem('chef_auth_user');
      showToast('Anda telah keluar dari akun.');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 600);
    }
  });

  // 14. USER MEMBER DASHBOARD INTERACTIONS
  
  // Mobile Sidebar Drawer Toggle
  const userMobileToggle = document.getElementById('user-mobile-toggle');
  const userSidebar = document.getElementById('user-sidebar');
  if (userMobileToggle && userSidebar) {
    userMobileToggle.addEventListener('click', () => {
      userSidebar.classList.toggle('mobile-open');
    });

    document.addEventListener('click', (e) => {
      if (!userSidebar.contains(e.target) && !userMobileToggle.contains(e.target)) {
        userSidebar.classList.remove('mobile-open');
      }
    });
  }

  // Copy Referral Link Buttons
  const copyRefBtns = document.querySelectorAll('.btn-copy-ref');
  copyRefBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const link = btn.getAttribute('data-link') || 'https://chefkangsu.com?ref=KANGSU-XL8MNQ';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(link).then(() => {
          showToast('Link referral berhasil disalin ke clipboard!');
        }).catch(() => {
          showToast('Link: ' + link);
        });
      } else {
        showToast('Link referral berhasil disalin!');
      }
    });
  });

  // Affiliate Tab Buttons
  const affTabBtns = document.querySelectorAll('.aff-tab-btn');
  affTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      affTabBtns.forEach(b => b.classList.remove('active'));
      tab.classList.add('active');
      showToast(`Filter: ${tab.textContent.trim()} dipilih.`);
    });
  });

  // Profile Form Submissions
  const profileDataForm = document.getElementById('form-profile-data');
  if (profileDataForm) {
    profileDataForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Perubahan data diri berhasil disimpan!');
    });
  }

  const profileBankForm = document.getElementById('form-profile-bank');
  if (profileBankForm) {
    profileBankForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Informasi rekening bank berhasil disimpan!');
    });
  }

  const changePassBtn = document.getElementById('btn-change-password');
  if (changePassBtn) {
    changePassBtn.addEventListener('click', () => {
      showToast('Tautan ubah password telah dikirim ke email/WhatsApp Anda.');
    });
  }

  // Payout Submit Simulation
  const submitPayoutBtn = document.getElementById('btn-submit-payout');
  if (submitPayoutBtn) {
    submitPayoutBtn.addEventListener('click', () => {
      showToast('Saldo komisi belum mencapai batas minimum pencairan Rp 100.000.');
    });
  }

  // 15. SMOOTH PAGE TRANSITION NAVIGATION
  const pageLinks = document.querySelectorAll('a[href]');
  pageLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:') &&
      !href.startsWith('https://wa.me') &&
      !href.startsWith('http') &&
      !link.getAttribute('target')
    ) {
      link.addEventListener('click', (e) => {
        const targetUrl = link.href;
        const currentUrl = window.location.href.split('#')[0];
        const destinationBase = targetUrl.split('#')[0];

        if (destinationBase !== currentUrl) {
          e.preventDefault();
          document.body.classList.add('page-fade-out');
          setTimeout(() => {
            window.location.href = targetUrl;
          }, 180);
        }
      });
    }
  });

  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      document.body.classList.remove('page-fade-out');
    }
  });
});

