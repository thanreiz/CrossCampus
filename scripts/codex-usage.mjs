import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const codexDir = path.join(homedir(), ".codex");
const authPath = path.join(codexDir, "auth.json");
const versionPath = path.join(codexDir, "version.json");
const sessionsDir = path.join(codexDir, "sessions");
const outPath = path.resolve("codex-usage.html");

function readJson(filePath) {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function walkJsonlFiles(dir) {
  if (!existsSync(dir)) return [];
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkJsonlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".jsonl")) {
      files.push(fullPath);
    }
  }

  return files;
}

function latestTokenCount() {
  const files = walkJsonlFiles(sessionsDir)
    .map((file) => ({ file, mtimeMs: statSync(file).mtimeMs }))
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  let latest = null;

  for (const { file } of files) {
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    for (const line of lines) {
      if (!line.includes('"token_count"')) continue;
      try {
        const record = JSON.parse(line);
        if (record?.payload?.type !== "token_count") continue;
        latest = {
          file,
          timestamp: record.timestamp,
          info: record.payload.info,
          rateLimits: record.payload.rate_limits,
        };
      } catch {
        // Ignore malformed or partially written session lines.
      }
    }
    if (latest) return latest;
  }

  return null;
}

function formatNumber(value) {
  return Number.isFinite(value) ? new Intl.NumberFormat().format(value) : "n/a";
}

function formatPercent(value) {
  return Number.isFinite(value) ? `${value.toFixed(value % 1 ? 1 : 0)}%` : "n/a";
}

function formatReset(value) {
  if (!Number.isFinite(value)) return "n/a";
  return new Date(value * 1000).toLocaleString();
}

function escapeHtml(value) {
  return String(value ?? "n/a")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const auth = readJson(authPath);
const version = readJson(versionPath);
const tokenCount = latestTokenCount();
const usage = tokenCount?.info?.total_token_usage ?? {};
const lastUsage = tokenCount?.info?.last_token_usage ?? {};
const limits = tokenCount?.rateLimits ?? {};
const primary = limits.primary ?? {};
const secondary = limits.secondary ?? {};
const planType = limits.plan_type ?? "unknown";
const contextWindow = tokenCount?.info?.model_context_window;
const contextPercent = Number.isFinite(lastUsage.total_tokens) && Number.isFinite(contextWindow)
  ? (lastUsage.total_tokens / contextWindow) * 100
  : null;

const rows = [
  ["Auth mode", auth?.auth_mode ?? "unknown"],
  ["Account id", auth?.tokens?.account_id ?? "unknown"],
  ["Plan type from Codex logs", planType],
  ["20x label", planType === "pro" ? "Codex reports Pro; local logs do not expose a literal 20x label." : "Not exposed locally."],
  ["CLI latest version cache", version?.latest_version ?? "unknown"],
  ["Last auth refresh", auth?.last_refresh ?? "unknown"],
  ["Latest token event", tokenCount?.timestamp ?? "not found"],
  ["Session file", tokenCount?.file ?? "not found"],
  ["Total tokens", formatNumber(usage.total_tokens)],
  ["Input tokens", formatNumber(usage.input_tokens)],
  ["Cached input tokens", formatNumber(usage.cached_input_tokens)],
  ["Output tokens", formatNumber(usage.output_tokens)],
  ["Reasoning output tokens", formatNumber(usage.reasoning_output_tokens)],
  ["Last turn tokens", formatNumber(lastUsage.total_tokens)],
  ["Context window", formatNumber(contextWindow)],
  ["Latest turn context used", formatPercent(contextPercent)],
  ["Primary limit used", `${formatPercent(primary.used_percent)} over ${primary.window_minutes ?? "n/a"} minutes`],
  ["Primary reset", formatReset(primary.resets_at)],
  ["Secondary limit used", `${formatPercent(secondary.used_percent)} over ${secondary.window_minutes ?? "n/a"} minutes`],
  ["Secondary reset", formatReset(secondary.resets_at)],
];

const htmlRows = rows.map(([label, value]) => `
        <tr>
          <th>${escapeHtml(label)}</th>
          <td>${escapeHtml(value)}</td>
        </tr>`).join("");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Codex Usage</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f5f7fb;
        color: #172033;
      }
      body {
        margin: 0;
        padding: 32px;
      }
      main {
        max-width: 920px;
        margin: 0 auto;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 32px;
        line-height: 1.1;
      }
      p {
        margin: 0 0 24px;
        color: #536070;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        background: #ffffff;
        border: 1px solid #d9e0ea;
        border-radius: 8px;
        overflow: hidden;
      }
      th, td {
        padding: 14px 16px;
        border-bottom: 1px solid #e8edf4;
        text-align: left;
        vertical-align: top;
        overflow-wrap: anywhere;
      }
      th {
        width: 260px;
        color: #344154;
        background: #fafbfd;
      }
      tr:last-child th, tr:last-child td {
        border-bottom: 0;
      }
      .meter {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin: 0 0 20px;
      }
      .panel {
        background: #ffffff;
        border: 1px solid #d9e0ea;
        border-radius: 8px;
        padding: 16px;
      }
      .label {
        color: #536070;
        font-size: 13px;
      }
      .value {
        margin-top: 6px;
        font-size: 28px;
        font-weight: 700;
      }
      @media (max-width: 720px) {
        body { padding: 18px; }
        .meter { grid-template-columns: 1fr; }
        th, td { display: block; width: auto; }
        th { border-bottom: 0; }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Codex Usage</h1>
      <p>Generated from local Codex session logs. Tokens are usage counters, not secret auth tokens.</p>
      <section class="meter">
        <div class="panel">
          <div class="label">Plan</div>
          <div class="value">${escapeHtml(planType)}</div>
        </div>
        <div class="panel">
          <div class="label">Total Tokens</div>
          <div class="value">${escapeHtml(formatNumber(usage.total_tokens))}</div>
        </div>
        <div class="panel">
          <div class="label">Primary Limit Used</div>
          <div class="value">${escapeHtml(formatPercent(primary.used_percent))}</div>
        </div>
        <div class="panel">
          <div class="label">Secondary Limit Used</div>
          <div class="value">${escapeHtml(formatPercent(secondary.used_percent))}</div>
        </div>
      </section>
      <table>
        <tbody>${htmlRows}
        </tbody>
      </table>
    </main>
  </body>
</html>
`;

writeFileSync(outPath, html, "utf8");

console.log(`Codex plan: ${planType}`);
console.log(`Total tokens: ${formatNumber(usage.total_tokens)}`);
console.log(`Primary limit used: ${formatPercent(primary.used_percent)}`);
console.log(`Secondary limit used: ${formatPercent(secondary.used_percent)}`);
console.log(`Latest turn context used: ${formatPercent(contextPercent)}`);
console.log(`Report written: ${outPath}`);


