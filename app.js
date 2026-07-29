/* Visibilité IA — animations. Sans dépendance. 100 % dégradable :
   si le JS ne s'exécute pas, tout reste lisible et surligné. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Filet de sécurité : sans JS, la classe .no-js du <html> force l'état final en CSS.
  document.documentElement.classList.remove("no-js");

  if (reduce || !("IntersectionObserver" in window)) {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("in");
    });
    document.querySelectorAll("[data-lit]").forEach(function (el) {
      el.classList.add("is-lit");
    });
    return;
  }

  // 1) Apparition des blocs au scroll, avec décalage par groupe.
  var reveal = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        reveal.unobserve(e.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );
  document.querySelectorAll("[data-reveal]").forEach(function (el, i) {
    if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", i % 6);
    reveal.observe(el);
  });

  // 2) Surligneur : s'allume quand le bloc entre dans le champ, une seule fois.
  var lit = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-lit");
        lit.unobserve(e.target);
      });
    },
    { threshold: 0.35 }
  );
  document.querySelectorAll("[data-lit]").forEach(function (el) {
    lit.observe(el);
  });

  // 3) Séquence d'ouverture du hero, sans attendre le scroll.
  window.requestAnimationFrame(function () {
    document.querySelectorAll("[data-hero]").forEach(function (el) {
      el.classList.add("in");
    });
    window.setTimeout(function () {
      var a = document.querySelector("[data-lit].answer");
      if (a) a.classList.add("is-lit");
    }, 700);
  });

  // 4) Bandeau des sources : duplication du contenu pour un défilement sans couture.
  document.querySelectorAll(".ticker__row").forEach(function (row) {
    row.innerHTML = row.innerHTML + row.innerHTML;
  });
})();
