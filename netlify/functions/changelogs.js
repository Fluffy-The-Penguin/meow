"use strict";

const { fetchUpstreamJson, buildProxyError } = require("../../site-api-proxy");

exports.handler = async function handler(event) {
  const search = event?.rawQueryString ? `?${event.rawQueryString}` : "";

  try {
    const { upstream } = await fetchUpstreamJson(`/api/changelogs${search}`);

    if (!upstream.ok) {
      return {
        statusCode: upstream.status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify(buildProxyError("upstream_failed", upstream.status)),
      };
    }

    const payload = await upstream.json();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=15, stale-while-revalidate=45",
      },
      body: JSON.stringify(payload),
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify(buildProxyError("proxy_unreachable", null, error)),
    };
  }
};
