Bun.serve({
  fetch(req) {
    const url = new URL(req.url);
    console.log(req.url)
    if (url.pathname === "/") return new Response("Home page!");
    if (url.pathname === "/blog") return new Response("Blog!");
    return new Response("404!");
  },
});
