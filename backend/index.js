export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.slice(1).trim();

    // Handle preflight CORS request
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
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
      return await handleRedirect(path, env);
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  },
};

// Handle URL Shortening
async function handleShorten(request, env) {
  try {
    const { url } = await request.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const id = crypto.randomUUID().slice(0, 8);
    await env.LINKS_DB.put(id, url);

    return new Response(
      JSON.stringify({ shortUrl: `https://link-shortener.dkg.workers.dev/${id}` }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}

// Handle Redirect
async function handleRedirect(id, env) {
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing or invalid key" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const originalUrl = await env.LINKS_DB.get(id);
  if (!originalUrl) {
    return new Response(JSON.stringify({ error: "Link not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  return new Response(null, {
    status: 301,
    headers: {
      Location: originalUrl,
      "Access-Control-Allow-Origin": "*",
    },
  });
}
