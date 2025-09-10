import { trades, type Trade } from "./trades";

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

export const updateBalance = () => {
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