fetch("matchs.json")
  .then(r => r.json())
  .then(dataFull => {
      const container = document.querySelector("#sportmonks-match");
      container.innerHTML = "";

      const statsDiv = document.createElement("div");
      statsDiv.id = "match-stats";
      container.appendChild(statsDiv);

      const topLeaguesKeywords = [
        "Premier League",
        "La Liga",
        "Bundesliga",
        "Serie A",
        "Ligue 1",
        "Champions League",
        "Europa League",
        "Conference League"
      ];

      // Déterminer le statut du match de façon fiable
      function getMatchStatus(match) {
          // Match terminé : soit state_id=3, status=FT, ou scores présents
          if(match.state_id === 3 || match.status === "FT" || (match.scores && match.scores.length > 0)) return "finished";

          // Match en cours : state_id=2 ou status LIVE/HT/1H/2H
          if(match.state_id === 2 || ["LIVE","HT","1H","2H","2HT"].includes(match.status)) return "live";

          // Match à venir
          return "upcoming";
      }

      const filteredLeagues = dataFull.filter(league => 
          topLeaguesKeywords.some(keyword => league.name.includes(keyword))
      );

      filteredLeagues.forEach(league => {
          const leagueDiv = document.createElement("div");
          leagueDiv.classList.add("league");
          leagueDiv.innerHTML = `<h2>${league.name}</h2>`;
          container.appendChild(leagueDiv);

          const matches = Array.isArray(league.today) ? league.today : [];

          // --- Matches à venir ou live ---
          const upcomingOrLive = matches.filter(match => {
              const status = getMatchStatus(match);
              return status === "upcoming" || status === "live";
          });

          if(upcomingOrLive.length > 0){
              upcomingOrLive.forEach(match => {
                  const status = getMatchStatus(match);
                  const time = status === "live" ? "LIVE" :
                               match.starting_at ? new Date(match.starting_at).toLocaleString() : "heure inconnue";

                  const home = match.participants.find(p => p.meta.location === "home");
                  const away = match.participants.find(p => p.meta.location === "away");

                  const localName = home?.name || "Home";
                  const awayName = away?.name || "Away";

                  const matchCard = document.createElement("div");
                  matchCard.classList.add("match-card");
                  if(status === "live") matchCard.classList.add("live-match");
                  matchCard.setAttribute("data-match-id", match.id);
                  matchCard.innerHTML = `
                      <div class="match-info">
                          <span class="match-name">${localName} vs ${awayName}</span>
                          <span class="match-time">${time}</span>
                      </div>
                  `;
                  leagueDiv.appendChild(matchCard);
              });
          } else {
              const noMatch = document.createElement("div");
              noMatch.textContent = "Aucun match à venir ou en cours";
              leagueDiv.appendChild(noMatch);
          }
      });

      // --- Section Matchs passés ---
      const pastDiv = document.createElement("div");
      pastDiv.id = "past-matches";
      pastDiv.innerHTML = `<h2>Derniers matchs passés</h2>`;
      container.appendChild(pastDiv);

      filteredLeagues.forEach(league => {
          const pastLeagueDiv = document.createElement("div");
          pastLeagueDiv.classList.add("league");
          pastLeagueDiv.innerHTML = `<h3>${league.name}</h3>`;
          pastDiv.appendChild(pastLeagueDiv);

          const pastMatches = (Array.isArray(league.today) ? league.today : [])
              .filter(match => getMatchStatus(match) === "finished")
              .sort((a,b) => new Date(b.starting_at) - new Date(a.starting_at))
              .slice(0,5);

          if(pastMatches.length > 0){
              pastMatches.forEach(match => {
                  const time = match.starting_at ? new Date(match.starting_at).toLocaleString() : "heure inconnue";
                  const home = match.participants.find(p => p.meta.location === "home");
                  const away = match.participants.find(p => p.meta.location === "away");

                  const localName = home?.name || "Home";
                  const awayName = away?.name || "Away";

                  const localScore = match.scores?.find(s => s.participant_id === home?.id)?.score ?? "-";
                  const awayScore = match.scores?.find(s => s.participant_id === away?.id)?.score ?? "-";

                  const matchDiv = document.createElement("div");
                  matchDiv.classList.add("match-card", "past-match");
                  matchDiv.setAttribute("data-match-id", match.id);
                  matchDiv.innerHTML = `
                      <div class="match-info">
                          <span class="match-name">${localName} ${localScore} - ${awayScore} ${awayName}</span>
                          <span class="match-time">${time}</span>
                      </div>
                  `;
                  pastLeagueDiv.appendChild(matchDiv);
              });
          } else {
              const noPast = document.createElement("div");
              noPast.textContent = "Aucun match passé récent";
              pastLeagueDiv.appendChild(noPast);
          }
      });

      // --- Click listener pour afficher stats ---
      container.querySelectorAll(".match-card").forEach(card => {
          card.addEventListener("click", e => {
              const matchId = e.currentTarget.getAttribute("data-match-id");
              statsDiv.innerHTML = `<h3>Stats pour le match ${matchId}</h3>
                                    <p>Ici tu pourras mettre toutes les stats détaillées de ce match</p>`;
          });
      });

  })
  .catch(err => console.error(err));
