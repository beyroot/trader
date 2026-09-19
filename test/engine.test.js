import test from "node:test";
import assert from "node:assert/strict";
import { executePaperOrder, marketValue } from "../src/engine.js";

test("marketValue rounds monetary results", () => assert.equal(marketValue(0.123, 100.127), 12.32));
test("buy reduces cash and increases position", () => assert.deepEqual(executePaperOrder({ cash: 1000, position: 0 }, { symbol: "BTC", side: "BUY", quantity: 2, price: 100, createdAt: "2026-01-01" }), { cash: 800, position: 2 }));
test("rejects orders above buying power", () => assert.throws(() => executePaperOrder({ cash: 10, position: 0 }, { symbol: "BTC", side: "BUY", quantity: 1, price: 100, createdAt: "2026-01-01" }), /buying power/));
test("rejects unsupported short sales", () => assert.throws(() => executePaperOrder({ cash: 100, position: 0 }, { symbol: "BTC", side: "SELL", quantity: 1, price: 100, createdAt: "2026-01-01" }), /Short selling/));
