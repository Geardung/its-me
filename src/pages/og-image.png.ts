import type { APIRoute } from "astro";
import { Resvg } from "@resvg/resvg-js";
import { profile } from "../data/profile";

export const prerender = true;

const WIDTH = 1200;
const HEIGHT = 630;

const escapeXml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const truncate = (value: string, maxLength: number): string =>
  value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value;

const wrapLines = (
  value: string,
  maxLineLength: number,
  maxLines: number,
): string[] => {
  const words = value.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= maxLineLength) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      lines.push(word.slice(0, maxLineLength));
      currentLine = word.slice(maxLineLength);
    }

    if (lines.length >= maxLines) {
      break;
    }
  }

  if (lines.length < maxLines && currentLine) {
    lines.push(currentLine);
  }

  if (lines.length > maxLines) {
    lines.length = maxLines;
  }

  if (words.length && lines.length === maxLines) {
    const plain = lines.join(" ");
    if (plain.length < value.length) {
      lines[maxLines - 1] = truncate(lines[maxLines - 1], maxLineLength - 2);
      lines[maxLines - 1] = `${lines[maxLines - 1]}...`;
    }
  }

  return lines.map((line) => escapeXml(line));
};

const buildTspans = (
  lines: string[],
  x: number,
  startY: number,
  lineHeight: number,
): string =>
  lines
    .map((line, index) => `<tspan x="${x}" y="${startY + index * lineHeight}">${line}</tspan>`)
    .join("");

const titleLines = wrapLines(profile.meta.title, 30, 2);
const roleLines = wrapLines(profile.role, 52, 2);
const summaryLines = wrapLines(profile.hero.summary, 68, 2);

const titleY = 200;
const roleY = titleY + titleLines.length * 60 + 8;
const summaryY = roleY + roleLines.length * 36 + 26;

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f4e8d0"/>
      <stop offset="0.5" stop-color="#efe0c2"/>
      <stop offset="1" stop-color="#dcc29a"/>
    </linearGradient>
    <linearGradient id="accent" x1="120" y1="130" x2="1060" y2="510" gradientUnits="userSpaceOnUse">
      <stop stop-color="#8e5320" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#6b3e17" stop-opacity="0.06"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)" />
  <rect x="48" y="48" width="1104" height="534" rx="40" fill="url(#accent)" />
  <rect x="72" y="72" width="1056" height="486" rx="32" fill="rgba(255, 248, 236, 0.74)" stroke="rgba(108, 70, 29, 0.22)" stroke-width="2"/>

  <text x="120" y="148" fill="#8e5320" font-size="30" font-family="Arial, sans-serif" letter-spacing="1.8">engineer://profile</text>
  <text fill="#2f2113" font-size="56" font-weight="700" font-family="Georgia, serif">${buildTspans(titleLines, 120, titleY, 60)}</text>
  <text fill="#61492f" font-size="32" font-family="Arial, sans-serif">${buildTspans(roleLines, 120, roleY, 36)}</text>
  <text fill="#61492f" font-size="24" font-family="Arial, sans-serif">${buildTspans(summaryLines, 120, summaryY, 32)}</text>

  <rect x="120" y="462" width="424" height="64" rx="32" fill="#6b3f17"/>
  <text x="154" y="504" fill="#fff5ea" font-size="28" font-family="Arial, sans-serif">Python Backend • QA Mindset</text>

  <text x="890" y="505" fill="#8e5320" font-size="28" font-family="Arial, sans-serif">t.me/old6oy</text>
</svg>
`;

export const GET: APIRoute = async () => {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: WIDTH,
    },
  });

  const image = resvg.render();
  const pngData = image.asPng();

  return new Response(pngData, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
