import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as crypto from "node:crypto";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/app/api/webhooks/whatsapp/route.ts", import.meta.url), "utf8");
const token = "local-test-verification-token";
const secret = "local-test-app-secret";

function route(env = { WHATSAPP_VERIFY_TOKEN: token, META_APP_SECRET: secret }) {
  const context = {
    exports: {}, Buffer, URL, Response,
    process: { env },
    require: (id) => {
      assert.equal(id, "node:crypto");
      return crypto;
    },
  };
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, context);
  return context.exports;
}

test("Meta verification echoes the exact challenge only for the configured token", async () => {
  const handlers = route();
  const url = new URL("https://oasisorchardstack.com/api/webhooks/whatsapp");
  url.search = new URLSearchParams({ "hub.mode": "subscribe", "hub.verify_token": token, "hub.challenge": "123456789" });
  const response = await handlers.GET(new Request(url));
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "123456789");
  assert.equal(response.headers.get("cache-control"), "no-store");
  url.searchParams.set("hub.verify_token", "wrong-token");
  assert.equal((await handlers.GET(new Request(url))).status, 403);
  url.searchParams.set("hub.verify_token", token);
  url.searchParams.delete("hub.challenge");
  assert.equal((await handlers.GET(new Request(url))).status, 403);
});

test("unconfigured verification and delivery endpoints fail closed", async () => {
  const handlers = route({});
  assert.equal((await handlers.GET(new Request("https://example.com"))).status, 503);
  assert.equal((await handlers.POST(new Request("https://example.com", { method: "POST" }))).status, 503);
});

test("callbacks require the app-secret signature over the unchanged raw body", async () => {
  const body = JSON.stringify({ object: "whatsapp_business_account", entry: [] });
  const signature = "sha256=" + crypto.createHmac("sha256", secret).update(body).digest("hex");
  const send = (payload, sig = signature) => route().POST(new Request("https://example.com", {
    method: "POST", body: payload, headers: { "x-hub-signature-256": sig },
  }));
  assert.equal((await send(body)).status, 200);
  assert.equal((await send(body + " ")).status, 401);
  assert.equal((await send(body, "")).status, 401);
  assert.equal((await send(body, "sha256=bad")).status, 401);
});

test("valid signatures do not bypass event validation or the body limit", async () => {
  const send = (body) => route().POST(new Request("https://example.com", {
    method: "POST", body,
    headers: { "x-hub-signature-256": "sha256=" + crypto.createHmac("sha256", secret).update(body).digest("hex") },
  }));
  assert.equal((await send("not json")).status, 400);
  assert.equal((await send("null")).status, 400);
  assert.equal((await send('{"object":"page"}')).status, 400);
  assert.equal((await send("x".repeat(1024 * 1024 + 1))).status, 413);
});
