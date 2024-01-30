import { Elysia } from "elysia";

const model = "@cf/meta/llama-2-7b-chat-int8";
const endpoint = `https://api.cloudflare.com/client/v4/accounts/${process.env.ACCOUNT_ID}/ai/run/${model}`;
console.log(endpoint);

async function gatherResponse(response) {
  const { headers } = response;
  const contentType = headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json());
  }
  return response.text();
}

const init = {
  headers: {
    "content-type": "application/json;charset=UTF-8",
  },
};

const app = new Elysia()
  .get("/r", ({headers, set, cookie: { name }}: any) => {
      name.value = {
        id: 617,
        name: 'Summoning 101'
    }
    name.httpOnly = true
    return headers
  })
  .get("/", ({ headers }) => {
 return `http://${headers?.host}/ai?prompt='you can ask me any thing.'`
})

  .get("/ai", async ( { query: { prompt } }) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.API_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a friendly assistant" },
          { role: "user", content: prompt },
        ],
      }),
    });
    const body = await gatherResponse(response);
    return new Response(body, init);
  })
  .listen(3000);

console.log(`🦊 Elysia is running at on port ${app.server?.port}...`)
