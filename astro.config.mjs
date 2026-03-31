import { defineConfig } from "astro/config";

const site =
  process.env.SITE_URL ??
  process.env.PUBLIC_SITE_URL ??
  "https://hi.tedeshi.ru";

export default defineConfig({
  output: "static",
  site,
});
