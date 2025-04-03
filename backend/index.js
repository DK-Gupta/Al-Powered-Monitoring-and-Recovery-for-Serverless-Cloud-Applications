export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      const path = url.pathname.slice(1).trim(); // Trim to prevent accidental empty strings
  
      if (request.method === "POST" && path === "shorten") {
        return await handleShorten(request, env);
      } else if (request.method === "GET") {
        if (!path) {
          return new Response(JSON.stringify({ error: "No ID provided" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        return await handleRedirect(path, env);
      }
  
      return new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
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
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const id = crypto.randomUUID().slice(0, 8);
      await env.LINKS_DB.put(id, url);
  
      return new Response(JSON.stringify({ shortUrl: `https://link-shortener.dkg.workers.dev/${id}` }), {


        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  
  // Handle Redirect
  async function handleRedirect(id, env) {
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing or invalid key" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    const originalUrl = await env.LINKS_DB.get(id);
    if (!originalUrl) {
      return new Response(JSON.stringify({ error: "Link not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    return Response.redirect(originalUrl, 301);
  }
  