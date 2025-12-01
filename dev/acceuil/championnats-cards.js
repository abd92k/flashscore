// championnats-cards.js
// Quand on clique sur une card, on redirige vers championnat.html avec un paramètre

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".champ-card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const key = card.dataset.key; // ex: "premier_league", "la_liga", etc.

      // On envoie la clé dans l'URL, on lira ça dans championnat.html
      const url = `championnats.html?champ=${encodeURIComponent(key)}`;
      window.location.href = url;
    });
  });
});