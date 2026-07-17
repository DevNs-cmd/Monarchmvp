import { spawn } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const [role = "PUBLIC", path = "/", name = "capture", widthArg = "1440", heightArg = "1000"] = process.argv.slice(2);
const width = Number(widthArg);
const height = Number(heightArg);
const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const profile = await mkdtemp(join(tmpdir(), "monarch-chrome-"));
const outputDir = resolve("outputs/screenshots");
await mkdir(outputDir, { recursive: true });

const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  "--remote-debugging-port=9222",
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: "ignore" });

async function retry(operation, attempts = 50) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try { return await operation(); } catch (error) { lastError = error; await new Promise((resolveDelay) => setTimeout(resolveDelay, 100)); }
  }
  throw lastError;
}

try {
  const target = await retry(async () => {
    const response = await fetch(`http://127.0.0.1:9222/json/new?${encodeURIComponent(`${baseUrl}/login`)}`, { method: "PUT" });
    if (!response.ok) throw new Error(`Chrome target unavailable: ${response.status}`);
    return response.json();
  });

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolveOpen, rejectOpen) => { socket.addEventListener("open", resolveOpen, { once: true }); socket.addEventListener("error", rejectOpen, { once: true }); });
  let commandId = 0;
  const pending = new Map();
  const eventWaiters = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data));
    if (message.id) {
      const waiter = pending.get(message.id);
      if (waiter) {
        pending.delete(message.id);
        if (message.error) waiter.reject(new Error(message.error.message));
        else waiter.resolve(message.result);
      }
      return;
    }
    const waiters = eventWaiters.get(message.method) || [];
    eventWaiters.delete(message.method);
    waiters.forEach((resolveEvent) => resolveEvent(message.params));
  });
  const send = (method, params = {}) => new Promise((resolveCommand, rejectCommand) => {
    const id = ++commandId;
    pending.set(id, { resolve: resolveCommand, reject: rejectCommand });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const waitForEvent = (method) => new Promise((resolveEvent) => eventWaiters.set(method, [...(eventWaiters.get(method) || []), resolveEvent]));

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 700 });
  const firstLoad = waitForEvent("Page.loadEventFired");
  await send("Page.navigate", { url: `${baseUrl}/login` });
  await firstLoad;

  if (role !== "PUBLIC") {
    const expression = `fetch('/api/auth/demo-login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({role:${JSON.stringify(role)}})}).then(async r=>({ok:r.ok,body:await r.text()}))`;
    const login = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (!login.result?.value?.ok) throw new Error(`Demo login failed: ${login.result?.value?.body}`);
  }

  const loaded = waitForEvent("Page.loadEventFired");
  await send("Page.navigate", { url: `${baseUrl}${path}` });
  await loaded;
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 1500));
  const screenshot = await send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
  const output = join(outputDir, `${name}.png`);
  await writeFile(output, Buffer.from(screenshot.data, "base64"));
  console.log(output);
  socket.close();
} finally {
  chrome.kill("SIGTERM");
  await new Promise((resolveExit) => {
    if (chrome.exitCode !== null) resolveExit();
    else chrome.once("exit", resolveExit);
  });
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
