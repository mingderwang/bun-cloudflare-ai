// bun --hot sse.ts
import { randomUUID } from "node:crypto";
import { EventEmitter } from "node:events";

const sseEvents = new EventEmitter();

export const sse = (data) => {
  sseEvents.emit(
    "sse",
    `id: ${randomUUID()}\ndata: ${JSON.stringify(data)}\n\n`
  );
};

let counter = 0;
setInterval(() => {
  sse({ payload: { date: Date.now(), times: counter++ } });
}, 2000);

export default {
  port: 3000,
  async fetch(req: Request) {
    const stream = new ReadableStream({
      start(controller) {
        sseEvents.once("sse", () => {
          controller.enqueue(`retry: 3000\n\n`);
        });
      },
      pull(controller: ReadableStreamDefaultController) {
        sseEvents.on("sse", (data) => {
          const queue = [Buffer.from(data)];
          const chunk = queue.shift();
          controller.enqueue(chunk);
        });
      },
      cancel(controller: ReadableStreamDefaultController) {
        sseEvents.removeAllListeners("sse");
        controller.close();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/event-stream;charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  },
};
