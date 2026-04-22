"use strict";

const DEFAULT_STATS_URL = "http://fi6.bot-hosting.net:21448/api/stats";

function resolveUpstreamUrl(pathname, env = process.env) {
  const baseUrl = env.BOT_API_BASE_URL || env.BOT_STATS_API_URL || DEFAULT_STATS_URL;
  return new URL(pathname, baseUrl).toString();
}

async function fetchUpstreamJson(pathname, env = process.env) {
  const targetUrl = resolveUpstreamUrl(pathname, env);
  const upstream = await fetch(targetUrl, {
    headers: { Accept: "application/json" },
  });

  return { upstream, targetUrl };
}

function buildProxyError(code, upstreamStatus = null, error = null) {
  if (code === "upstream_failed") {
    return { error: "upstream_request_failed", status: upstreamStatus };
  }

  return {
    error: "upstream_proxy_unreachable",
    message: error && error.message ? error.message : String(error),
  };
}

module.exports = {
  DEFAULT_STATS_URL,
  resolveUpstreamUrl,
  fetchUpstreamJson,
  buildProxyError,
};
