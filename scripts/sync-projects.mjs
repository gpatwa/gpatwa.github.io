// Renders the project cards in index.html from data/projects.json, pulling each
// repo's primary language from the GitHub API. Fails if a repo is missing or archived.
import { readFileSync, writeFileSync } from "node:fs";

const OWNER = "gpatwa";
const projects = JSON.parse(readFileSync("data/projects.json", "utf8"));
const headers = { Accept: "application/vnd.github+json", "User-Agent": "sync-projects" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const esc = (s) => s.replace(/&/g, "&amp;");
const problems = [];

async function repoInfo(repo) {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${repo}`, { headers });
  if (!res.ok) { problems.push(`${repo}: GitHub API ${res.status}`); return null; }
  const info = await res.json();
  if (info.archived) problems.push(`${repo}: repository is archived`);
  return info;
}

function card(p, i, info) {
  const n = String(i + 1).padStart(2, "0");
  const repoUrl = `https://github.com/${OWNER}/${p.repo}`;
  const lang = p.languageTag === false ? [] : [info?.language ?? p.fallbackLanguage].filter(Boolean);
  const tags = [...lang, ...p.tags].map((t) => `<span>${esc(t)}</span>`).join("");
  const body = `<h3>${esc(p.title)}</h3><p>${p.summary}</p><div class="tags">${tags}</div>`;
  const links = p.links ?? [{ text: "View source", href: "repo" }];
  const cls = ["project", p.color, p.extraClass].filter(Boolean).join(" ");
  const label = p.label ? `${n} · ${p.label}` : n;
  const linkHtml = links
    .map((l, j) => `<a class="${j === 0 ? "project-link" : "project-repo"}" href="${l.href === "repo" ? repoUrl : l.href}" target="_blank" rel="noreferrer">${esc(l.text)} <span>↗</span></a>`)
    .join("");
  return `<article class="${cls}"><div class="project-top"><span>${label}</span><b>●</b></div>${body}<div class="project-actions">${linkHtml}</div></article>`;
}

const infos = await Promise.all(projects.map((p) => repoInfo(p.repo)));
const block = projects.map((p, i) => "      " + card(p, i, infos[i])).join("\n");

const html = readFileSync("index.html", "utf8");
const re = /<!-- projects:start -->[\s\S]*?<!-- projects:end -->/;
if (!re.test(html)) throw new Error("projects markers not found in index.html");
writeFileSync(
  "index.html",
  html.replace(re, () => `<!-- projects:start -->\n${block}\n      <!-- projects:end -->`),
);

if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
console.log(`Rendered ${projects.length} projects`);
