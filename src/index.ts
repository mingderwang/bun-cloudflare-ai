import { Server } from "bun";


const model = "@cf/meta/llama-2-7b-chat-int8";
const endpoint = `https://api.cloudflare.com/client/v4/accounts/${process.env.ACCOUNT_ID}/ai/run/${model}`;
console.log(endpoint);

async function gatherResponse(response: Response) {
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

export default {
  async fetch(request: Request, server: Server) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.API_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a friendly assistant" },
          { role: "user", content: 'Is Taiwan a country?' },
        ],
      }),
    });
    const body = await gatherResponse(response);
    return new Response(body, init);
  }
}
