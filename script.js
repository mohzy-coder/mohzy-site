(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll("[data-reveal]");
  const navbar = document.querySelector("[data-elevate]");
  const parallax = document.querySelector("[data-parallax]");

  if (prefersReduced) {
    reveals.forEach(el => el.classList.add("in-view"));
    return;
  }

  document.querySelectorAll("[data-stagger]").forEach(group => {
    group.querySelectorAll("[data-reveal]").forEach((el, i) => {
      el.style.setProperty("--delay", `${i * 80}ms`);
    });
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle("in-view", entry.isIntersecting);
    });
  }, {
    threshold: 0.18,
    rootMargin: "0px 0px -10% 0px"
  });

  reveals.forEach(el => io.observe(el));

  window.addEventListener("scroll", () => {
    navbar?.classList.toggle("is-scrolled", window.scrollY > 8);

    if (parallax && window.innerWidth > 768) {
      const y = Math.min(window.scrollY, 600);
      parallax.style.transform = `translateY(${(y / 600) * 12}px)`;
    }
  }, { passive: true });
})();
