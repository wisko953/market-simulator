// ===================================================================================
// ================================ DEFINITION DES TRADES ============================
// ===================================================================================

export interface Trade {
    time: Date;
    type: "buy" | "sell";
    volume: number;
    price: number;
    tp?: number;
    sl?: number;
    PnL?: number;
    active: boolean;
}

export const trades: Trade[] = [];

// Place un trade en fonction des paramètres
export const placeTrade = (type: "buy" | "sell", volume: number, tp?: number, sl?: number) => {
    const trade: Trade = {
        time: new Date(),
        type: type,
        volume: volume,
        price: market.price,
        tp: tp ?? 0,
        sl: sl ?? 0,
        PnL: 0,
        active: true

    };

    trades.push(trade);
    updateTradeHistoryUI(trade);
}

export const closeTrade = (trade: Trade) => {
  if (!trade.active) return; // évite de clôturer 2 fois

  // Ajoute le PnL au solde
  market.balance += trade.PnL ?? 0;

  // Marque le trade comme inactif
  trade.active = false;
};


// Va update le tradeHistory du marketState
export const updateTradeHistoryUI = (trade: Trade) => {
    const tableBody = document.querySelector("#tradeHistory tbody")!;
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${trade.time.toLocaleTimeString()}</td>
    <td style="color:${trade.type === "buy" ? "lime" : "red"}">${trade.type.toUpperCase()}</td>
    <td>${trade.volume}</td>
    <td>${trade.price.toFixed(2)}</td>
    <td></td>
    <td>${trade.sl.toFixed(2) ?? 0}</td>
    <td>${trade.tp.toFixed(2) ?? 0}</td>
    <td>${trade.active}</td>
  `;

    tableBody.appendChild(row);
};

// Met à jour le PnL et ferme les trades si TP/SL atteint
export const updateTrades = () => {
    const currentPrice = market.price;

    trades.forEach((trade) => {
        if (!trade.active) return; // skip si déjà fermé

        // Calcul du PnL
        if (trade.type === "buy") {
            trade.PnL = (currentPrice - trade.price) * trade.volume;
        } else {
            trade.PnL = (trade.price - currentPrice) * trade.volume;
        }

        // Vérification TP / SL
        if (trade.tp && trade.tp !== 0) {
            if (trade.type === "buy" && currentPrice >= trade.tp) {
                closeTrade(trade);

            } else if (trade.type === "sell" && currentPrice <= trade.tp) {
                closeTrade(trade);

            }
        }

        if (trade.sl && trade.sl !== 0) {
            if (trade.type === "buy" && currentPrice <= trade.sl) {
                closeTrade(trade);
            } else if (trade.type === "sell" && currentPrice >= trade.sl) {
                closeTrade(trade);
            }
        }
    });
};

// ===============================================================
// ======================== TRADE HISTORY ========================
// ===============================================================

const renderTradeHistory = () => {
  const tableBody = document.querySelector("#tradeHistory tbody")!;
  tableBody.innerHTML = "";

  trades.forEach((trade, index) => {
    const row = document.createElement("tr");

    const typeClass = trade.type === "buy" ? "buy" : "sell";
    const activeClass = trade.active ? "" : "inactive";

    row.innerHTML = `
      <td>${trade.time.toLocaleTimeString()}</td>
      <td class="${typeClass} ${activeClass}">${trade.type.toUpperCase()}</td>
      <td>${trade.volume}</td>
      <td>${trade.price.toFixed(2)}</td>
      <td class="${trade.PnL! >= 0 ? 'profit' : 'loss'} ${activeClass}">
        ${trade.PnL!.toFixed(2)}
      </td>
      <td>${trade.sl?.toFixed(2) || "-"}</td>
      <td>${trade.tp?.toFixed(2) || "-"}</td>
      <td>
        ${trade.active 
          ? `<button class="cancelBtn" data-index="${index}">X</button>` 
          : "-"}
      </td>
    `;

    tableBody.appendChild(row);
  });

  // Ajout des listeners pour les boutons Cancel
  document.querySelectorAll<HTMLButtonElement>(".cancelBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.dataset.index!);
      closeTrade(trades[i])
      renderTradeHistory(); // rafraîchit le tableau
    });
  });
};

setInterval(() => {
  updateTrades();       // recalcul PnL
  renderTradeHistory(); // mise à jour tableau
  updateBalance();      // mise à jour widget
}, 1000);


// ==============================================================
// ======================== MARKET STATE ========================
// ==============================================================

export interface MarketState {
    tradeHistory: Trade[];
    price: number;
    balance: number;
    priceHistory: number[];
}

export let market: MarketState = {
    tradeHistory: [],
    priceHistory: [],
    price: 10000,
    balance: 1000,
}

// ----- Définition des fonctions -----

const balanceAmountEl = document.getElementById("balanceAmount")!;

const updateBalance = () => {
  // Somme des PnL actifs
  const cumulativePnL = trades
    .filter(t => t.active)
    .reduce((sum, t) => sum + (t.PnL ?? 0), 0);

  const totalBalance = market.balance + cumulativePnL;
  balanceAmountEl.textContent = totalBalance.toFixed(2);
};

const SimulateStep = () => {
    let currentPrice = market.price
    let [max, min] = [currentPrice + currentPrice * 0.005, currentPrice - currentPrice * 0.005]
    let newPrice = Math.random() * (max - min) + min;
    market.price = parseFloat(newPrice.toFixed(2));         // garde un certain nombre de décimale
}

setInterval(SimulateStep, 200)
setInterval(() => {}, 1000)