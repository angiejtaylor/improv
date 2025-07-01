let gamesData = [];

fetch('games.json')
  .then(response => response.json())
  .then(data => gamesData = data);

function getGames() {
  const playerCount = parseInt(document.getElementById('players').value);
  const gameList = document.getElementById('gameList');
  const rules = document.getElementById('rules');
  rules.style.display = 'none';
  gameList.innerHTML = '';

  const filteredGames = gamesData.filter(game =>
    playerCount >= game.minPlayers && playerCount <= game.maxPlayers
  );

  if (filteredGames.length === 0) {
    gameList.innerHTML = "<li>No games available for that player count.</li>";
    return;
  }

  filteredGames.forEach(game => {
    const li = document.createElement('li');
    li.textContent = game.name;
    li.style.cursor = 'pointer';
    li.onclick = () => showRules(game);
    gameList.appendChild(li);
  });
}

function showRules(game) {
  const rulesEl = document.getElementById('rules');
  document.getElementById('gameName').textContent = game.name;
  document.getElementById('gameRules').textContent = game.rules;
  rulesEl.style.display = 'block';

  // Smooth scroll to rules
  rulesEl.scrollIntoView({ behavior: 'smooth' });
}