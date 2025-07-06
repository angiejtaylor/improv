
function pickWeightedRandomGameFullList(games) {
  const weightedList = [];
  games.forEach(game => {
    const range = game.maxPlayers - game.minPlayers + 1;
    const weight = Math.max(1, 21 - range); // narrow-range games = higher weight
    for (let i = 0; i < weight; i++) {
      weightedList.push(game);
    }
  });
  const randomIndex = Math.floor(Math.random() * weightedList.length);
  return weightedList[randomIndex];
}

function getRandomGame() {
  const gameList = document.getElementById('gameList');
  const rules = document.getElementById('rules');
  const dropdownButton = document.getElementById('dropdownButton');
  const dropdownOptions = document.getElementById('dropdownOptions');
  const playersInput = document.getElementById('players');

  gameList.innerHTML = '';
  rules.style.display = 'none';

  let playerCount = parseInt(playersInput.value);
  let randomGame;

  if (!playerCount) {
    // Pick any game, weighted toward narrow player range
    randomGame = pickWeightedRandomGameFullList(gamesData);

    // Pick a random valid player count for this game
    const randomPlayerCount = Math.floor(Math.random() * 
      (randomGame.maxPlayers - randomGame.minPlayers + 1)) + randomGame.minPlayers;

    playerCount = randomPlayerCount;
    playersInput.value = playerCount;
    dropdownButton.textContent = `${playerCount} ${playerCount === 1 ? 'player' : 'players'}`;
    dropdownOptions.classList.remove('show');
    dropdownButton.classList.remove('open');
  } else {
    // Filter and pick from valid games if player count is selected
    const filteredGames = gamesData.filter(game =>
      playerCount >= game.minPlayers && playerCount <= game.maxPlayers
    );

    if (filteredGames.length === 0) {
      gameList.innerHTML = "<li>No games available for that player count.</li>";
      return;
    }

    randomGame = pickWeightedRandomGameFullList(filteredGames);
  }

  showRules(randomGame);
}

let gamesData = [];

fetch('games.json')
  .then(response => response.json())
  .then(data => gamesData = data);

function getGames() {
  const playerCount = parseInt(document.getElementById('players').value);
  const gameList = document.getElementById('gameList');
  const rules = document.getElementById('rules');
  rules.style.display = 'none';
// Hide dropdown if open
document.getElementById('dropdownOptions').classList.remove('show');
document.getElementById('dropdownButton').classList.remove('open');
  gameList.innerHTML = '';

  if (!playerCount) {
    gameList.innerHTML = "<li>Please select number of players first!</li>";
    return;
  }

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

  const formattedRules = `
  <p>🎮 <strong>What You Need:</strong><br>${game.whatYouNeed}</p><br>
  <div><strong>🎲 How to Play:</strong>${game.howToPlay}</div><br>
  <p>😂 <strong>Tips for Fun:</strong><br>${game.tips || 'Just go with the flow, stay in character, and have fun!'}</p>
  `;

  document.getElementById('gameRules').innerHTML = formattedRules;
  rulesEl.style.display = 'block';
  rulesEl.scrollIntoView({ behavior: 'smooth' });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Populate dropdown options
  const dropdownOptions = document.getElementById('dropdownOptions');
  for (let i = 1; i <= 20; i++) {
    const option = document.createElement('li');
    option.textContent = i;
    option.dataset.value = i;
    option.classList.add('dropdown-option');
    dropdownOptions.appendChild(option);
  }

  // Toggle dropdown visibility
  const dropdownButton = document.getElementById('dropdownButton');
  dropdownButton.addEventListener('click', () => {
    dropdownOptions.classList.toggle('show');
    dropdownButton.classList.toggle('open');
  });

  // Handle selection
  dropdownOptions.addEventListener('click', (e) => {
    if (e.target.matches('.dropdown-option')) {
      const value = e.target.dataset.value;
      dropdownButton.textContent = value + (value === "1" ? " player" : " players");
      dropdownOptions.classList.remove('show');
      dropdownButton.classList.remove('open');

      // Set hidden input value
      document.getElementById('players').value = value;
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-dropdown')) {
      dropdownOptions.classList.remove('show');
      dropdownButton.classList.remove('open');
    }
  });

  // Add hidden input for compatibility
  const hiddenSelect = document.createElement('input');
  hiddenSelect.type = 'hidden';
  hiddenSelect.id = 'players';
  document.body.appendChild(hiddenSelect);
});