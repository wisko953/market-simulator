# Market Simulator

Simulateur de marché interactif en JavaScript / TypeScript avec graphique en bougies.

---

## 1. Prérequis

- Node.js >= 16
- npm >= 8

---

## 2. Initialiser le projet avec Vite

```bash
# Créer un nouveau projet Vite
npm init vite@latest market-simulator

# Choisir :
# Framework: Vanilla
# TypeScript: Yes

cd market-simulator
npm install
```

---

## 3. Structure du projet

```
market-simulator/
│
├─ index.html
├─ style.css
├─ package.json
├─ tsconfig.json
└─ src/
   ├─ main.ts          # point d'entrée
   ├─ core/
   │  └─ market.ts     # logique du marché
   └─ ui/
      ├─ chart.ts      # graphique avec bougies
      └─ tradeWindow.ts # boutons Buy/Sell (à implémenter)
```

---

## 4. Lancer le serveur de développement

```bash
npm run dev
```

* Ouvrir le navigateur sur l’URL fournie (ex: `http://localhost:5173/`)
* Le canvas affiche le graphique en temps réel (prix simulé).

---

## 5. Étapes suivantes

* Ajouter la logique Buy/Sell pour interagir avec le marché
* Afficher l’historique des trades
* Ajouter des fonctionnalités avancées (scoring, alertes, indicateurs)
