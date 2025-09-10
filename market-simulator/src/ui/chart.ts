import { market } from "../core/market.js";

const canvas = document.getElementById("marketChart") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const PADDING_TOP = 30;
const PADDING_BOTTOM = 10;
const PADDING_LEFT = 60;

const chartHeight = canvas.height - PADDING_TOP - PADDING_BOTTOM;

interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  openTime: number
}

let candles: Candle[] = [];
const MAX_CANDLES = 60;   // nombre de bougies visibles
const CANDLE_WIDTH = 10;  // largeur de chaque bougie 

//  grille et la légende
const drawGrid = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const stepY = canvas.height / 10;
  const stepX = canvas.width / 10;

  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 0.5;

  for (let i = 0; i <= 10; i++) {
    // lignes horizontales
    const y = i * stepY;
    ctx.beginPath();
    ctx.moveTo(PADDING_LEFT, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();

    // afficher les valeurs des prix (pas obligé mais vsy)
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    const maxPrice = Math.max(...candles.map(c => c.high), market.price);
    const minPrice = Math.min(...candles.map(c => c.low), market.price);
    const priceLabel = (maxPrice - (maxPrice - minPrice) * (i / 10)).toFixed(2);
    ctx.fillText(priceLabel, 5, y - 2);
  }

  for (let i = 0; i <= 10; i++) {
    // lignes veritcales
    const x = i * stepX;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Légende (moi)
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText(`Prix: ${market.price.toFixed(2)}€`, 10, 20);
};

// Dessine les bougies
const drawCandles = () => {
  if (!candles.length) return;

  const maxPrice = Math.max(...candles.map(c => c.high), market.price);
  const minPrice = Math.min(...candles.map(c => c.low), market.price);

  candles.forEach((candle, i) => {
    const x = PADDING_LEFT + i * CANDLE_WIDTH;
    const yOpen  = canvas.height - PADDING_BOTTOM - ((candle.open  - minPrice) / (maxPrice - minPrice)) * chartHeight;
    const yClose = canvas.height - PADDING_BOTTOM - ((candle.close - minPrice) / (maxPrice - minPrice)) * chartHeight;
    const yHigh  = canvas.height - PADDING_BOTTOM - ((candle.high  - minPrice) / (maxPrice - minPrice)) * chartHeight;
    const yLow   = canvas.height - PADDING_BOTTOM - ((candle.low   - minPrice) / (maxPrice - minPrice)) * chartHeight;
    
    // couleur (vert ou rouge en fonction de la perf)
    ctx.fillStyle = candle.close >= candle.open ? "green" : "red";

    // dessine bougie via coordonnées x & y, largeur et hauteur
    ctx.fillRect(x, Math.min(yOpen, yClose), CANDLE_WIDTH, Math.abs(yClose - yOpen));

    // mèche de la bougie de la muerte
    ctx.beginPath();
    ctx.moveTo(x + CANDLE_WIDTH / 2, yHigh);
    ctx.lineTo(x + CANDLE_WIDTH / 2, yLow);
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 1;
    ctx.stroke();
  });
};

const updateCandle = () => {
  const price = market.price;
  const lastCandle = candles[candles.length - 1];

  // Vérifie si on doit créer une nouvelle bougie ou mettre a jour la précédente
  if (!lastCandle || lastCandle.openTime !== Math.floor(Date.now() / 1000)) {
    candles.push({
      open: price,
      high: price,
      low: price,
      close: price,
      openTime: Math.floor(Date.now() / 1000), 
    });
    if (candles.length > MAX_CANDLES) candles.shift();
  } else {
    lastCandle.high = Math.max(lastCandle.high, price);
    lastCandle.low = Math.min(lastCandle.low, price);
    lastCandle.close = price;
  }
};

// Boucle récursive (jdeteste la recursivité)
const animateChart = () => {
  updateCandle();
  drawGrid();
  drawCandles();
  requestAnimationFrame(animateChart);
};

animateChart();
