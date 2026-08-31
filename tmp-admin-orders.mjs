import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1)];
    })
);

const url = env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
console.log("url host", new URL(url).host);
console.log("key prefix", key.slice(0, 12), "len", key.length);

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error, status, count } = await supabase
  .from("orders")
  .select("*", { count: "exact" })
  .order("created_at", { ascending: false });

console.log("status", status);
console.log("error", error && { message: error.message, code: error.code, details: error.details, hint: error.hint });
console.log("rowCount", data?.length ?? null, "exactCount", count);
if (data?.[0]) {
  console.log("first keys", Object.keys(data[0]));
  console.log("first id prefix", String(data[0].id).slice(0, 8));
  console.log("first status", data[0].status);
}

const rest = await fetch(`${url}/rest/v1/orders?select=id&limit=3`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
console.log("rest status", rest.status, "content-type", rest.headers.get("content-type"));
const body = await rest.text();
console.log("rest body head", body.slice(0, 300));
