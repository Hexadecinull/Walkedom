# Walkedom

Cryptographically fair randomizers. Spin a wheel, pick names, roll dice, flip coins, generate numbers — all powered by `crypto.getRandomValues()`, never `Math.random()`.

## Tools

| Tool | Description |
|------|-------------|
| **Spin Wheel** | Animated spinning wheel with idle drift and physics |
| **Instant Picker** | Pick N items from a pasted list instantly |
| **Dice Roller** | d4 through d100, multi-dice, totals & averages |
| **Coin Flip** | Heads / tails with streak tracker |
| **Number Generator** | Any range, any count, unique or with replacement |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Tech stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- Canvas 2D for the wheel
- `crypto.getRandomValues()` for all randomness
- Zero runtime dependencies beyond React

## Deployment

GitHub Actions workflows are included for:
- **CI** (`.github/workflows/ci.yml`) — lint + build on every push/PR
- **Deploy** (`.github/workflows/deploy.yml`) — auto-deploy to GitHub Pages on push to `main`

To enable GitHub Pages: go to **Settings → Pages → Source → GitHub Actions**.

## License

[GPL-3.0](./LICENSE)
