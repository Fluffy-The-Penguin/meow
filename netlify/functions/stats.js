"use strict";

const DEFAULT_STATS_URL = "http://fi6.bot-hosting.net:21448/api/stats";

exports.handler = async function handler() {
  const targetUrl = process.env.BOT_STATS_API_URL || DEFAULT_STATS_URL;

  try {
    const response = await fetch(targetUrl, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return {
        statusCode: 502,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify({ error: "upstream_stats_failed", status: response.status }),
      };
    }

    const stats = await response.json();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=15, stale-while-revalidate=45",
      },
      body: JSON.stringify(stats),
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({
        error: "stats_proxy_unreachable",
        message: error && error.message ? error.message : String(error),
      }),
    };
  }
};
