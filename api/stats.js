"use strict";

const DEFAULT_STATS_URL = "http://de3.bot-hosting.net:20854/api/stats";

async function handler(req, res) {
  const targetUrl = process.env.BOT_STATS_API_URL || DEFAULT_STATS_URL;

  try {
    const upstream = await fetch(targetUrl, {
      headers: { Accept: "application/json" },
    });

    if (!upstream.ok) {
      res.status(upstream.status).setHeader("Cache-Control", "no-store");
      return res.json({ error: "upstream_stats_failed", status: upstream.status });
    }

    const stats = await upstream.json();
    res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=45");
    return res.status(200).json(stats);
  } catch (error) {
    res.status(502).setHeader("Cache-Control", "no-store");
    return res.json({
      error: "stats_proxy_unreachable",
      message: error && error.message ? error.message : String(error),
    });
  }
}

module.exports = handler;
module.exports.default = handler;
