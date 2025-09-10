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

// Ajouter une fonction asynchrone pour simuler une validation de trade
const validateTrade = async (volume: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (volume > 0 && volume <= 100) {
                resolve(true);
            } else {
                reject(new Error("Volume invalide"));
            }
        }, 100);
    });
};

// Ajouter cette fonction closure pour créer un compteur de trades
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

// Ajouter des fonctions pour les opérations parallèles
const validateVolume = async (volume: number): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(volume > 0 && volume <= 100), 50);
    });
};

const validatePrice = async (price: number): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(price > 0), 75);
    });
};

const validateBalance = async (volume: number, price: number): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(market.balance >= volume * price * 0.1), 100);
    });
};

// Fonction qui utilise Promise.all pour valider en parallèle
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

// Fonction qui utilise Promise.race pour obtenir la validation la plus rapide
const getFastestValidation = async (volume: number, price: number): Promise<string> => {
    const promises = [
        new Promise<string>((resolve) => setTimeout(() => resolve("Volume OK"), 30)),
        new Promise<string>((resolve) => setTimeout(() => resolve("Prix OK"), 40)),
        new Promise<string>((resolve) => setTimeout(() => resolve("Balance OK"), 60))
    ];
    
    return Promise.race(promises);
};

// Modifier placeTrade pour utiliser les opérations parallèles
export const placeTrade = async (type: "buy" | "sell", volume: number, tp?: number, sl?: number) => {
    try {
        // Validation parallèle avec Promise.all
        const isValid = await validateTradeParallel(volume, market.price);
        
        if (isValid) {
            // Obtenir la validation la plus rapide avec Promise.race
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

            trades.push(trade);
            updateTradeHistoryUI(trade);
        } else {
            alert("Trade invalide ! Vérifiez le volume, le prix et votre balance");
        }
    } catch (error) {
        console.error("Erreur lors de la validation du trade:", error);
        alert("Erreur lors de la validation du trade");
    }
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
