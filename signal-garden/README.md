# Signal Garden

Signal Garden is a browser playground for cellular automata, inspired by classic Conway's Game of Life experiments found on GitHub.

## What it does

- Paint and erase cells directly on the simulation field
- Switch between Conway Life, HighLife, Seeds, Day & Night, or your own custom B/S rule
- Toggle between finite edges and wraparound torus behavior
- Drop built-in presets like Glider, Pulsar, Lightweight Spaceship, and Acorn
- Browse a searchable Pattern Atlas with curated oscillators, spaceships, methuselahs, and guns
- Adjust simulation speed and random seed density
- Export the current pattern as standard RLE and import RLE from other Life tools
- Save named snapshots into a local Pattern Vault stored in the browser
- Generate a shareable URL that restores the current rule, theme, edge mode, and pattern
- Swap between three visual palettes

## How to run

Open `index.html` in a browser.

If you want a local server instead, from this folder you can run:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Quick controls

- `Space`: play or pause
- `C`: clear the field
- `R`: randomize the field
