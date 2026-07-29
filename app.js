const matches = [
  {
    id: 1,
    date: "2026-07-29",
    time: "19:05",
    venue: "Yankee Stadium",
    away: { name: "Boston Red Sox", code: "BOS", probability: 42, record: "58-48", pitcher: "Brayan Bello", odds: "2,28" },
    home: { name: "New York Yankees", code: "NYY", probability: 58, record: "61-44", pitcher: "Carlos Rodón", odds: "1,70" },
    confidence: "moyenne",
    predictedScore: "4–6",
    marketProbability: "55 %",
    modelEdge: "+3 pts",
    bullpen: "Avantage Yankees",
    form: "NYY 7–3 / BOS 5–5",
    factors: [
      ["Consensus bookmakers", "55 % NYY"],
      ["Lanceur partant", "Avantage NYY"],
      ["Forme sur 10 matchs", "Avantage NYY"],
      ["Bullpen", "Léger avantage NYY"],
      ["Domicile", "Avantage NYY"]
    ],
    positives: ["Carlos Rodón affiche de meilleurs indicateurs récents.", "New York joue à domicile.", "Bullpen plus reposé sur les trois derniers jours."],
    negatives: ["Boston frappe bien les lanceurs gauchers.", "Écart de probabilité encore modéré."]
  },
  {
    id: 2,
    date: "2026-07-29",
    time: "22:10",
    venue: "Dodger Stadium",
    away: { name: "San Diego Padres", code: "SD", probability: 35, record: "55-50", pitcher: "Michael King", odds: "2,75" },
    home: { name: "Los Angeles Dodgers", code: "LAD", probability: 65, record: "67-39", pitcher: "Yoshinobu Yamamoto", odds: "1,48" },
    confidence: "forte",
    predictedScore: "3–5",
    marketProbability: "62 %",
    modelEdge: "+3 pts",
    bullpen: "Avantage Dodgers",
    form: "LAD 8–2 / SD 4–6",
    factors: [
      ["Consensus bookmakers", "62 % LAD"],
      ["Lanceur partant", "Avantage LAD"],
      ["Attaque saison", "Avantage LAD"],
      ["Forme récente", "Fort avantage LAD"],
      ["Stade", "Avantage LAD"]
    ],
    positives: ["Yamamoto domine sur ses cinq derniers départs.", "Los Angeles possède l’attaque la plus régulière.", "Très bonne dynamique à domicile."],
    negatives: ["San Diego reste dangereux en fin de match.", "La cote est déjà fortement comprimée."]
  },
  {
    id: 3,
    date: "2026-07-30",
    time: "01:40",
    venue: "Wrigley Field",
    away: { name: "Milwaukee Brewers", code: "MIL", probability: 51, record: "60-45", pitcher: "Freddy Peralta", odds: "1,91" },
    home: { name: "Chicago Cubs", code: "CHC", probability: 49, record: "59-46", pitcher: "Shota Imanaga", odds: "1,96" },
    confidence: "faible",
    predictedScore: "4–4",
    marketProbability: "50 %",
    modelEdge: "+1 pt",
    bullpen: "Équilibré",
    form: "MIL 6–4 / CHC 6–4",
    factors: [
      ["Consensus bookmakers", "50 / 50"],
      ["Lanceur partant", "Très léger avantage MIL"],
      ["Forme récente", "Égalité"],
      ["Bullpen", "Équilibré"],
      ["Domicile", "Avantage CHC"]
    ],
    positives: ["Peralta offre un léger avantage au départ.", "Milwaukee voyage bien cette saison."],
    negatives: ["Match extrêmement équilibré.", "La moindre modification d’effectif peut inverser le pronostic."]
  },
  {
    id: 4,
    date: "2026-07-30",
    time: "20:10",
    venue: "Truist Park",
    away: { name: "New York Mets", code: "NYM", probability: 46, record: "57-49", pitcher: "Kodai Senga", odds: "2,05" },
    home: { name: "Atlanta Braves", code: "ATL", probability: 54, record: "62-43", pitcher: "Chris Sale", odds: "1,82" },
    confidence: "moyenne",
    predictedScore: "3–4",
    marketProbability: "53 %",
    modelEdge: "+1 pt",
    bullpen: "Avantage Braves",
    form: "ATL 7–3 / NYM 5–5",
    factors: [
      ["Consensus bookmakers", "53 % ATL"],
      ["Lanceur partant", "Avantage ATL"],
      ["Attaque récente", "Avantage ATL"],
      ["Bullpen", "Avantage ATL"],
      ["Historique direct", "Équilibré"]
    ],
    positives: ["Chris Sale reste très fiable.", "Atlanta dispose d’un bullpen plus profond.", "Meilleure forme récente."],
    negatives: ["Senga peut limiter fortement l’attaque adverse.", "Faible marge par rapport au marché."]
  }
];

const grid = document.querySelector("#matchesGrid");
const dateFilter = document.querySelector("#dateFilter");
const confidenceFilter = document.querySelector("#confidenceFilter");
const heroCount = document.querySelector("#heroCount");
const dialog = document.querySelector("#analysisDialog");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogContent = document.querySelector("#dialogContent");
const closeDialog = document.querySelector("#closeDialog");
const themeToggle = document.querySelector("#themeToggle");
const toast = document.querySelector("#toast");

function formatDate(dateString) {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${dateString}T12:00:00`));
}

function populateDateFilter() {
  [...new Set(matches.map(match => match.date))].forEach(date => {
    const option = document.createElement("option");
    option.value = date;
    option.textContent = formatDate(date);
    dateFilter.append(option);
  });
}

function matchCard(match) {
  const favorite = match.home.probability >= match.away.probability ? match.home.code : match.away.code;
  return `
    <article class="match-card">
      <div class="match-card-header">
        <div>
          <p class="eyebrow">${formatDate(match.date)}</p>
          <div class="match-time">${match.time} • ${match.venue}</div>
        </div>
        <span class="confidence ${match.confidence}">${match.confidence}</span>
      </div>
      <div class="teams">
        ${teamRow(match.away, favorite)}
        ${teamRow(match.home, favorite)}
      </div>
      <div class="probability-bars" aria-label="Répartition des probabilités">
        <span style="width:${match.away.probability}%"></span>
        <span style="width:${match.home.probability}%"></span>
      </div>
      <div class="quick-stats">
        <div><span>Score probable</span><strong>${match.predictedScore}</strong></div>
        <div><span>Marché</span><strong>${match.marketProbability}</strong></div>
        <div><span>Écart modèle</span><strong>${match.modelEdge}</strong></div>
      </div>
      <div class="card-actions">
        <button class="primary-button" type="button" data-analysis="${match.id}">Voir l’analyse</button>
        <button class="secondary-button" type="button" data-save="${match.id}" aria-label="Ajouter aux favoris">☆</button>
      </div>
    </article>`;
}

function teamRow(team, favorite) {
  return `
    <div class="team-row">
      <div class="team-name">
        <div class="team-badge">${team.code}</div>
        <div class="team-copy"><strong>${team.name}</strong><small>${team.record} • ${team.pitcher}</small></div>
      </div>
      <div class="probability ${team.code === favorite ? "favorite" : ""}">${team.probability} %</div>
    </div>`;
}

function renderMatches() {
  const date = dateFilter.value;
  const confidence = confidenceFilter.value;
  const filtered = matches.filter(match => (date === "all" || match.date === date) && (confidence === "all" || match.confidence === confidence));
  heroCount.textContent = filtered.length;
  grid.innerHTML = filtered.length ? filtered.map(matchCard).join("") : `<div class="empty-state">Aucun match ne correspond aux filtres sélectionnés.</div>`;
}

function showAnalysis(match) {
  const favorite = match.home.probability >= match.away.probability ? match.home : match.away;
  dialogTitle.textContent = `${match.away.code} – ${match.home.code}`;
  dialogContent.innerHTML = `
    <div class="analysis-summary">
      <div class="analysis-side"><span>${match.away.name}</span><strong>${match.away.probability} %</strong><small>Cote démo : ${match.away.odds}</small></div>
      <div class="analysis-side"><span>${match.home.name}</span><strong>${match.home.probability} %</strong><small>Cote démo : ${match.home.odds}</small></div>
    </div>
    <div class="analysis-grid">
      <section class="analysis-block">
        <h3>Conclusion du modèle</h3>
        <p><strong>${favorite.name}</strong> est favori avec ${favorite.probability} % de probabilité estimée.</p>
        <div class="factor-list">
          <div class="factor"><span>Score probable</span><strong>${match.predictedScore}</strong></div>
          <div class="factor"><span>Niveau de confiance</span><strong>${match.confidence}</strong></div>
          <div class="factor"><span>Forme récente</span><strong>${match.form}</strong></div>
          <div class="factor"><span>Bullpen</span><strong>${match.bullpen}</strong></div>
        </div>
      </section>
      <section class="analysis-block">
        <h3>Facteurs pondérés</h3>
        <div class="factor-list">
          ${match.factors.map(([label, value]) => `<div class="factor"><span>${label}</span><strong>${value}</strong></div>`).join("")}
        </div>
      </section>
      <section class="analysis-block">
        <h3>Arguments favorables</h3>
        <ul>${match.positives.map(item => `<li>${item}</li>`).join("")}</ul>
      </section>
      <section class="analysis-block">
        <h3>Points de vigilance</h3>
        <ul>${match.negatives.map(item => `<li>${item}</li>`).join("")}</ul>
      </section>
    </div>`;
  dialog.showModal();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 1800);
}

document.addEventListener("click", event => {
  const analysisButton = event.target.closest("[data-analysis]");
  if (analysisButton) showAnalysis(matches.find(match => match.id === Number(analysisButton.dataset.analysis)));

  const saveButton = event.target.closest("[data-save]");
  if (saveButton) {
    saveButton.textContent = saveButton.textContent === "☆" ? "★" : "☆";
    showToast(saveButton.textContent === "★" ? "Match ajouté aux favoris" : "Match retiré des favoris");
  }

  const navButton = event.target.closest(".nav-item");
  if (navButton) {
    document.querySelectorAll(".nav-item").forEach(button => button.classList.remove("active"));
    navButton.classList.add("active");
    if (navButton.dataset.view !== "matches") showToast("Cette section sera activée dans une prochaine version");
  }
});

dateFilter.addEventListener("change", renderMatches);
confidenceFilter.addEventListener("change", renderMatches);
closeDialog.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("light");
  themeToggle.textContent = document.documentElement.classList.contains("light") ? "☀" : "☾";
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(() => {}));
}

populateDateFilter();
renderMatches();
