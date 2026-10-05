// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// 部署到 Cloudflare Pages（xxx.pages.dev 根路径）：不要设置 base。
// site 等拿到 Cloudflare 分配的 pages.dev 域名后再填回去。
export default defineConfig({
  // site: 'https://ukorii-haoyue.github.io',
  // base: '/my-site',
});
