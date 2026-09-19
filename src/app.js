import { executePaperOrder, marketValue } from "./engine.js";

const prices = { BTC: 68420.15, ETH: 3722.80, SOL: 174.62 };
let portfolio = { cash: 25000, position: 0 };
let activeSymbol = "BTC";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const $ = (selector) => document.querySelector(selector);

function render() {
  const price = prices[activeSymbol];
  $("#cash").textContent = money.format(portfolio.cash);
  $("#equity").textContent = money.format(portfolio.cash + marketValue(portfolio.position, price));
  $("#position").textContent = `${portfolio.position.toFixed(4)} ${activeSymbol}`;
  $("#market-price").textContent = money.format(price);
  document.querySelectorAll("[data-symbol]").forEach((element) => element.classList.toggle("active", element.dataset.symbol === activeSymbol));
}

document.querySelectorAll("[data-symbol]").forEach((button) => button.addEventListener("click", () => {
  activeSymbol = button.dataset.symbol;
  portfolio.position = 0;
  render();
}));

$("#order-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const side = event.submitter?.value === "SELL" ? "SELL" : "BUY";
  const quantity = Number($("#quantity").value);
  const status = $("#status");
  try {
    portfolio = executePaperOrder(portfolio, { symbol: activeSymbol, side, quantity, price: prices[activeSymbol], createdAt: new Date().toISOString() });
    status.textContent = `${side} filled · ${quantity} ${activeSymbol} · paper account`;
    status.className = "status success";
    render();
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : "Order rejected";
    status.className = "status error";
  }
});

render();
