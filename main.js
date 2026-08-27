/* ==========================================================================
   Chef Kangsu - Interactive JavaScript Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. STICKY NAVBAR & ACTIVE SCROLL SPY
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
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
  const revealElements = document.querySelectorAll('.card, .hero-content, .hero-stats, .level-flow, .pillars-card');
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
});
