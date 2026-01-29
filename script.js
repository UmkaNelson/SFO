document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.main-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const tabs = document.querySelectorAll('.tab');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const accordionItems = document.querySelectorAll('.accordion-item');
  const form = document.getElementById('contact-form');
  const revealBlocks = document.querySelectorAll('.reveal');
  const sliderMain = document.querySelector('.hero-slider-main img');
  const sliderThumbs = document.querySelectorAll('.hero-slider-thumbs .thumb');
  let sliderTimer;

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
  
  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('aria-controls');
        if (!targetId) return;

        tabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach((panel) => panel.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const panel = document.getElementById(targetId);
        if (panel) {
          panel.classList.add('active');
        }
      });
    });
  }

  if (accordionItems.length) {
    accordionItems.forEach((item) => {
      const trigger = item.querySelector('.accordion-trigger');
      const panel = item.querySelector('.accordion-panel');
      if (!trigger || !panel) return;

      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!isOpen));
        panel.hidden = isOpen;
      });
    });
  }

  if (revealBlocks.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealBlocks.forEach((block) => observer.observe(block));
  } else {
    revealBlocks.forEach((block) => block.classList.add('visible'));
  }

  if (sliderMain && sliderThumbs.length) {
    let currentIndex = 0;

    const setSlide = (thumb) => {
      currentIndex = Array.from(sliderThumbs).indexOf(thumb);
      const src = thumb.getAttribute('data-src');
      const alt = thumb.getAttribute('data-alt') || sliderMain.alt;
      if (src) sliderMain.src = src;
      sliderMain.alt = alt;
      sliderThumbs.forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
      resetTimer();
    };

    const nextSlide = () => {
      const thumbsArr = Array.from(sliderThumbs);
      const next = thumbsArr[(currentIndex + 1) % thumbsArr.length];
      setSlide(next);
    };

    const resetTimer = () => {
      if (sliderTimer) clearInterval(sliderTimer);
      sliderTimer = setInterval(nextSlide, 4000);
    };

    sliderThumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => setSlide(thumb));
      if (thumb.classList.contains('active')) setSlide(thumb);
    });

    resetTimer();
  }

  if (form) {
    const status = form.querySelector('.form-status');
    const validators = {
      name: (value) => value.trim().length >= 2,
      email: (value) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value),
      phone: (value) => /^[+()\d\s-]{7,}$/.test(value),
      investorType: (value) => Boolean(value),
      message: (value) => value.trim().length >= 10,
    };

    const messages = {
      name: 'Введите имя (мин. 2 символа).',
      email: 'Введите корректный email.',
      phone: 'Введите телефон (7+ символов).',
      investorType: 'Выберите тип инвестора.',
      message: 'Сообщение не короче 10 символов.',
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      status.textContent = '';
      let isValid = true;

      Object.keys(validators).forEach((field) => {
        const input = form.elements[field];
        if (!input) return;
        const error = input.closest('.form-group')?.querySelector('.error');
        const valid = validators[field](input.value);
        if (!valid) {
          isValid = false;
          if (error) error.textContent = messages[field];
          input.setAttribute('aria-invalid', 'true');
        } else {
          if (error) error.textContent = '';
          input.removeAttribute('aria-invalid');
        }
      });

      if (isValid) {
        status.textContent = 'Данные готовы к отправке. Замените [domain] и адрес перед публикацией.';
        form.reset();
      }
    });
  }
});
