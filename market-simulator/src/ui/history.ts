import { trades,  type Trade} from "../core/trades";

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

export const renderTradeHistory = () => {
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
}
