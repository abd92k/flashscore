document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#classement-container");
  const titleEl = document.querySelector("#champ-title");

  titleEl.textContent = "Classement Ligue 1";
  container.innerHTML = "Chargement du classement...";

  try {
    const res = await fetch("championnats.json");
    const json = await res.json();

    const ligue1Rows = json.filter(item => item.league?.id === 301);

    if (ligue1Rows.length === 0) {
      container.innerHTML = "<div class='empty'>Aucun classement trouvé pour la Ligue 1.</div>";
      return;
    }

    container.innerHTML = "";

    ligue1Rows.forEach(item => {
      const participant = item.participant;
      if (!participant) return;

      const line = document.createElement("div");
      line.className = "team-line";
      line.innerHTML = `
        <span class="pos">${item.position }</span>
        <img src="${participant.image_path }" alt="${participant.name}" class="team-logo">
        <span class="team-name">${participant.name}</span>
      `;

      line.addEventListener("click", () => {});

      container.appendChild(line);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<div class='empty'>Erreur : " + err.message + "</div>";
  }
});
