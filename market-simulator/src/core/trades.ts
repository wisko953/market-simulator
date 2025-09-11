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

export const createTradeCounter = () => {
    let count = 0;
    return () => {
        count++;
        console.log(`Trade #${count} executed`);
        return count;
    };
};

// Utiliser la closure
const tradeCounter = createTradeCounter();

// Fonctions de validations
const validateVolume = async (volume: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (volume > 0 && volume <= 100) {
            resolve(true);
        } else {
            reject(false);
        }
    });
};

const validatePrice = async (price: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (price > 0) {
            resolve(true);
        } else {
            reject(false);
        }
    });
};

const validateBalance = async (volume: number, price: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (market.balance >= volume * price * 0.1) {
            resolve(true);
        } else {
            reject(false);
        }
    });
};

// Validation parallèle
const validateTradeParallel = async (volume: number, price: number): Promise<boolean> => {
    try {
        // Exécution en parallèle de toutes les validations
        const [volumeValid, priceValid, balanceValid] = await Promise.all([
            validateVolume(volume),
            validatePrice(price),
            validateBalance(volume, price)
        ]);

        return volumeValid && priceValid && balanceValid;
    } catch (error) {
        console.error("Erreur lors de la validation parallèle:", error);
        return false;
    }
};

// Validaion singulière
const getFastestValidation = async (volume: number, price: number): Promise<string> => {
    const promises = [
        validateVolume(volume).then(isValid => 
            isValid ? "Volume OK" : "Volume INVALIDE"
        ),
        validatePrice(price).then(isValid => 
            isValid ? "Prix OK" : "Prix INVALIDE"
        ),
        validateBalance(volume, price).then(isValid => 
            isValid ? "Balance OK" : "Balance INSUFFISANTE"
        )
    ];
    
    return Promise.race(promises);
};

export const placeTrade = async (type: "buy" | "sell", volume: number, tp?: number, sl?: number) => {
    try {

        const isValid = await validateTradeParallel(volume, market.price);
        
        if (isValid) {

            const fastestCheck = await getFastestValidation(volume, market.price);
            console.log(`Validation rapide: ${fastestCheck}`);
            
            tradeCounter();
            
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

            trades = [...trades, trade];

            updateTradeHistoryUI(trade);
        } else {
            alert("Trade invalide ! Vérifiez le volume, le prix et votre balance");
        }
    } catch (error) {
        console.error("Erreur lors de la validation du trade:", error);
        alert("Erreur lors de la validation du trade");
    }
};

export const updateTrades = () => {
    const currentPrice = market.price;

    trades.forEach((trade) => {
        if (!trade.active) return; 

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
    if (!trade.active) return;
    market.balance += trade.PnL ?? 0;
    trade.active = false;
};

// ==================================================================================
// ================================== TradeHistory ==================================
// ==================================================================================


// Ajout des listeners pour les boutons Cancel
const addCancelListeners = () => {
    document.querySelectorAll<HTMLButtonElement>(".cancelBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            const i = parseInt(btn.dataset.index!);
            closeTrade(trades[i])
            renderTradeHistory(); 
        });
    });
};

setInterval(() => {
    updateTrades();       
    renderTradeHistory(); 
    addCancelListeners();
    updateBalance();     
}, 500);
