import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1)];
    })
);

const login = await fetch("http://localhost:3000/api/admin/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ password: env.ADMIN_PASSWORD }),
});
const setCookie = login.headers.getSetCookie?.() || [];
console.log("login", login.status, "cookies", setCookie.length);

const cookieHeader = setCookie.map((c) => c.split(";")[0]).join("; ");
const res = await fetch("http://localhost:3000/admin", {
  headers: { cookie: cookieHeader },
  redirect: "manual",
});
const t = await res.text();
console.log("status", res.status, "loc", res.headers.get("location"));
console.log("no-orders", t.includes("No orders yet"));
console.log("couldnt", t.includes("Couldn't load orders"));
console.log("has table", t.includes("<table"));
console.log("order links", (t.match(/\/admin\/orders\//g) || []).length);
const text = t.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const idx = text.indexOf("Orders");
console.log("text around orders", text.slice(Math.max(0, idx), idx + 500));
if (t.includes("Couldn't load orders")) {
  const m = t.match(/Couldn't load orders:[^<]+/);
  console.log(m?.[0]);
}
