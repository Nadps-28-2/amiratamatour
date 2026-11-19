/**
 * ============================================================================
 * AMIRATAMA TOUR AND ORGANIZER — JAVASCRIPT
 * Dynamic Sticky Navbar, Active Nav Highlighter, Hero Carousel, Lightbox & Mobile Menu
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  
  // --------------------------------------------------------------------------
  // 1. DYNAMIC STICKY NAVBAR (Transparent on top, Solid white on scroll)
  // --------------------------------------------------------------------------
  const header = document.getElementById("main-header");
  const logoBadge = document.getElementById("logo-badge");
  const brandTitle = document.getElementById("nav-brand-title");
  const brandSubtitle = document.getElementById("nav-brand-subtitle");
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const navContainer = document.getElementById("desktop-nav-container");

  function updateNavbar() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 60) {
      // Scrolled state: Solid White
      header.classList.remove("is-transparent", "bg-transparent", "py-5");
      header.classList.add("is-scrolled", "bg-white/95", "backdrop-blur-md", "shadow-nav", "border-b", "border-slate-100", "py-3.5");

      logoBadge.classList.remove("bg-white/10", "border-white/20");
      logoBadge.classList.add("bg-navy-50", "border-slate-200");

      brandTitle.classList.remove("text-white");
      brandTitle.classList.add("text-navy");

      brandSubtitle.classList.remove("text-slate-300");
      brandSubtitle.classList.add("text-slate-500");

      mobileBtn.classList.remove("text-white");
      mobileBtn.classList.add("text-navy");

      if (navContainer) {
        navContainer.classList.add("bg-slate-50/80", "border", "border-slate-200/60");
      }
    } else {
      // Top state: Pure Transparent over Dark Cinematic Hero
      header.classList.remove("is-scrolled", "bg-white/95", "backdrop-blur-md", "shadow-nav", "border-b", "border-slate-100", "py-3.5");
      header.classList.add("is-transparent", "bg-transparent", "py-5");

      logoBadge.classList.remove("bg-navy-50", "border-slate-200");
      logoBadge.classList.add("bg-white/10", "border-white/20");

      brandTitle.classList.remove("text-navy");
      brandTitle.classList.add("text-white");

      brandSubtitle.classList.remove("text-slate-500");
      brandSubtitle.classList.add("text-slate-300");

      mobileBtn.classList.remove("text-navy");
      mobileBtn.classList.add("text-white");

      if (navContainer) {
        navContainer.classList.remove("bg-slate-50/80", "border", "border-slate-200/60");
      }
    }
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();


  // --------------------------------------------------------------------------
  // 2. ACTIVE NAVIGATION HIGHLIGHTER (ScrollSpy)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  function setActiveNavLink() {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    let currentSectionId = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    // Fallback for page top
    if (scrollY < 120 && sections.length > 0) {
      currentSectionId = sections[0].getAttribute("id");
    }

    // Update Desktop Nav Links
    navLinks.forEach(link => {
      const targetId = link.getAttribute("href").replace("#", "");
      if (targetId === currentSectionId) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });

    // Update Mobile Nav Links
    mobileNavLinks.forEach(link => {
      const targetId = link.getAttribute("href").replace("#", "");
      if (targetId === currentSectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", setActiveNavLink, { passive: true });
  setActiveNavLink();


  // --------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const drawer = document.getElementById("mobile-drawer");
  const drawerPanel = document.getElementById("mobile-panel");
  const drawerBackdrop = document.getElementById("mobile-backdrop");
  const mobileCloseBtn = document.getElementById("mobile-close-btn");

  function openMobileMenu() {
    drawer.classList.remove("pointer-events-none", "opacity-0");
    drawer.classList.add("pointer-events-auto", "opacity-100");
    drawer.setAttribute("aria-hidden", "false");
    mobileBtn.setAttribute("aria-expanded", "true");
    drawerPanel.classList.remove("translate-x-full");
    drawerPanel.classList.add("translate-x-0");
    document.body.classList.add("overflow-hidden");
  }

  function closeMobileMenu() {
    drawerPanel.classList.remove("translate-x-0");
    drawerPanel.classList.add("translate-x-full");
    drawer.classList.remove("opacity-100");
    drawer.classList.add("opacity-0");
    drawer.setAttribute("aria-hidden", "true");
    mobileBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("overflow-hidden");
    setTimeout(() => {
      drawer.classList.remove("pointer-events-auto");
      drawer.classList.add("pointer-events-none");
    }, 300);
  }

  mobileBtn.addEventListener("click", openMobileMenu);
  mobileCloseBtn.addEventListener("click", closeMobileMenu);
  drawerBackdrop.addEventListener("click", closeMobileMenu);
  mobileNavLinks.forEach(link => link.addEventListener("click", closeMobileMenu));

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (drawer.getAttribute("aria-hidden") === "false") {
        closeMobileMenu();
      }
      if (!lightbox.classList.contains("hidden")) {
        closeLightbox();
      }
    }
  });


  // --------------------------------------------------------------------------
  // 4. HERO BACKGROUND CAROUSEL (Crossfade + Ken Burns + Progress Dots)
  // --------------------------------------------------------------------------
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  const captionElem = document.getElementById("carousel-caption");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");

  const slideCaptions = [
    "Armada Pariwisata Eksekutif Jawa Tengah & Nusantara",
    "Study Tour Kampus & Sekolah di Candi Prambanan",
    "Pesona Matahari Terbit Bromo & Wisata Domestik",
    "Corporate Gathering & Outbound Team Building"
  ];

  let currentSlide = 0;
  let carouselInterval = null;
  const slideDuration = 6000;

  function goToSlide(index) {
    if (index === currentSlide) return;

    // Reset previous slide
    const prevImg = slides[currentSlide].querySelector(".hero-img");
    slides[currentSlide].classList.remove("opacity-100");
    slides[currentSlide].classList.add("opacity-0");
    if (prevImg) {
      prevImg.classList.remove("kenburns-active");
      prevImg.classList.add("kenburns-reset");
    }

    // Activate new slide
    currentSlide = (index + slides.length) % slides.length;
    const nextImg = slides[currentSlide].querySelector(".hero-img");
    slides[currentSlide].classList.remove("opacity-0");
    slides[currentSlide].classList.add("opacity-100");
    if (nextImg) {
      nextImg.classList.remove("kenburns-reset");
      nextImg.classList.add("kenburns-active");
    }

    // Update Dots
    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.remove("w-2", "bg-white/40");
        dot.classList.add("w-8", "bg-orange");
        dot.setAttribute("aria-selected", "true");
      } else {
        dot.classList.remove("w-8", "bg-orange");
        dot.classList.add("w-2", "bg-white/40");
        dot.setAttribute("aria-selected", "false");
      }
    });

    // Update Caption
    if (captionElem && slideCaptions[currentSlide]) {
      captionElem.textContent = slideCaptions[currentSlide];
    }
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startCarousel() {
    stopCarousel();
    carouselInterval = setInterval(nextSlide, slideDuration);
  }

  function stopCarousel() {
    if (carouselInterval) clearInterval(carouselInterval);
  }

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const target = parseInt(dot.getAttribute("data-slide"), 10);
      goToSlide(target);
      startCarousel();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startCarousel();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startCarousel();
    });
  }

  startCarousel();


  // --------------------------------------------------------------------------
  // 5. PARALLAX EFFECT FOR SECOND CINEMATIC SECTION
  // --------------------------------------------------------------------------
  const parallaxBg = document.getElementById("parallax-bg");
  let isMobile = window.innerWidth < 768;

  window.addEventListener("resize", () => {
    isMobile = window.innerWidth < 768;
  });

  window.addEventListener("scroll", function () {
    if (isMobile) return;

    if (parallaxBg) {
      const rect = parallaxBg.parentElement.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (window.innerHeight - rect.top) * 0.14;
        parallaxBg.style.transform = `translateY(${offset}px)`;
      }
    }
  }, { passive: true });


  // --------------------------------------------------------------------------
  // 6. SCROLL REVEAL (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealItems = document.querySelectorAll(".reveal-item");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-revealed"));
  }


  // --------------------------------------------------------------------------
  // 7. ACCESSIBLE GALLERY LIGHTBOX
  // --------------------------------------------------------------------------
  const galleryData = [
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAj-3GDx2gedFl1YlgAS7K_l1LpHUEFYInxiExKq2aNpW4vQx3k5jJi0yV-KHjiPbxpWXlEDCdbt5parl5GqtTwO0e0ujagx3DlY1m7yiHqP6vASC7k-mGQ4aMk5FC0fS23MAlTGYostMN-cyKOM490ENPGWBT6Fkud8TDP-6ag4E3w3RUhJP536_DhizZdvpqPGsOGtdIl3h1u-q39TIXG6BmJegHKwP-wGpg9DKY",
      caption: "Study Tour Kampus: KKL & Edukasi Budaya Candi Prambanan"
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJlpC3Zps02cmTlRBtBtZAm51mh6UtXCDdVUjAnaR5ExRdRqx3xtWjRuHnKn5kQUxUnrYyv2kk42QpUE_-jxLFKqzvFXqOrksnsV0aFr0WWtFMUD3LddXPm8WhguAKuTrbFXBIaqtDOxwGtW8DUVS2sdgG1N2l-Fb4ConxYiVN8xGQlFn2gpuZaamqTORKyV3qBIFw0JXMy1yoYmTE2xPHMWrr6e-KaKXdocdER1w",
      caption: "Outbound & Leadership: Team Building di Alam Terbuka"
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIL1pbUjjQuj9GsxGA13twgqK2Hl62INVlrX_KPxWkiHnQN1vc74l9KdQj5Okq_Sukfg7uvXt4c3ES-FMcTUHKTmVZNpTXuUwZCVEEw1sIPneGksXbZ6Fo3VGnY9bb-H5CRGWfAkFxnO6NAKsdtUrx8kiZD_CbPsE6FEX2Keub77I-n5nWFWM4tkCOA-tBTRSVQDM_6jbB0fTdf-cQBhcslC07VdhaqePRYK9cBAc",
      caption: "Wisata Ziarah: Kunjungan Religi Masjid Bersejarah"
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC49P9wmnJux3wbIkhowz-vaVj159tKaIOkdRAKWZ7Ss9hVhsOpyXWi7hWD3tICoXMHw14tP0la-4unOgQGnkWpEtEK_c7tEFUZwQXLhW48e07MLrnaWxAL4_Ae7n7-rSjatb-NkqKkkBSz9GeYFK6QP87SCDKRqBITXbn29VjKwdJZsLDm0e2GV1gWpEZ3COSL6LTNsDV2jUjRJW9ooUFa2SQHf2Tog6vkoMUw-h8",
      caption: "Executive Gathering: Kebersamaan Rombongan Perusahaan di Panorama Pegunungan"
    }
  ];

  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const lightboxCloseBtn = document.getElementById("lightbox-close");
  const lightboxPrevBtn = document.getElementById("lightbox-prev");
  const lightboxNextBtn = document.getElementById("lightbox-next");

  let currentLightboxIndex = 0;

  window.openLightbox = function (index) {
    currentLightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.remove("hidden");
    setTimeout(() => {
      lightbox.classList.remove("opacity-0");
      lightbox.classList.add("opacity-100");
    }, 10);
    document.body.classList.add("overflow-hidden");
  };

  function updateLightboxContent() {
    const item = galleryData[currentLightboxIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.caption;
    lightboxCaption.textContent = item.caption;
    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${galleryData.length}`;
  }

  function closeLightbox() {
    lightbox.classList.remove("opacity-100");
    lightbox.classList.add("opacity-0");
    setTimeout(() => {
      lightbox.classList.add("hidden");
      lightboxImg.src = "";
      document.body.classList.remove("overflow-hidden");
    }, 300);
  }

  function nextLightbox() {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function prevLightbox() {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  lightboxCloseBtn.addEventListener("click", closeLightbox);
  lightboxNextBtn.addEventListener("click", nextLightbox);
  lightboxPrevBtn.addEventListener("click", prevLightbox);

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox || e.target.classList.contains("max-w-5xl")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("hidden")) {
      if (e.key === "ArrowRight") nextLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
    }
  });

});
