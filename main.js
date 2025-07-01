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
  document.getElementById('gameRules').textContent = game.rules;
  rulesEl.style.display = 'block';
  rulesEl.scrollIntoView({ behavior: 'smooth' });
}

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