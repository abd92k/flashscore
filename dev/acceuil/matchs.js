// match.js - affichage simple + debug + fallback mock
// Remplace par ton endpoint réel (ex: "https://mon-api.com/matches")
const API_URL = "https://api.sportmonks.com/v3/core/types?api_token=0G0CMHk4MjKnO3mQmFDZIt5djJX9Ih0txQBPS9jEj9ETgJzhzIZiwjjnSFgo";

function renderMatches(list) {
  const container = document.getElementById("match-list");
  container.innerHTML = ""; // vide la zone
  if (!Array.isArray(list) || list.length === 0) {
    container.textContent = "Aucun match trouvé.";
    return;
  }
  list.forEach(m => {
    // essaie de lire plusieurs formes courantes de payload
    const home = m.homeTeam ?? m.home ?? m.home_name ?? m.home_team ?? "Home";
    const away = m.awayTeam ?? m.away ?? m.away_name ?? m.away_team ?? "Away";
    const date = m.date ?? m.matchDate ?? m.kickoff ?? m.time ?? "date inconnue";
    const scoreHome = (m.score && m.score.home) ?? m.homeScore ?? m.home_score ?? "";
    const scoreAway = (m.score && m.score.away) ?? m.awayScore ?? m.away_score ?? "";

    const div = document.createElement("div");
    div.className = "match";
    // présentation simple ; tu peux modifier le HTML ici
    div.innerHTML = `
      <div><strong>${home}</strong> vs <strong>${away}</strong></div>
      <div>${scoreHome !== "" || scoreAway !== "" ? scoreHome + " - " + scoreAway : date}</div>
    `;
    container.appendChild(div);
  });
}

function showError(msg, err) {
  const container = document.getElementById("match-list");
  container.textContent = msg;
  console.error(msg, err);
}

// Try fetch, with debug info and fallback to mock data
(function loadMatches() {
  const container = document.getElementById("match-list");
  if (!container) {
    console.error("Element #match-list introuvable dans la page.");
    return;
  }
  container.textContent = "Chargement des matchs...";

  // Check basic dev pitfalls and log them
  console.log("Tentative fetch ->", API_URL);
  fetch(API_URL, { method: "GET" })
    .then(response => {
      console.log("Réponse status:", response.status, response.statusText);
      if (!response.ok) {
        throw new Error("Réponse non OK: " + response.status + " " + response.statusText);
      }
      // parfois l'API renvoie texte ou autre -> on tente JSON
      return response.json();
    })
    .then(data => {
      console.log("Données reçues:", data);
      // Cas fréquent : l'API renvoie { matches: [...] }
      if (Array.isArray(data)) {
        renderMatches(data);
      } else if (Array.isArray(data.matches)) {
        renderMatches(data.matches);
      } else if (Array.isArray(data.data)) {
        renderMatches(data.data);
      } else {
        // si format inconnu, on affiche l'objet brut pour debug
        console.warn("Format inattendu — affichage brut pour debug");
        container.innerText = "Format de réponse inattendu (voir console).";
        console.log("Payload complet:", data);
      }
    })
    .catch(err => {
      // erreurs communes : CORS, network, 404, JSON parse error, mixed content
      console.error("Erreur fetch:", err);
      // message visible pour l'utilisateur + fallback mock
      showError("Impossible de charger l'API — utilisation d'un jeu de données local en secours.", err);

      // fallback: mock data pour que tu voies quelque chose
      const fallback = [
        { homeTeam: "PSG", awayTeam: "Marseille", date: "2025-11-30 20:00" },
        { homeTeam: "Real", awayTeam: "Barça", date: "2025-12-01 21:00" }
      ];
      console.log("Chargement du fallback mock:", fallback);
      // petit délai pour simuler le chargement
      setTimeout(() => renderMatches(fallback), 600);
    });
})();
