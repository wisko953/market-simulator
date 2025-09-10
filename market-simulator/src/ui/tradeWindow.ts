import { placeTrade } from "../core/trades.ts";

// Créer une classe pour utiliser this et bind
class TradeWindowManager {
    private volumeInput: HTMLInputElement;
    private tpInput: HTMLInputElement;
    private slInput: HTMLInputElement;
    private buyBtn: HTMLElement;
    private sellBtn: HTMLElement;

    constructor() {
        this.volumeInput = document.getElementById("volumeInput") as HTMLInputElement;
        this.tpInput = document.getElementById("tpInput") as HTMLInputElement;
        this.slInput = document.getElementById("slInput") as HTMLInputElement;
        this.buyBtn = document.getElementById("buyBtn")!;
        this.sellBtn = document.getElementById("sellBtn")!;
        
        // Utiliser bind pour préserver le contexte de this
        this.handleTrade = this.handleTrade.bind(this);
        this.init();
    }

    private handleTrade(type: "buy" | "sell") {
        const volume = parseFloat(this.volumeInput.value);
        const tp = this.tpInput.value ? parseFloat(this.tpInput.value) : undefined;
        const sl = this.slInput.value ? parseFloat(this.slInput.value) : undefined;

        placeTrade(type, volume, tp, sl);
    }

    private init() {
        this.buyBtn.addEventListener("click", () => this.handleTrade("buy"));
        this.sellBtn.addEventListener("click", () => this.handleTrade("sell"));
    }
}

export const initTradeWindow = () => {
    new TradeWindowManager();
};