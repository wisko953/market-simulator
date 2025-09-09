// ----- Définition des types -----
export interface Trade {
    time: Date;                // moment où le trade a été exécuté
    type: "buy" | "sell";      // type d’ordre
    volume: number;            // quantité achetée/vendue
    price: number;             // prix unitaire au moment du trade
  }
  
export interface MarketState {
    tradeHistory: Trade[];
    price: number;
    balance: number;
    priceHistory: number[];
}

// ----- Définition de la structure de données -----
export let market: MarketState = {
    tradeHistory: [],
    priceHistory: [],
    price: 10000,
    balance: 1000,
}

// ----- Définition des fonctions -----

const SimulateStep = () => {
    let currentPrice = market.price
    let [max, min] = [currentPrice + currentPrice * 0.005, currentPrice - currentPrice * 0.005]
    let newPrice = Math.random() * (max - min) + min;
    market.price = parseFloat(newPrice.toFixed(2));         // garde un certain nombre de décimale
}

setInterval(SimulateStep, 200)
setInterval(() => {
    console.log(`New price : ${market.price}`)
}, 1000)