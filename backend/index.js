export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.slice(1).trim();

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method === "POST" && path === "shorten") {
      return await handleShorten(request, env);
    } else if (request.method === "GET") {
      if (!path) {
        return new Response(JSON.stringify({ error: "No ID provided" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
      return await handleRedirect(path, request, env);
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};

async function handleShorten(request, env) {
  try {
    const { url } = await request.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const id = crypto.randomUUID().slice(0, 8);
    await env.LINKS_DB.put(id, url);

    return new Response(
      JSON.stringify({ shortUrl: `http://localhost:8787/${id}` }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

async function handleRedirect(id, request, env) {
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing or invalid key" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const originalUrl = await env.LINKS_DB.get(id);
  if (!originalUrl) {
    await env.AI_MONITOR.put(`anomaly-${Date.now()}`, JSON.stringify({
      id,
      timestamp: new Date().toISOString(),
      reason: "Link not found",
      sourceIP: request.headers.get("CF-Connecting-IP") || "unknown"
    }));

    return new Response(JSON.stringify({ error: "Link not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const userAgent = request.headers.get("User-Agent") || "unknown";

  try {
    const aiRes = await fetch("https://ai-services-6p0b.onrender.com/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        short_code: id,
        ip,
        user_agent: userAgent
      }),
    });

    const aiData = await aiRes.json();

    if (aiData?.recovery_action?.action === "blocked") {
      return new Response(JSON.stringify({
        error: "Access blocked by AI",
        reason: aiData.recovery_action.reason || "Suspicious activity"
      }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  } catch (err) {
    console.error("AI Service error:", err.message);
  }

  return new Response(null, {
    status: 301,
    headers: {
      Location: originalUrl,
      "Access-Control-Allow-Origin": "*",
    },
  });
}
