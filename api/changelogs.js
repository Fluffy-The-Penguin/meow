"use strict";

const { fetchUpstreamJson, buildProxyError } = require("../site-api-proxy");

async function handler(req, res) {
  const search = new URL(req.url || "/api/changelogs", "http://127.0.0.1").search || "";

  try {
    const { upstream } = await fetchUpstreamJson(`/api/changelogs${search}`);

    if (!upstream.ok) {
      res.status(upstream.status).setHeader("Cache-Control", "no-store");
      return res.json(buildProxyError("upstream_failed", upstream.status));
    }

    const payload = await upstream.json();
    res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=45");
    return res.status(200).json(payload);
  } catch (error) {
    res.status(502).setHeader("Cache-Control", "no-store");
    return res.json(buildProxyError("proxy_unreachable", null, error));
  }
}

module.exports = handler;
module.exports.default = handler;
