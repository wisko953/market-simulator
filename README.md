---

# Market Simulator

Simulateur de marché interactif en JavaScript / TypeScript avec graphique en bougies.

---

## 1. Prérequis

* Node.js >= 16
* npm >= 8

---

## 2. Initialiser le projet Vite avec ton code existant

### Linux / macOS

1. Ouvre un terminal à la racine de ton projet (`market-simulator`).
2. Assure-toi que le script `init_vite.sh` est présent.
3. Rends-le exécutable :

```bash
chmod +x init_vite.sh
```

4. Lance le script :

```bash
./init_vite.sh
```

5. Execute les commandes suivantes si le projet n'est pas déja lancé :
```bash
cd market-simulator
npm install
npm run dev
```

---

### Windows

1. Ouvre l’**Invite de commandes** ou **PowerShell** à la racine de ton projet.
2. Assure-toi que le script `init_vite.bat` est présent.
3. Lance-le :

```bat
init_vite.bat
```

4. Execute les commandes suivantes :
```bash
cd market-simulator
npm install
npm run dev
```
---

## 3. Lancer le serveur de développement

Ouvre le navigateur à l’URL fournie par Vite (ex: `http://localhost:5173/`) pour voir le graphique du marché et interagir avec le simulateur.

---

## 4. Notes

* Les scripts sauvegardent tes fichiers existants pour éviter toute perte.
* Tu peux personnaliser le dossier `market-simulator` ou les chemins dans le script si besoin.
* Tout est prêt pour utiliser TypeScript, Vite et ton code existant.

---

## 5. Architecture

```
market-simulator/
├── node_modules/
├── public/
├── src/
│   ├── core/
│   │   ├── market.ts
│   │   └── trades.ts
│   ├── ui/
│   │   ├── chart.ts
│   │   ├── history.ts
│   │   └── tradeWindow.ts
│   └── main.ts
├── index.html
├── package-lock.json
├── package.json
├── style.css
├── tsconfig.json
├── .gitignore
├── init.bat
├── init.sh
└── README.md
```