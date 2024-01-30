import { Elysia } from 'elysia'
import { Stream } from '@elysiajs/stream'

new Elysia()
    .get('/', () => new Stream(async (stream) => {
        stream.send('hello')

        await stream.wait(1000)
        stream.send('world')

        stream.close()
    }))
    .listen(3000)

console.log("🍔 http://localhost:3000/");
