const canvas = document.querySelector("#worldCanvas");
const ctx = canvas.getContext("2d");

const generationValue = document.querySelector("#generationValue");
const populationValue = document.querySelector("#populationValue");
const activityValue = document.querySelector("#activityValue");
const ruleDescription = document.querySelector("#ruleDescription");
const ruleMeta = document.querySelector("#ruleMeta");
const statusBadge = document.querySelector("#statusBadge");
const ruleBadge = document.querySelector("#ruleBadge");
const sizeBadge = document.querySelector("#sizeBadge");

const playButton = document.querySelector("#playButton");
const stepButton = document.querySelector("#stepButton");
const clearButton = document.querySelector("#clearButton");
const randomButton = document.querySelector("#randomButton");
const ruleSelect = document.querySelector("#ruleSelect");
const presetSelect = document.querySelector("#presetSelect");
const edgeSelect = document.querySelector("#edgeSelect");
const toolSelect = document.querySelector("#toolSelect");
const themeSelect = document.querySelector("#themeSelect");
const speedRange = document.querySelector("#speedRange");
const densityRange = document.querySelector("#densityRange");
const speedValue = document.querySelector("#speedValue");
const densityValue = document.querySelector("#densityValue");
const customRuleInput = document.querySelector("#customRuleInput");
const applyRuleButton = document.querySelector("#applyRuleButton");
const ruleFeedback = document.querySelector("#ruleFeedback");
const atlasSearchInput = document.querySelector("#atlasSearchInput");
const atlasSummary = document.querySelector("#atlasSummary");
const atlasList = document.querySelector("#atlasList");
const seedCodeInput = document.querySelector("#seedCodeInput");
const exportSeedButton = document.querySelector("#exportSeedButton");
const copySeedButton = document.querySelector("#copySeedButton");
const shareLinkButton = document.querySelector("#shareLinkButton");
const loadSeedButton = document.querySelector("#loadSeedButton");
const seedFeedback = document.querySelector("#seedFeedback");
const vaultNameInput = document.querySelector("#vaultNameInput");
const savePatternButton = document.querySelector("#savePatternButton");
const vaultList = document.querySelector("#vaultList");
const vaultFeedback = document.querySelector("#vaultFeedback");

function normalizeDigits(values) {
  return [...new Set(values)]
    .filter((value) => Number.isInteger(value) && value >= 0 && value <= 8)
    .sort((left, right) => left - right);
}

function createNotation(birth, survive) {
  return `B${birth.join("")}/S${survive.join("")}`;
}

function buildRuleProfile({ name, description, birth, survive, notation }) {
  const normalizedBirth = normalizeDigits(birth);
  const normalizedSurvive = normalizeDigits(survive);

  return {
    name,
    description,
    birth: normalizedBirth,
    survive: normalizedSurvive,
    notation: notation || createNotation(normalizedBirth, normalizedSurvive),
    birthSet: new Set(normalizedBirth),
    surviveSet: new Set(normalizedSurvive),
  };
}

const rules = {
  life: buildRuleProfile({
    name: "Conway Life",
    description: "Balanced growth with familiar Conway life rules.",
    birth: [3],
    survive: [2, 3],
  }),
  highlife: buildRuleProfile({
    name: "HighLife",
    description: "Adds a bonus birth at six neighbors, which creates replicators.",
    birth: [3, 6],
    survive: [2, 3],
  }),
  seeds: buildRuleProfile({
    name: "Seeds",
    description: "Nothing survives, but pairs of neighbors constantly spark new life.",
    birth: [2],
    survive: [],
  }),
  daynight: buildRuleProfile({
    name: "Day & Night",
    description: "Dense clusters can survive, leading to dramatic oscillating masses.",
    birth: [3, 6, 7, 8],
    survive: [3, 4, 6, 7, 8],
  }),
  custom: buildRuleProfile({
    name: "Custom Rule",
    description: "Custom rule slot for experimental growth patterns.",
    birth: [3],
    survive: [2, 3],
  }),
};

function createPresetProfile({ name, category, blurb, cells, tags = [] }) {
  const xs = cells.map(([x]) => x);
  const ys = cells.map(([, y]) => y);
  const width = cells.length > 0 ? Math.max(...xs) - Math.min(...xs) + 1 : 0;
  const height = cells.length > 0 ? Math.max(...ys) - Math.min(...ys) + 1 : 0;

  return {
    name,
    category,
    blurb,
    tags,
    cells,
    width,
    height,
  };
}

const presets = {
  blank: {
    name: "Choose a preset",
    cells: [],
  },
  glider: createPresetProfile({
    name: "Glider",
    category: "Spaceship",
    blurb: "The tiny diagonal traveler that makes Conway worlds feel alive.",
    tags: ["starter", "classic", "motion"],
    cells: [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ],
  }),
  lwss: createPresetProfile({
    name: "Lightweight Spaceship",
    category: "Spaceship",
    blurb: "A chunkier craft that cruises horizontally across the field.",
    tags: ["spaceship", "traveler"],
    cells: [
      [1, 0], [4, 0],
      [0, 1],
      [0, 2], [4, 2],
      [0, 3], [1, 3], [2, 3], [3, 3],
    ],
  }),
  pulsar: createPresetProfile({
    name: "Pulsar",
    category: "Oscillator",
    blurb: "A large rhythmic bloom that expands and contracts in a twelve-beat cycle.",
    tags: ["oscillator", "symmetric"],
    cells: [
      [2, 0], [3, 0], [4, 0], [8, 0], [9, 0], [10, 0],
      [0, 2], [5, 2], [7, 2], [12, 2],
      [0, 3], [5, 3], [7, 3], [12, 3],
      [0, 4], [5, 4], [7, 4], [12, 4],
      [2, 5], [3, 5], [4, 5], [8, 5], [9, 5], [10, 5],
      [2, 7], [3, 7], [4, 7], [8, 7], [9, 7], [10, 7],
      [0, 8], [5, 8], [7, 8], [12, 8],
      [0, 9], [5, 9], [7, 9], [12, 9],
      [0, 10], [5, 10], [7, 10], [12, 10],
      [2, 12], [3, 12], [4, 12], [8, 12], [9, 12], [10, 12],
    ],
  }),
  toad: createPresetProfile({
    name: "Toad",
    category: "Oscillator",
    blurb: "A compact period-two oscillator that is great for quick rule comparisons.",
    tags: ["oscillator", "small"],
    cells: [
      [1, 0], [2, 0], [3, 0],
      [0, 1], [1, 1], [2, 1],
    ],
  }),
  beacon: createPresetProfile({
    name: "Beacon",
    category: "Oscillator",
    blurb: "Two offset blocks blink toward each other and back again.",
    tags: ["oscillator", "block"],
    cells: [
      [0, 0], [1, 0],
      [0, 1], [1, 1],
      [2, 2], [3, 2],
      [2, 3], [3, 3],
    ],
  }),
  pentadecathlon: createPresetProfile({
    name: "Pentadecathlon",
    category: "Oscillator",
    blurb: "A long elegant oscillator that ripples through a fifteen-step loop.",
    tags: ["oscillator", "longform"],
    cells: [
      [1, 0],
      [1, 1],
      [0, 2], [2, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [1, 6],
      [0, 7], [2, 7],
      [1, 8],
      [1, 9],
    ],
  }),
  acorn: createPresetProfile({
    name: "Acorn",
    category: "Methuselah",
    blurb: "A deceptively small seed that erupts into a long, sprawling evolution.",
    tags: ["methuselah", "growth"],
    cells: [
      [1, 0],
      [3, 1],
      [0, 2], [1, 2], [4, 2], [5, 2], [6, 2],
    ],
  }),
  rpentomino: createPresetProfile({
    name: "R-pentomino",
    category: "Methuselah",
    blurb: "One of the most famous chaotic starters, dense with surprise for its size.",
    tags: ["methuselah", "chaos"],
    cells: [
      [1, 0], [2, 0],
      [0, 1], [1, 1],
      [1, 2],
    ],
  }),
  diehard: createPresetProfile({
    name: "Diehard",
    category: "Methuselah",
    blurb: "A pattern that seems simple, then takes a long dramatic path before extinction.",
    tags: ["methuselah", "vanishing"],
    cells: [
      [6, 0],
      [0, 1], [1, 1],
      [1, 2], [5, 2], [6, 2], [7, 2],
    ],
  }),
  gun: createPresetProfile({
    name: "Gosper Glider Gun",
    category: "Gun",
    blurb: "A classic machine that periodically emits gliders into open space.",
    tags: ["generator", "iconic"],
    cells: [
      [24, 0],
      [22, 1], [24, 1],
      [12, 2], [13, 2], [20, 2], [21, 2], [34, 2], [35, 2],
      [11, 3], [15, 3], [20, 3], [21, 3], [34, 3], [35, 3],
      [0, 4], [1, 4], [10, 4], [16, 4], [20, 4], [21, 4],
      [0, 5], [1, 5], [10, 5], [14, 5], [16, 5], [17, 5], [22, 5], [24, 5],
      [10, 6], [16, 6], [24, 6],
      [11, 7], [15, 7],
      [12, 8], [13, 8],
    ],
  }),
  gate: createPresetProfile({
    name: "Signal Gate",
    category: "Experimental",
    blurb: "A hand-built local motif for seeing how nonstandard rules chew through circuits.",
    tags: ["custom", "logic"],
    cells: [
      [0, 1], [1, 1], [2, 1], [3, 1],
      [4, 0], [4, 2],
      [6, 0], [6, 1], [6, 2],
      [8, 1], [9, 1], [10, 1], [11, 1],
      [2, 4], [3, 4], [4, 4],
      [7, 4], [8, 4], [9, 4],
    ],
  }),
};

const atlasPresetKeys = Object.keys(presets).filter((key) => key !== "blank");

const state = {
  running: false,
  generation: 0,
  population: 0,
  activity: 0,
  cellSize: 12,
  columns: 0,
  rows: 0,
  speed: Number(speedRange.value),
  density: Number(densityRange.value),
  tool: toolSelect.value,
  ruleKey: "life",
  edgeMode: edgeSelect.value,
  themeKey: themeSelect.value,
  atlasQuery: "",
  selectedPresetKey: "blank",
  activeRule: rules.life,
  frameAccumulator: 0,
  lastTime: 0,
  pointerDown: false,
  vaultItems: [],
  grid: new Uint8Array(),
  buffer: new Uint8Array(),
  heat: new Uint8Array(),
};

const VAULT_STORAGE_KEY = "signal-garden-vault-v1";
const SHARE_HASH_KEY = "sg";

function buildSelectOptions() {
  Object.entries(rules).forEach(([key, rule]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = rule.name;
    ruleSelect.append(option);
  });

  Object.entries(presets).forEach(([key, preset]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = preset.name;
    presetSelect.append(option);
  });

  refreshCustomRuleOptionLabel();
  renderAtlas();
}

function refreshCustomRuleOptionLabel() {
  const option = ruleSelect.querySelector('option[value="custom"]');

  if (!option) {
    return;
  }

  option.textContent = `Custom Rule (${rules.custom.notation})`;
}

function getCssVariable(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function getPalette() {
  return {
    cell: getCssVariable("--cell"),
    cellSecondary: getCssVariable("--cell-secondary"),
    trailRgb: getCssVariable("--trail-rgb"),
    gridLine: "rgba(255, 255, 255, 0.05)",
  };
}

function setRuleFeedback(message, stateName = "info") {
  ruleFeedback.textContent = message;
  ruleFeedback.dataset.state = stateName;
}

function setSeedFeedback(message, stateName = "info") {
  seedFeedback.textContent = message;
  seedFeedback.dataset.state = stateName;
}

function setVaultFeedback(message, stateName = "info") {
  vaultFeedback.textContent = message;
  vaultFeedback.dataset.state = stateName;
}

function setSelectedPreset(key) {
  state.selectedPresetKey = presets[key] ? key : "blank";
  presetSelect.value = state.selectedPresetKey;
  renderAtlas();
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function resizeWorld() {
  const frame = canvas.parentElement;
  const frameWidth = frame.clientWidth;
  const frameHeight = frame.clientHeight;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.floor(frameWidth * dpr);
  canvas.height = Math.floor(frameHeight * dpr);
  canvas.style.width = `${frameWidth}px`;
  canvas.style.height = `${frameHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const nextCellSize = frameWidth < 640 ? 14 : 12;
  const nextColumns = Math.max(24, Math.floor(frameWidth / nextCellSize));
  const nextRows = Math.max(18, Math.floor(frameHeight / nextCellSize));

  if (nextColumns !== state.columns || nextRows !== state.rows || nextCellSize !== state.cellSize) {
    state.cellSize = nextCellSize;
    rebuildGrid(nextColumns, nextRows);
  }

  sizeBadge.textContent = `${state.columns} x ${state.rows}`;
  draw();
}

function rebuildGrid(columns, rows) {
  const previousGrid = state.grid;
  const previousColumns = state.columns;
  const previousRows = state.rows;

  state.columns = columns;
  state.rows = rows;
  state.grid = new Uint8Array(columns * rows);
  state.buffer = new Uint8Array(columns * rows);
  state.heat = new Uint8Array(columns * rows);

  if (previousGrid.length > 0) {
    const offsetX = Math.floor((columns - previousColumns) / 2);
    const offsetY = Math.floor((rows - previousRows) / 2);

    for (let y = 0; y < previousRows; y += 1) {
      for (let x = 0; x < previousColumns; x += 1) {
        const sourceIndex = y * previousColumns + x;
        const targetX = x + offsetX;
        const targetY = y + offsetY;

        if (targetX < 0 || targetX >= columns || targetY < 0 || targetY >= rows) {
          continue;
        }

        const targetIndex = targetY * columns + targetX;
        state.grid[targetIndex] = previousGrid[sourceIndex];
        state.heat[targetIndex] = previousGrid[sourceIndex] ? 200 : 0;
      }
    }
  }

  recalculatePopulation();
}

function indexFor(x, y) {
  return y * state.columns + x;
}

function recalculatePopulation() {
  let population = 0;

  for (let i = 0; i < state.grid.length; i += 1) {
    population += state.grid[i];
  }

  state.population = population;
  state.activity = 0;
  updateStats();
}

function updateStats() {
  let activityLabel = "idle";

  if (state.activity > 0) {
    activityLabel = `${state.activity} flips`;
  } else if (state.population > 0 && state.generation > 0) {
    activityLabel = state.running ? "steady" : "resting";
  }

  generationValue.textContent = state.generation.toLocaleString();
  populationValue.textContent = state.population.toLocaleString();
  activityValue.textContent = activityLabel;
  ruleDescription.textContent = state.activeRule.description;
  ruleMeta.textContent = `Notation ${state.activeRule.notation} - ${
    state.edgeMode === "wrap" ? "Wraparound edges" : "Finite edges"
  }`;
  ruleBadge.textContent = `${state.activeRule.notation} - ${
    state.edgeMode === "wrap" ? "Wrap" : "Finite"
  }`;
  statusBadge.textContent = state.running ? "Running" : "Paused";
  playButton.textContent = state.running ? "Pause" : "Start";
}

function clearWorld() {
  state.grid.fill(0);
  state.buffer.fill(0);
  state.heat.fill(0);
  state.generation = 0;
  setSelectedPreset("blank");
  recalculatePopulation();
  draw();
}

function randomizeWorld() {
  const density = state.density / 100;
  let population = 0;

  for (let i = 0; i < state.grid.length; i += 1) {
    const alive = Math.random() < density ? 1 : 0;
    state.grid[i] = alive;
    state.heat[i] = alive ? 180 + Math.floor(Math.random() * 75) : 0;
    population += alive;
  }

  state.generation = 0;
  state.population = population;
  state.activity = population;
  setSelectedPreset("blank");
  updateStats();
  draw();
}

function placePreset(key) {
  const preset = presets[key];

  if (!preset || preset.cells.length === 0) {
    setSelectedPreset("blank");
    return;
  }

  const xs = preset.cells.map(([x]) => x);
  const ys = preset.cells.map(([, y]) => y);
  const width = Math.max(...xs) - Math.min(...xs) + 1;
  const height = Math.max(...ys) - Math.min(...ys) + 1;
  const offsetX = Math.floor((state.columns - width) / 2);
  const offsetY = Math.floor((state.rows - height) / 2);

  clearWorld();

  preset.cells.forEach(([x, y]) => {
    const targetX = x + offsetX;
    const targetY = y + offsetY;

    if (
      targetX < 0 ||
      targetX >= state.columns ||
      targetY < 0 ||
      targetY >= state.rows
    ) {
      return;
    }

    const index = indexFor(targetX, targetY);
    state.grid[index] = 1;
    state.heat[index] = 220;
  });

  setSelectedPreset(key);
  recalculatePopulation();
  draw();
}

function wrapCoordinate(value, size) {
  return (value + size) % size;
}

function countNeighbors(x, y) {
  let count = 0;

  for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
    for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
      if (offsetX === 0 && offsetY === 0) {
        continue;
      }

      let neighborX = x + offsetX;
      let neighborY = y + offsetY;

      if (state.edgeMode === "wrap") {
        neighborX = wrapCoordinate(neighborX, state.columns);
        neighborY = wrapCoordinate(neighborY, state.rows);
      } else if (
        neighborX < 0 ||
        neighborX >= state.columns ||
        neighborY < 0 ||
        neighborY >= state.rows
      ) {
        continue;
      }

      count += state.grid[indexFor(neighborX, neighborY)];
    }
  }

  return count;
}

function advanceSimulation() {
  const { birthSet, surviveSet } = state.activeRule;
  let nextPopulation = 0;
  let activity = 0;

  for (let y = 0; y < state.rows; y += 1) {
    for (let x = 0; x < state.columns; x += 1) {
      const index = indexFor(x, y);
      const alive = state.grid[index] === 1;
      const neighbors = countNeighbors(x, y);
      const nextAlive = alive ? surviveSet.has(neighbors) : birthSet.has(neighbors);

      state.buffer[index] = nextAlive ? 1 : 0;

      if (alive !== nextAlive) {
        activity += 1;
      }

      if (nextAlive) {
        nextPopulation += 1;
        state.heat[index] = Math.min(255, state.heat[index] + 32);
      } else {
        state.heat[index] = Math.max(0, state.heat[index] - 14);
      }
    }
  }

  const nextGrid = state.buffer;
  state.buffer = state.grid;
  state.grid = nextGrid;
  state.generation += 1;
  state.population = nextPopulation;
  state.activity = activity;
  updateStats();
}

function paintAt(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const cellX = Math.floor((clientX - rect.left) / state.cellSize);
  const cellY = Math.floor((clientY - rect.top) / state.cellSize);

  if (
    cellX < 0 ||
    cellX >= state.columns ||
    cellY < 0 ||
    cellY >= state.rows
  ) {
    return;
  }

  const index = indexFor(cellX, cellY);
  const nextValue = state.tool === "erase" ? 0 : 1;

  if (state.grid[index] === nextValue) {
    return;
  }

  state.grid[index] = nextValue;
  state.heat[index] = nextValue ? 255 : 0;
  state.population += nextValue === 1 ? 1 : -1;
  state.activity += 1;
  setSelectedPreset("blank");
  updateStats();
  draw();
}

function getAtlasMatches() {
  const query = state.atlasQuery.trim().toLowerCase();

  if (!query) {
    return atlasPresetKeys;
  }

  return atlasPresetKeys.filter((key) => {
    const preset = presets[key];
    const haystack = [
      preset.name,
      preset.category,
      preset.blurb,
      ...(preset.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

function renderAtlas() {
  if (!atlasList || !atlasSummary) {
    return;
  }

  atlasList.replaceChildren();
  const matches = getAtlasMatches();
  atlasSummary.textContent = `${matches.length} pattern${matches.length === 1 ? "" : "s"} ready to drop`;

  if (matches.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "atlas-empty";
    emptyState.textContent = "No atlas patterns match that search yet. Try terms like glider, oscillator, or gun.";
    atlasList.append(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();

  matches.forEach((key) => {
    const preset = presets[key];
    const card = document.createElement("article");
    card.className = "atlas-card";
    card.dataset.active = String(state.selectedPresetKey === key);

    const header = document.createElement("div");
    header.className = "atlas-card-header";

    const title = document.createElement("strong");
    title.className = "atlas-title";
    title.textContent = preset.name;

    const footprint = document.createElement("span");
    footprint.className = "atlas-footprint";
    footprint.textContent = `${preset.width} x ${preset.height}`;

    header.append(title, footprint);

    const description = document.createElement("p");
    description.className = "atlas-description";
    description.textContent = preset.blurb;

    const chipRow = document.createElement("div");
    chipRow.className = "atlas-chip-row";

    [preset.category, ...(preset.tags || []).slice(0, 2)].forEach((label) => {
      const chip = document.createElement("span");
      chip.className = "atlas-chip";
      chip.textContent = label;
      chipRow.append(chip);
    });

    const actionButton = document.createElement("button");
    actionButton.type = "button";
    actionButton.className = state.selectedPresetKey === key ? "primary-button" : "ghost-button";
    actionButton.dataset.presetKey = key;
    actionButton.textContent = state.selectedPresetKey === key ? "Loaded" : "Load to Field";

    card.append(header, description, chipRow, actionButton);
    fragment.append(card);
  });

  atlasList.append(fragment);
}

function draw() {
  const { cell, cellSecondary, trailRgb, gridLine } = getPalette();
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  for (let y = 0; y < state.rows; y += 1) {
    for (let x = 0; x < state.columns; x += 1) {
      const index = indexFor(x, y);
      const px = x * state.cellSize;
      const py = y * state.cellSize;

      if (state.heat[index] > 0) {
        const trailAlpha = state.heat[index] / 255;
        ctx.fillStyle = `rgba(${trailRgb}, ${Math.max(0.05, trailAlpha * 0.26).toFixed(3)})`;
        ctx.fillRect(px, py, state.cellSize, state.cellSize);
      }

      if (state.grid[index] === 1) {
        const gradient = ctx.createLinearGradient(px, py, px + state.cellSize, py + state.cellSize);
        gradient.addColorStop(0, cell);
        gradient.addColorStop(1, cellSecondary);
        ctx.fillStyle = gradient;
        ctx.fillRect(px + 1, py + 1, state.cellSize - 2, state.cellSize - 2);
      }
    }
  }

  ctx.strokeStyle = gridLine;
  ctx.lineWidth = 1;
  ctx.beginPath();

  for (let x = 0; x <= state.columns; x += 1) {
    const px = x * state.cellSize + 0.5;
    ctx.moveTo(px, 0);
    ctx.lineTo(px, state.rows * state.cellSize);
  }

  for (let y = 0; y <= state.rows; y += 1) {
    const py = y * state.cellSize + 0.5;
    ctx.moveTo(0, py);
    ctx.lineTo(state.columns * state.cellSize, py);
  }

  ctx.stroke();
}

function loop(timestamp) {
  if (!state.lastTime) {
    state.lastTime = timestamp;
  }

  const delta = (timestamp - state.lastTime) / 1000;
  state.lastTime = timestamp;

  if (state.running) {
    state.frameAccumulator += delta;
    const interval = 1 / state.speed;

    while (state.frameAccumulator >= interval) {
      advanceSimulation();
      state.frameAccumulator -= interval;
    }
  }

  draw();
  requestAnimationFrame(loop);
}

function toggleRunning() {
  state.running = !state.running;
  state.frameAccumulator = 0;
  updateStats();
}

function setTheme(themeName) {
  document.body.classList.remove("theme-ember", "theme-lagoon");
  state.themeKey = themeName;

  if (themeName === "ember") {
    document.body.classList.add("theme-ember");
  }

  if (themeName === "lagoon") {
    document.body.classList.add("theme-lagoon");
  }

  draw();
}

function parseRuleNotation(input) {
  const sanitized = input.toUpperCase().replace(/\s+/g, "");

  if (!sanitized) {
    throw new Error("Enter a rule notation before applying it.");
  }

  let birthText = "";
  let surviveText = "";

  if (/^B[0-8]*\/S[0-8]*$/.test(sanitized)) {
    [, birthText, surviveText] = sanitized.match(/^B([0-8]*)\/S([0-8]*)$/);
  } else if (/^S[0-8]*\/B[0-8]*$/.test(sanitized)) {
    [, surviveText, birthText] = sanitized.match(/^S([0-8]*)\/B([0-8]*)$/);
  } else if (/^[0-8]*\/[0-8]*$/.test(sanitized)) {
    [, surviveText, birthText] = sanitized.match(/^([0-8]*)\/([0-8]*)$/);
  } else {
    throw new Error("Use B/S notation like B3/S23 or shorthand like 23/3.");
  }

  const birth = normalizeDigits([...birthText].map(Number));
  const survive = normalizeDigits([...surviveText].map(Number));

  return {
    birth,
    survive,
    notation: createNotation(birth, survive),
  };
}

function describeCustomRule(notation) {
  return `Hand-tuned custom rule ${notation} for experimental growth patterns.`;
}

function findBuiltInRuleKeyByNotation(notation) {
  const builtInKeys = Object.keys(rules).filter((key) => key !== "custom");

  return builtInKeys.find((key) => rules[key].notation === notation) || null;
}

function applyRuleByKey(ruleKey, { syncInput = true } = {}) {
  const profile = rules[ruleKey];

  if (!profile) {
    return;
  }

  state.ruleKey = ruleKey;
  state.activeRule = profile;
  ruleSelect.value = ruleKey;

  if (syncInput) {
    customRuleInput.value = profile.notation;
  }

  updateStats();
}

function applyRuleNotation(notation, { announce = true, preferExisting = true } = {}) {
  const parsed = parseRuleNotation(notation);
  const existingKey = preferExisting ? findBuiltInRuleKeyByNotation(parsed.notation) : null;

  if (existingKey) {
    applyRuleByKey(existingKey);

    if (announce) {
      setRuleFeedback(`Rule set to ${rules[existingKey].name} (${parsed.notation}).`, "success");
    }

    return rules[existingKey];
  }

  rules.custom = buildRuleProfile({
    name: "Custom Rule",
    description: describeCustomRule(parsed.notation),
    birth: parsed.birth,
    survive: parsed.survive,
    notation: parsed.notation,
  });

  refreshCustomRuleOptionLabel();
  applyRuleByKey("custom");

  if (announce) {
    setRuleFeedback(`Custom rule applied: ${parsed.notation}.`, "success");
  }

  return rules.custom;
}

function getLiveBounds() {
  let minX = state.columns;
  let minY = state.rows;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < state.rows; y += 1) {
    for (let x = 0; x < state.columns; x += 1) {
      if (state.grid[indexFor(x, y)] !== 1) {
        continue;
      }

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX === -1) {
    return null;
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function encodeRun(length, token) {
  return length > 1 ? `${length}${token}` : token;
}

function wrapRleBody(body) {
  const tokens = body.match(/\d*[ob$!]/gi) || [];
  const lines = [];
  let line = "";

  tokens.forEach((token) => {
    if (line.length > 0 && line.length + token.length > 68) {
      lines.push(line);
      line = "";
    }

    line += token;

    if (token.endsWith("!")) {
      lines.push(line);
      line = "";
    }
  });

  if (line.length > 0) {
    lines.push(line);
  }

  return lines.join("\n");
}

function serializeRle() {
  const bounds = getLiveBounds();

  if (!bounds) {
    return null;
  }

  const rows = [];

  for (let y = 0; y < bounds.height; y += 1) {
    let row = "";
    let runLength = 0;
    let runToken = null;

    for (let x = 0; x < bounds.width; x += 1) {
      const alive = state.grid[indexFor(bounds.minX + x, bounds.minY + y)] === 1;
      const token = alive ? "o" : "b";

      if (runToken === token) {
        runLength += 1;
        continue;
      }

      if (runToken) {
        if (runToken === "o") {
          row += encodeRun(runLength, runToken);
        } else {
          row += encodeRun(runLength, runToken);
        }
      }

      runToken = token;
      runLength = 1;
    }

    if (runToken === "o") {
      row += encodeRun(runLength, runToken);
    }

    rows.push(row);
  }

  const body = `${rows.join("$")}!`;

  return [
    "#C Exported from Signal Garden",
    `x = ${bounds.width}, y = ${bounds.height}, rule = ${state.activeRule.notation}`,
    wrapRleBody(body),
  ].join("\n");
}

function defaultSnapshotName() {
  const stamp = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  return `Pattern ${stamp}`;
}

function normalizeSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") {
    return null;
  }

  const theme = ["signal", "ember", "lagoon"].includes(snapshot.theme)
    ? snapshot.theme
    : "signal";
  const edge = snapshot.edge === "wrap" ? "wrap" : "bounded";
  const speed = clamp(Number(snapshot.speed) || Number(speedRange.value), 2, 30);
  const density = clamp(Number(snapshot.density) || Number(densityRange.value), 4, 45);

  return {
    id:
      typeof snapshot.id === "string" && snapshot.id.trim()
        ? snapshot.id
        : `slot-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name:
      typeof snapshot.name === "string" && snapshot.name.trim()
        ? snapshot.name.trim()
        : defaultSnapshotName(),
    createdAt:
      typeof snapshot.createdAt === "string" && snapshot.createdAt.trim()
        ? snapshot.createdAt
        : new Date().toISOString(),
    rule:
      typeof snapshot.rule === "string" && snapshot.rule.trim()
        ? snapshot.rule.trim()
        : rules.life.notation,
    edge,
    theme,
    speed,
    density,
    rle: typeof snapshot.rle === "string" ? snapshot.rle.trim() : "",
  };
}

function formatSnapshotTimestamp(isoString) {
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function persistVault() {
  try {
    window.localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(state.vaultItems));
  } catch (error) {
    setVaultFeedback("Local storage is unavailable, so this browser cannot save vault slots.", "error");
  }
}

function renderVaultList() {
  vaultList.replaceChildren();

  if (state.vaultItems.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "vault-empty";
    emptyState.textContent = "No saved patterns yet. Save the current field to start a personal vault.";
    vaultList.append(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();

  state.vaultItems.forEach((snapshot) => {
    const card = document.createElement("article");
    card.className = "vault-card";

    const header = document.createElement("div");
    header.className = "vault-card-header";

    const title = document.createElement("strong");
    title.className = "vault-title";
    title.textContent = snapshot.name;

    const timestamp = document.createElement("span");
    timestamp.className = "vault-timestamp";
    timestamp.textContent = formatSnapshotTimestamp(snapshot.createdAt);

    header.append(title, timestamp);

    const chipRow = document.createElement("div");
    chipRow.className = "vault-chip-row";

    [
      snapshot.rule,
      snapshot.edge === "wrap" ? "Wrap" : "Finite",
      snapshot.theme,
      `${snapshot.speed} tps`,
    ].forEach((label) => {
      const chip = document.createElement("span");
      chip.className = "vault-chip";
      chip.textContent = label;
      chipRow.append(chip);
    });

    const actions = document.createElement("div");
    actions.className = "vault-action-row";

    const loadButton = document.createElement("button");
    loadButton.type = "button";
    loadButton.className = "ghost-button";
    loadButton.dataset.action = "load";
    loadButton.dataset.id = snapshot.id;
    loadButton.textContent = "Load";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "ghost-button";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = snapshot.id;
    deleteButton.textContent = "Delete";

    actions.append(loadButton, deleteButton);
    card.append(header, chipRow, actions);
    fragment.append(card);
  });

  vaultList.append(fragment);
}

function restoreVaultFromStorage() {
  try {
    const rawValue = window.localStorage.getItem(VAULT_STORAGE_KEY);

    if (!rawValue) {
      state.vaultItems = [];
      renderVaultList();
      return;
    }

    const parsed = JSON.parse(rawValue);
    const items = Array.isArray(parsed) ? parsed.map(normalizeSnapshot).filter(Boolean) : [];
    state.vaultItems = items.slice(0, 18);
    renderVaultList();
  } catch (error) {
    state.vaultItems = [];
    renderVaultList();
    setVaultFeedback("Saved vault data could not be read, so the vault was reset in memory.", "error");
  }
}

function createCurrentSnapshot(name = "") {
  const rle = serializeRle();

  if (!rle) {
    return null;
  }

  return normalizeSnapshot({
    name: name || defaultSnapshotName(),
    rule: state.activeRule.notation,
    edge: state.edgeMode,
    theme: state.themeKey,
    speed: state.speed,
    density: state.density,
    rle,
  });
}

function parseRle(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const headerIndex = lines.findIndex((line) => !line.startsWith("#"));

  if (headerIndex === -1) {
    throw new Error("RLE is missing its x/y header line.");
  }

  const headerLine = lines[headerIndex];
  const bodyLines = lines.slice(headerIndex + 1).filter((line) => !line.startsWith("#"));
  const headerMatch = headerLine.match(
    /^x\s*=\s*(\d+)\s*,\s*y\s*=\s*(\d+)(?:\s*,\s*rule\s*=\s*([BS0-8\/]+))?$/i,
  );

  if (!headerMatch) {
    throw new Error("RLE header should look like: x = 3, y = 3, rule = B3/S23");
  }

  const width = Number(headerMatch[1]);
  const height = Number(headerMatch[2]);
  const ruleNotation = headerMatch[3] || "";
  const body = bodyLines.join("").replace(/\s+/g, "");

  if (!body.includes("!")) {
    throw new Error("RLE body must end with '!'.");
  }

  const cells = [];
  let x = 0;
  let y = 0;
  let numberBuffer = "";
  let ended = false;

  for (const char of body) {
    if (/\d/.test(char)) {
      numberBuffer += char;
      continue;
    }

    const runLength = numberBuffer ? Number(numberBuffer) : 1;
    const token = char.toLowerCase();
    numberBuffer = "";

    if (token === "o" || token === "b") {
      for (let step = 0; step < runLength; step += 1) {
        if (x >= width || y >= height) {
          throw new Error("RLE pattern exceeds its declared dimensions.");
        }

        if (token === "o") {
          cells.push([x, y]);
        }

        x += 1;
      }

      continue;
    }

    if (token === "$") {
      y += runLength;
      x = 0;

      if (y > height) {
        throw new Error("RLE row breaks exceed the declared pattern height.");
      }

      continue;
    }

    if (token === "!") {
      ended = true;
      break;
    }

    throw new Error(`Unsupported RLE token '${char}'.`);
  }

  if (!ended) {
    throw new Error("RLE body must terminate with '!'.");
  }

  return {
    width,
    height,
    cells,
    ruleNotation,
  };
}

function loadRlePattern(rawText, { announce = true, updateTextarea = false } = {}) {
  const trimmedText = rawText.trim();

  if (!trimmedText) {
    if (announce) {
      setSeedFeedback("Paste an RLE pattern before loading it.", "error");
    }

    return {
      ok: false,
      error: "Paste an RLE pattern before loading it.",
    };
  }

  try {
    const parsed = parseRle(trimmedText);

    if (parsed.ruleNotation) {
      applyRuleNotation(parsed.ruleNotation, { announce: false, preferExisting: true });
    }

    clearWorld();

    const offsetX = Math.floor((state.columns - parsed.width) / 2);
    const offsetY = Math.floor((state.rows - parsed.height) / 2);
    let clipped = 0;

    parsed.cells.forEach(([x, y]) => {
      const targetX = x + offsetX;
      const targetY = y + offsetY;

      if (
        targetX < 0 ||
        targetX >= state.columns ||
        targetY < 0 ||
        targetY >= state.rows
      ) {
        clipped += 1;
        return;
      }

      const index = indexFor(targetX, targetY);
      state.grid[index] = 1;
      state.heat[index] = 220;
    });

    if (updateTextarea) {
      seedCodeInput.value = trimmedText;
    }

    recalculatePopulation();
    draw();

    const clipMessage =
      clipped > 0 ? ` ${clipped} cells were clipped to fit the current field.` : "";
    const ruleMessage = parsed.ruleNotation
      ? ` Rule ${state.activeRule.notation} is now active.`
      : "";
    const message = `Loaded ${state.population} live cells from RLE.${ruleMessage}${clipMessage}`;

    if (announce) {
      setSeedFeedback(message, "success");
    }

    return {
      ok: true,
      message,
      clipped,
      population: state.population,
      rule: state.activeRule.notation,
    };
  } catch (error) {
    if (announce) {
      setSeedFeedback(error.message, "error");
    }

    return {
      ok: false,
      error: error.message,
    };
  }
}

function applySnapshot(snapshot, { sourceLabel = "snapshot", announce = true } = {}) {
  const normalized = normalizeSnapshot(snapshot);

  if (!normalized) {
    if (announce) {
      setVaultFeedback("That snapshot could not be loaded.", "error");
    }
    return false;
  }

  themeSelect.value = normalized.theme;
  setTheme(normalized.theme);

  state.speed = normalized.speed;
  speedRange.value = String(normalized.speed);
  speedValue.textContent = `${normalized.speed} tps`;

  state.density = normalized.density;
  densityRange.value = String(normalized.density);
  densityValue.textContent = `${normalized.density}%`;

  state.edgeMode = normalized.edge;
  edgeSelect.value = normalized.edge;

  applyRuleNotation(normalized.rule, { announce: false, preferExisting: true });

  let result = { ok: true };

  if (normalized.rle) {
    result = loadRlePattern(normalized.rle, {
      announce: false,
      updateTextarea: true,
    });
  } else {
    seedCodeInput.value = "";
    clearWorld();
  }

  if (!result.ok) {
    if (announce) {
      setVaultFeedback(`Could not load ${sourceLabel}: ${result.error}`, "error");
    }
    return false;
  }

  vaultNameInput.value = normalized.name;

  if (announce) {
    setVaultFeedback(`Loaded ${sourceLabel}.`, "success");
    setSeedFeedback(`Loaded ${sourceLabel} into the chamber.`, "success");
  }

  return true;
}

function saveCurrentPatternToVault() {
  const snapshot = createCurrentSnapshot(vaultNameInput.value.trim());

  if (!snapshot) {
    setVaultFeedback("Nothing live to save yet. Grow or paint a pattern first.", "error");
    return;
  }

  state.vaultItems = [snapshot, ...state.vaultItems].slice(0, 18);
  persistVault();
  renderVaultList();
  vaultNameInput.value = "";
  setVaultFeedback(`Saved "${snapshot.name}" to Pattern Vault.`, "success");
}

function deleteSnapshotFromVault(snapshotId) {
  const snapshot = state.vaultItems.find((item) => item.id === snapshotId);
  state.vaultItems = state.vaultItems.filter((item) => item.id !== snapshotId);
  persistVault();
  renderVaultList();
  setVaultFeedback(
    snapshot ? `Deleted "${snapshot.name}" from Pattern Vault.` : "Pattern slot deleted.",
    "info",
  );
}

function base64UrlEncode(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function buildShareUrl() {
  const snapshot = createCurrentSnapshot(vaultNameInput.value.trim() || defaultSnapshotName());

  if (!snapshot) {
    return null;
  }

  const payload = {
    v: 1,
    name: snapshot.name,
    rule: snapshot.rule,
    edge: snapshot.edge,
    theme: snapshot.theme,
    speed: snapshot.speed,
    density: snapshot.density,
    rle: snapshot.rle,
  };

  const encoded = base64UrlEncode(JSON.stringify(payload));
  return `${window.location.href.split("#")[0]}#${SHARE_HASH_KEY}=${encoded}`;
}

async function copyShareLink() {
  const shareUrl = buildShareUrl();

  if (!shareUrl) {
    setSeedFeedback("Nothing live to share yet. Build a pattern before generating a link.", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(shareUrl);
    setSeedFeedback("Share link copied to the clipboard.", "success");
  } catch (error) {
    window.prompt("Copy this Signal Garden share link:", shareUrl);
    setSeedFeedback("Clipboard access was blocked, so the share link was opened for manual copy.", "info");
  }
}

function readSharedStateFromLocation() {
  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";

  if (!hash) {
    return null;
  }

  const params = new URLSearchParams(hash);
  const encoded = params.get(SHARE_HASH_KEY);

  if (!encoded) {
    return null;
  }

  try {
    return JSON.parse(base64UrlDecode(encoded));
  } catch (error) {
    throw new Error("This share link could not be decoded.");
  }
}

function loadSharedStateFromLocation() {
  let payload;

  try {
    payload = readSharedStateFromLocation();
  } catch (error) {
    setSeedFeedback(error.message, "error");
    return false;
  }

  if (!payload) {
    return false;
  }

  const snapshot = normalizeSnapshot({
    name: payload.name || "Shared Pattern",
    rule: payload.rule,
    edge: payload.edge,
    theme: payload.theme,
    speed: payload.speed,
    density: payload.density,
    rle: payload.rle,
  });

  if (!snapshot || !snapshot.rle) {
    setSeedFeedback("The share link did not contain a valid pattern payload.", "error");
    return false;
  }

  const applied = applySnapshot(snapshot, {
    sourceLabel: "shared link",
    announce: false,
  });

  if (!applied) {
    setSeedFeedback("The shared state could not be loaded into the chamber.", "error");
    return false;
  }

  setSeedFeedback("Loaded shared state from the URL.", "success");
  setVaultFeedback("Shared state loaded. Save it to the vault if you want to keep it locally.", "info");
  return true;
}

function exportSeedToTextarea() {
  const rle = serializeRle();

  if (!rle) {
    setSeedFeedback("Nothing to export yet. Paint, randomize, or drop a preset first.", "error");
    return;
  }

  seedCodeInput.value = rle;
  setSeedFeedback("Current seed exported as portable RLE.", "success");
}

async function copySeedToClipboard() {
  if (!seedCodeInput.value.trim()) {
    exportSeedToTextarea();
  }

  if (!seedCodeInput.value.trim()) {
    return;
  }

  try {
    await navigator.clipboard.writeText(seedCodeInput.value);
    setSeedFeedback("RLE copied to the clipboard.", "success");
  } catch (error) {
    seedCodeInput.focus();
    seedCodeInput.select();

    if (typeof document.execCommand === "function" && document.execCommand("copy")) {
      setSeedFeedback("RLE copied with a fallback clipboard command.", "success");
      return;
    }

    setSeedFeedback("Clipboard access was blocked. The RLE is selected for manual copy.", "info");
  }
}

function loadSeedFromTextarea() {
  loadRlePattern(seedCodeInput.value, { announce: true, updateTextarea: false });
}

function releasePointer(event) {
  state.pointerDown = false;

  if (event && canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }
}

function wireEvents() {
  window.addEventListener("resize", resizeWorld);

  playButton.addEventListener("click", toggleRunning);
  stepButton.addEventListener("click", () => {
    advanceSimulation();
    draw();
  });
  clearButton.addEventListener("click", clearWorld);
  randomButton.addEventListener("click", randomizeWorld);

  ruleSelect.addEventListener("change", (event) => {
    applyRuleByKey(event.target.value);
    setRuleFeedback(`Active rule ${state.activeRule.notation}.`, "info");
  });

  edgeSelect.addEventListener("change", (event) => {
    state.edgeMode = event.target.value;
    updateStats();
    setRuleFeedback(
      state.edgeMode === "wrap"
        ? "Wraparound mode enabled. Edges now connect like a torus."
        : "Finite edges restored. Cells beyond the boundary are treated as empty.",
      "info",
    );
  });

  presetSelect.addEventListener("change", (event) => {
    placePreset(event.target.value);
    setSeedFeedback("Preset loaded into the field.", "info");
  });

  atlasSearchInput.addEventListener("input", (event) => {
    state.atlasQuery = event.target.value;
    renderAtlas();
  });

  atlasList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-preset-key]");

    if (!button) {
      return;
    }

    placePreset(button.dataset.presetKey);
    setSeedFeedback(`Atlas pattern "${presets[button.dataset.presetKey].name}" loaded.`, "success");
  });

  toolSelect.addEventListener("change", (event) => {
    state.tool = event.target.value;
  });

  themeSelect.addEventListener("change", (event) => {
    setTheme(event.target.value);
  });

  speedRange.addEventListener("input", (event) => {
    state.speed = Number(event.target.value);
    speedValue.textContent = `${state.speed} tps`;
  });

  densityRange.addEventListener("input", (event) => {
    state.density = Number(event.target.value);
    densityValue.textContent = `${state.density}%`;
  });

  applyRuleButton.addEventListener("click", () => {
    applyRuleNotation(customRuleInput.value, { announce: true, preferExisting: true });
  });

  customRuleInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    applyRuleNotation(customRuleInput.value, { announce: true, preferExisting: true });
  });

  exportSeedButton.addEventListener("click", exportSeedToTextarea);
  copySeedButton.addEventListener("click", copySeedToClipboard);
  shareLinkButton.addEventListener("click", copyShareLink);
  loadSeedButton.addEventListener("click", loadSeedFromTextarea);
  savePatternButton.addEventListener("click", saveCurrentPatternToVault);

  vaultNameInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    saveCurrentPatternToVault();
  });

  vaultList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action][data-id]");

    if (!button) {
      return;
    }

    const snapshotId = button.dataset.id;

    if (button.dataset.action === "load") {
      const snapshot = state.vaultItems.find((item) => item.id === snapshotId);

      if (!snapshot) {
        setVaultFeedback("That saved pattern no longer exists.", "error");
        return;
      }

      applySnapshot(snapshot, {
        sourceLabel: `vault slot "${snapshot.name}"`,
        announce: true,
      });
      return;
    }

    if (button.dataset.action === "delete") {
      deleteSnapshotFromVault(snapshotId);
    }
  });

  canvas.addEventListener("pointerdown", (event) => {
    state.pointerDown = true;
    canvas.setPointerCapture(event.pointerId);
    paintAt(event.clientX, event.clientY);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.pointerDown) {
      return;
    }

    paintAt(event.clientX, event.clientY);
  });

  canvas.addEventListener("pointerup", releasePointer);
  canvas.addEventListener("pointercancel", releasePointer);
  canvas.addEventListener("pointerleave", () => {
    state.pointerDown = false;
  });

  window.addEventListener("keydown", (event) => {
    const tagName = document.activeElement?.tagName;

    if (
      tagName === "SELECT" ||
      tagName === "INPUT" ||
      tagName === "BUTTON" ||
      tagName === "TEXTAREA"
    ) {
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      toggleRunning();
      return;
    }

    if (event.key.toLowerCase() === "c") {
      clearWorld();
      return;
    }

    if (event.key.toLowerCase() === "r") {
      randomizeWorld();
    }
  });
}

function init() {
  buildSelectOptions();
  restoreVaultFromStorage();
  ruleSelect.value = state.ruleKey;
  setSelectedPreset("blank");
  edgeSelect.value = state.edgeMode;
  customRuleInput.value = state.activeRule.notation;
  atlasSearchInput.value = "";
  speedValue.textContent = `${state.speed} tps`;
  densityValue.textContent = `${state.density}%`;
  setRuleFeedback("Use formats like B36/S23 or shorthand like 23/3.", "info");
  setSeedFeedback("RLE keeps patterns portable across Conway Life ecosystems.", "info");
  setVaultFeedback("Saved patterns stay in this browser via local storage.", "info");
  updateStats();
  wireEvents();
  resizeWorld();
  loadSharedStateFromLocation();
  requestAnimationFrame(loop);
}

init();
