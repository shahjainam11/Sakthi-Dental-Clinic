/* =====================================================
   js/main.js — Sakthi Dental Clinic
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR SCROLL EFFECT ── */
  const nav = document.getElementById('mainNav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 2. ACTIVE NAV LINK ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#mainNav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── 3. SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revealObserver.observe(el));
  }

  /* ── 4. FAQ ACCORDION ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── 5. TREATMENT EXPAND ── */
  document.querySelectorAll('.learn-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.treatment-card');
      const isExpanded = card.classList.contains('expanded');
      card.classList.toggle('expanded');
      btn.innerHTML = isExpanded
        ? 'Learn More <i class="bi bi-chevron-down"></i>'
        : 'Show Less <i class="bi bi-chevron-up"></i>';
    });
  });

  /* ── 6. TREATMENT SEARCH & FILTER ── */
  const treatmentSearch = document.getElementById('treatmentSearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const treatmentCards = document.querySelectorAll('.treatment-card-wrap');
  let activeFilter = 'all';

  function filterTreatments() {
    const query = treatmentSearch ? treatmentSearch.value.toLowerCase() : '';
    let visible = 0;
    treatmentCards.forEach(wrap => {
      const card = wrap.querySelector('.treatment-card');
      const title = card.dataset.title.toLowerCase();
      const cat = card.dataset.category;
      const matchFilter = activeFilter === 'all' || cat === activeFilter;
      const matchSearch = title.includes(query) || card.dataset.desc.toLowerCase().includes(query);
      const show = matchFilter && matchSearch;
      wrap.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    const noResults = document.getElementById('noResults');
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  if (treatmentSearch) treatmentSearch.addEventListener('input', filterTreatments);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-brand'));
      filterBtns.forEach(b => b.classList.add('btn-outline-secondary'));
      btn.classList.add('active', 'btn-brand');
      btn.classList.remove('btn-outline-secondary');
      activeFilter = btn.dataset.filter;
      filterTreatments();
    });
  });

  /* ── 7. FAQ SEARCH ── */
  const faqSearch = document.getElementById('faqSearch');
  if (faqSearch) {
    faqSearch.addEventListener('input', () => {
      const q = faqSearch.value.toLowerCase();
      document.querySelectorAll('.faq-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? '' : 'none';
      });
      document.querySelectorAll('.faq-category').forEach(section => {
        const visible = [...section.querySelectorAll('.faq-item')].some(i => i.style.display !== 'none');
        section.style.display = visible ? '' : 'none';
      });
    });
  }

  /* ── 8. TESTIMONIAL AUTO-SLIDE (Bootstrap Carousel control) ── */
  const testimonialCarousel = document.getElementById('testimonialCarousel');
  if (testimonialCarousel && window.bootstrap) {
    new bootstrap.Carousel(testimonialCarousel, { interval: 5000, ride: 'carousel' });
  }

  /* ── 9. CONTACT FORM VALIDATION ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      const fields = [
        { id: 'contactName',    regex: /^.{2,}$/,          errId: 'nameErr',    msg: 'Name is required' },
        { id: 'contactEmail',   regex: /^[^@]+@[^@]+\.[^@]+$/, errId: 'emailErr', msg: 'Valid email is required' },
        { id: 'contactPhone',   regex: /^[+]?[\d\s-]{7,15}$/, errId: 'phoneErr', msg: 'Valid phone number is required' },
        { id: 'contactMessage', regex: /^[\s\S]{10,}$/,    errId: 'messageErr', msg: 'Please enter at least 10 characters' },
      ];

      fields.forEach(({ id, regex, errId, msg }) => {
        const input = document.getElementById(id);
        const err   = document.getElementById(errId);
        if (!input || !err) return;
        const ok = regex.test(input.value);
        input.classList.toggle('is-invalid', !ok);
        err.textContent = msg;
        err.classList.toggle('show', !ok);
        if (!ok) valid = false;
      });

      if (valid) {
        document.getElementById('formCard').style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      }
    });

    // Clear errors on input
    ['contactName','contactEmail','contactPhone','contactMessage'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => {
        el.classList.remove('is-invalid');
        const err = document.getElementById(id.replace('contact', '').toLowerCase() + 'Err');
        if (err) err.classList.remove('show');
      });
    });

    document.getElementById('resetForm')?.addEventListener('click', () => {
      contactForm.reset();
      document.getElementById('formCard').style.display = 'block';
      document.getElementById('formSuccess').style.display = 'none';
    });
  }

  /* ── 10. PRIVACY POLICY TOC HIGHLIGHT ── */
  const tocLinks = document.querySelectorAll('.toc-item');
  if (tocLinks.length) {
    const ppSections = document.querySelectorAll('.pp-section');
    const tocObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.toc-item[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    ppSections.forEach(s => tocObserver.observe(s));
  }

  /* ── 11. STATS COUNTER ANIMATION ── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length) {
    const statObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(timer);
        }, 25);
        statObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => statObserver.observe(el));
  }

  /* ── 12. TREATMENT IMAGE CARD EXPAND ── */
  document.querySelectorAll('.img-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.treatment-img-card');
      const isExpanded = card.classList.contains('expanded');
      card.classList.toggle('expanded');
      btn.innerHTML = isExpanded
        ? 'Learn More <i class="bi bi-chevron-down"></i>'
        : 'Show Less <i class="bi bi-chevron-up"></i>';
    });
  });

  /* ── 13. TREATMENT IMAGE CARD SEARCH & FILTER (treatments page) ── */
  const treatmentSearch2 = document.getElementById('treatmentSearch');
  const filterBtns2 = document.querySelectorAll('.filter-btn');
  const imgCardWraps = document.querySelectorAll('.treatment-img-wrap-col');
  let activeFilter2 = 'all';

  function filterImgCards() {
    const query = treatmentSearch2 ? treatmentSearch2.value.toLowerCase() : '';
    let visible = 0;
    imgCardWraps.forEach(wrap => {
      const card = wrap.querySelector('.treatment-img-card');
      if (!card) return;
      const title = (card.dataset.title || '').toLowerCase();
      const cat   = card.dataset.category || '';
      const desc  = (card.dataset.desc || '').toLowerCase();
      const matchFilter = activeFilter2 === 'all' || cat === activeFilter2;
      const matchSearch = title.includes(query) || desc.includes(query);
      const show = matchFilter && matchSearch;
      wrap.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    const noResults = document.getElementById('noResults');
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  if (treatmentSearch2 && imgCardWraps.length) {
    treatmentSearch2.addEventListener('input', filterImgCards);
    filterBtns2.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns2.forEach(b => { b.classList.remove('active','btn-brand'); b.classList.add('btn-outline-brand'); });
        btn.classList.add('active','btn-brand');
        btn.classList.remove('btn-outline-brand');
        activeFilter2 = btn.dataset.filter;
        filterImgCards();
      });
    });
  }

  /* ── 14. GALLERY LIGHTBOX ── */
  const lightbox = document.getElementById('galleryLightbox');
  if (lightbox) {
    const lbImg     = document.getElementById('lbImg');
    const lbCaption = document.getElementById('lbCaption');
    const lbClose   = document.getElementById('lbClose');
    const lbPrev    = document.getElementById('lbPrev');
    const lbNext    = document.getElementById('lbNext');
    const galleryItems = [...document.querySelectorAll('.gallery-item[data-src]')];
    let currentIdx = 0;

    function openLightbox(idx) {
      currentIdx = idx;
      const item = galleryItems[idx];
      lbImg.src = item.dataset.src;
      lbCaption.textContent = item.dataset.caption || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      lbImg.src = '';
    }
    function showNext() { openLightbox((currentIdx + 1) % galleryItems.length); }
    function showPrev() { openLightbox((currentIdx - 1 + galleryItems.length) % galleryItems.length); }

    galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
    lbClose.addEventListener('click', closeLightbox);
    lbNext.addEventListener('click', showNext);
    lbPrev.addEventListener('click', showPrev);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }

  /* ── 15. SLIDER CUSTOM DOTS SYNC ── */
  const heroSlider = document.getElementById('heroSlider');
  if (heroSlider) {
    const dots = document.querySelectorAll('.slider-dot');
    heroSlider.addEventListener('slid.bs.carousel', e => {
      dots.forEach((d, i) => d.classList.toggle('active', i === e.to));
    });
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const carousel = bootstrap.Carousel.getOrCreateInstance(heroSlider);
        carousel.to(i);
      });
    });
  }

});
