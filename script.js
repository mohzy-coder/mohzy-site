(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const reveals = Array.from(document.querySelectorAll("[data-reveal]"));
  const navbar = document.querySelector("[data-elevate]");
  const parallaxTarget = document.querySelector("[data-parallax]");

  // If reduced motion: show everything immediately and skip observers/scroll work.
  if (prefersReduced) {
    reveals.forEach(el => el.classList.add("in-view"));
    return;
  }

  // Auto-stagger: assign incremental delays inside any [data-stagger] container.
  document.querySelectorAll("[data-stagger]").forEach(group => {
    const items = Array.from(group.querySelectorAll("[data-reveal]"));
    items.forEach((el, i) => el.style.setProperty("--delay", `${i * 80}ms`));
  });

  // IntersectionObserver: toggles in-view for smooth entrances.
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target); // one-time reveal (premium/product-page feel)
        }
      }
    },
    {
      root: null,
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  reveals.forEach(el => io.observe(el));

  // Navbar elevation on scroll (transform-free, just class toggling).
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Ultra-light hero parallax (transform-only + rAF; disabled on small screens).
  let rafId = null;
  const parallaxEnabled = () => window.matchMedia("(min-width: 769px)").matches;

  const parallaxTick = () => {
    rafId = null;
    if (!parallaxTarget || !parallaxEnabled()) return;

    const y = Math.min(window.scrollY, 600);
    // subtle: 0..12px translate
    const offset = (y / 600) * 12;
    parallaxTarget.style.transform = `translate3d(0, ${offset}px, 0)`;
  };

  const onParallaxScroll = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(parallaxTick);
  };

  if (parallaxTarget) {
    window.addEventListener("scroll", onParallaxScroll, { passive: true });
    window.addEventListener("resize", onParallaxScroll, { passive: true });
    parallaxTick();
  }
})();
