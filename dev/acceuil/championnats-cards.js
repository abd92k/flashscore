

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".champ-card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const key = card.dataset.key; 


      const url = `championnats.html?champ=${encodeURIComponent(key)}`;
      window.location.href = url;
    });
  });
});