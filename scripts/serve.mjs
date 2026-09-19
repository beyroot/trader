import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "dist");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml" };

createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
    const candidate = normalize(join(root, pathname === "/" ? "index.html" : pathname));
    if (!candidate.startsWith(root)) throw new Error("Invalid path");
    const info = await stat(candidate);
    if (!info.isFile()) throw new Error("Not a file");
    response.writeHead(200, { "content-type": types[extname(candidate)] ?? "application/octet-stream" });
    response.end(await readFile(candidate));
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}).listen(4173, "0.0.0.0", () => console.log("Astra Trader: http://localhost:4173"));
