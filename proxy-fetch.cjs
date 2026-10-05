// proxy-fetch.cjs —— Node 启动预加载脚本（通过 package.json 的 --require 注入）
//
// 作用：把 Node 内的 fetch 包装成"自动走本地代理"，解决本机 Node 直连
// Supabase 被网络重置（ECONNRESET）导致博客/电影/书籍等页面数据为空的问题。
//
// 行为：
//   1. 代理地址：优先取环境变量 HTTPS_PROXY / SUPABASE_PROXY，默认 http://127.0.0.1:7890（Clash 默认端口）
//   2. 同步启用：require 时立即替换 fetch（无竞态，Astro 第一次取数前必定生效）
//   3. 异步兜底：仅当代理端口明确拒绝连接（ECONNREFUSED）时才恢复直连
//      （超时不作数，避免构建启动期事件循环繁忙导致误判；适用于 CI / 服务器）
//   4. 仅影响 Node 进程内的 fetch，浏览器端（管理后台）不受影响

const net = require("node:net");

const PROXY =
  process.env.HTTPS_PROXY ||
  process.env.SUPABASE_PROXY ||
  "http://127.0.0.1:7890";

function parseProxy(value) {
  try {
    const url = new URL(
      value.startsWith("http") ? value : "http://" + value
    );
    return {
      host: url.hostname,
      port: Number(url.port) || 7890,
    };
  } catch {
    return null;
  }
}

const proxy = parseProxy(PROXY);
if (!proxy) return;

try {
  // 同步启用代理（必须用安装版 undici 自带的 fetch 来包装，
  // 否则 ProxyAgent 与 Node 内置 fetch 的内部 undici 版本不同，
  // 会报 "invalid onRequestStart method"）
  const undici = require("undici");
  const agent = new undici.ProxyAgent({
    uri: `http://${proxy.host}:${proxy.port}`,
  });

  const originalFetch = globalThis.fetch;
  globalThis.fetch = (input, init) =>
    undici.fetch(input, { ...(init || {}), dispatcher: agent });

  console.log(
    `[proxy-fetch] ${new Date().toISOString()} 已启用代理 http://${proxy.host}:${proxy.port}`
  );

  // 异步兜底：仅当代理端口明确拒绝连接（ECONNREFUSED）时才恢复直连，
  // 例如 CI / 服务器上没有本地代理。超时不作数（避免构建启动期
  // 事件循环繁忙导致的误判）。
  const socket = net.connect({ host: proxy.host, port: proxy.port });
  socket.setTimeout(1500, () => socket.destroy());
  socket.once("connect", () => socket.destroy());
  socket.once("error", (error) => {
    if (error.code === "ECONNREFUSED") {
      globalThis.fetch = originalFetch;
      console.warn(
        `[proxy-fetch] ${new Date().toISOString()} 代理 ${proxy.host}:${proxy.port} 拒绝连接，已退回直连`
      );
    } else {
      console.warn(
        `[proxy-fetch] ${new Date().toISOString()} 代理探测异常(${error.code})，保持代理`
      );
    }
  });
} catch (error) {
  console.warn("[proxy-fetch] undici 不可用，保持直连:", error.message);
}
