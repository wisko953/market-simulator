import { placeTrade } from "../core/market.js";

const initTradeWindow = () => {
  const volumeInput = document.getElementById("volumeInput") as HTMLInputElement;
  const tpInput = document.getElementById("tpInput") as HTMLInputElement;
  const slInput = document.getElementById("slInput") as HTMLInputElement;

  const buyBtn = document.getElementById("buyBtn")!;
  const sellBtn = document.getElementById("sellBtn")!;

  const handleTrade = (type: "buy" | "sell") => {
    const volume = parseFloat(volumeInput.value);
    const tp = tpInput.value ? parseFloat(tpInput.value) : undefined;
    const sl = slInput.value ? parseFloat(slInput.value) : undefined;

    placeTrade(type, volume, tp, sl);
  };

  buyBtn.addEventListener("click", () => handleTrade("buy"));
  sellBtn.addEventListener("click", () => handleTrade("sell"));
};

export { initTradeWindow };
