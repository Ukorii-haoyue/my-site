// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// 两条部署通道自动区分：
//   - Cloudflare Pages（环境变量 CF_PAGES=1）：根域名 ukorii.pages.dev，不设 base
//   - GitHub Pages：项目站 ukorii-haoyue.github.io/my-site/，需要 base '/my-site'
const isCloudflare = !!process.env.CF_PAGES;

export default defineConfig({
  site: isCloudflare
    ? 'https://ukorii.pages.dev'
    : 'https://ukorii-haoyue.github.io',
  base: isCloudflare ? undefined : '/my-site',
});
