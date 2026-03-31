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

const title = escapeXml(truncate(profile.meta.title, 70));
const role = escapeXml(truncate(profile.role, 80));
const summary = escapeXml(truncate(profile.hero.summary, 190));

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
  <text x="120" y="235" fill="#2f2113" font-size="66" font-weight="700" font-family="Georgia, serif">${title}</text>
  <text x="120" y="294" fill="#61492f" font-size="34" font-family="Arial, sans-serif">${role}</text>
  <text x="120" y="392" fill="#61492f" font-size="30" font-family="Arial, sans-serif">${summary}</text>

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
