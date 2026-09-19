/** @typedef {{symbol:string, side:'BUY'|'SELL', quantity:number, price:number, createdAt:string}} Order */

/**
 * Calculates the marked value of an asset position.
 * @param {number} quantity
 * @param {number} price
 * @returns {number}
 */
export function marketValue(quantity, price) {
  if (!Number.isFinite(quantity) || !Number.isFinite(price) || quantity < 0 || price < 0) {
    throw new RangeError("Quantity and price must be non-negative finite numbers");
  }
  return Math.round(quantity * price * 100) / 100;
}

/**
 * Applies an order to paper cash while enforcing buying-power and position limits.
 * @param {{cash:number, position:number}} portfolio
 * @param {Order} order
 * @returns {{cash:number, position:number}}
 */
export function executePaperOrder(portfolio, order) {
  const value = marketValue(order.quantity, order.price);
  if (order.quantity <= 0) throw new RangeError("Quantity must be greater than zero");
  if (order.side === "BUY") {
    if (value > portfolio.cash) throw new RangeError("Order exceeds available buying power");
    return { cash: portfolio.cash - value, position: portfolio.position + order.quantity };
  }
  if (order.quantity > portfolio.position) throw new RangeError("Short selling is disabled");
  return { cash: portfolio.cash + value, position: portfolio.position - order.quantity };
}
