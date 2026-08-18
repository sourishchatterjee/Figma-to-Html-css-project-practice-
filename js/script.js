'use strict';

/**
 * Utility helper to attach events
 */
const addEventOnElem = function (elem, type, callback) {
  if (!elem) return;
  if (elem.length && elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else if (elem.addEventListener) {
    elem.addEventListener(type, callback);
  }
};

/**
 * Theme Engine (Light Mode & Dark Mode)
 */
const themeToggler = document.querySelector("[data-theme-toggler]");
const htmlElem = document.documentElement;

// Get initial theme from localStorage or system setting
const getPreferredTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

const applyTheme = (theme) => {
  htmlElem.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (themeToggler) {
    themeToggler.setAttribute("aria-label", `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`);
    const themeText = themeToggler.querySelector(".theme-toggle-text");
    if (themeText) {
      themeText.textContent = theme === "dark" ? "Dark Mode" : "Light Mode";
    }
  }
};

// Initialize theme on page load
applyTheme(getPreferredTheme());

if (themeToggler) {
  themeToggler.addEventListener("click", () => {
    const currentTheme = htmlElem.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });
}

/**
 * Mobile Navbar Toggle
 */
const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelector("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");

if (navToggler && navbar) {
  const toggleNavbar = () => navbar.classList.toggle("active");
  addEventOnElem(navToggler, "click", toggleNavbar);

  const closeNavbar = () => navbar.classList.remove("active");
  addEventOnElem(navLinks, "click", closeNavbar);
}

/**
 * Hero Typing Effect
 */
const fullText = "Crown & Clippers";
const typingTextElement = document.getElementById("typing-text");

if (typingTextElement) {
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    if (!isDeleting) {
      typingTextElement.textContent = fullText.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === fullText.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2500); // Pause at full text
        return;
      }
    } else {
      typingTextElement.textContent = fullText.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
      }
    }
    const speed = isDeleting ? 75 : 150;
    setTimeout(typeEffect, speed);
  }

  typeEffect();
}

/**
 * Header & Back-to-Top scroll behavior
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const handleScroll = function () {
  if (window.scrollY > 100) {
    if (header) header.classList.add("active");
    if (backTopBtn) backTopBtn.classList.add("active");
  } else {
    if (header) header.classList.remove("active");
    if (backTopBtn) backTopBtn.classList.remove("active");
  }
};

addEventOnElem(window, "scroll", handleScroll);

/**
 * Pricing Filter Tabs & Booking Auto-Selection
 */
const filterBtns = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter]");

if (filterBtns.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      filterBtns.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      this.classList.add("active");
      this.setAttribute("aria-selected", "true");

      const selectedFilter = this.getAttribute("data-filter-btn");

      filterItems.forEach(item => {
        const itemCategories = (item.getAttribute("data-filter") || "").split(",").map(c => c.trim());
        const isMatch = selectedFilter === "all" || itemCategories.includes(selectedFilter);

        if (isMatch) {
          item.style.display = "block";
          item.classList.remove("animate-in");
          void item.offsetWidth; // Trigger reflow for keyframe restart
          item.classList.add("animate-in");
        } else {
          item.style.display = "none";
          item.classList.remove("animate-in");
        }
      });
    });
  });
}

/**
 * Pricing Card "Book Now" Auto-Select Service
 */
const bookCardBtns = document.querySelectorAll("[data-book-service]");
const appointmentSelect = document.getElementById("appointment-service-select");

if (bookCardBtns.length > 0 && appointmentSelect) {
  bookCardBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const serviceName = this.getAttribute("data-book-service");
      if (serviceName) {
        for (let i = 0; i < appointmentSelect.options.length; i++) {
          if (appointmentSelect.options[i].value === serviceName) {
            appointmentSelect.selectedIndex = i;
            break;
          }
        }
      }
    });
  });
}

/**
 * Testimonial Slider
 */
const slides = document.querySelectorAll(".testimonial-slide");
const nextBtn = document.getElementById("testimonial-next");
const prevBtn = document.getElementById("testimonial-prev");

if (slides.length > 0) {
  let currentSlide = 0;
  const totalSlides = slides.length;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.style.display = "block";
        slide.classList.add("active");
      } else {
        slide.style.display = "none";
        slide.classList.remove("active");
      }
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
  }

  showSlide(currentSlide);

  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);

  // Auto slide every 5 seconds
  let sliderInterval = setInterval(nextSlide, 5000);

  // Pause on hover
  const testimonialContainer = document.querySelector(".testimonial-card");
  if (testimonialContainer) {
    testimonialContainer.addEventListener("mouseenter", () => clearInterval(sliderInterval));
    testimonialContainer.addEventListener("mouseleave", () => {
      sliderInterval = setInterval(nextSlide, 5000);
    });
  }
}
