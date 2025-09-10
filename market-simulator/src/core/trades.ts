import { renderTradeHistory, updateTradeHistoryUI } from "../ui/history";
import { market, updateBalance } from "./market";

// ===================================================================================
// ============================== DEFINITION DES TRADES ==============================
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

export let trades: Trade[] = [];

// Place un trade en fonction des paramètres
export const placeTrade = (type: "buy" | "sell", volume: number, tp?: number, sl?: number) => {
    let trade: Trade = {
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

export const closeTrade = (trade: Trade) => {
    if (!trade.active) return; // évite de clôturer 2 fois

    // Ajoute le PnL au solde
    market.balance += trade.PnL ?? 0;

    // Marque le trade comme inactif
    trade.active = false;
};

// ==================================================================================
// ================================== TradeHistory ==================================
// ==================================================================================


// Ajout des listeners pour les boutons Cancel
const addCancelListeners = () => {
    document.querySelectorAll<HTMLButtonElement>(".cancelBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            console.log('yyyyyy')
            const i = parseInt(btn.dataset.index!);
            closeTrade(trades[i])
            renderTradeHistory(); // rafraîchit le tableau
        });
    });
};

setInterval(() => {
    updateTrades();       
    renderTradeHistory(); 
    addCancelListeners();
    updateBalance();     
}, 500);
