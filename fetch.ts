import { Elysia } from 'elysia'
const API_TOKEN='kjszdxXgXNSef1hSTaCUJOk4XM3XYtSB9zq_ByPu';
const ACCOUNT_ID='704dbb90ec029995afeda0f607b2d174'

const model = '@cf/meta/llama-2-7b-chat-int8'
const model2 = '@cf/baai/bge-base-en-v1.5'
const endpoint = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${model2}`

// Can be a string or array of strings]
const stories = [
'This is a story about an orange cloud',
'This is a story about a llama',
'This is a story about a hugging emoji'
];


new Elysia()
    .get('/ai', () => 
        fetch(endpoint, {
            method: 'POST',
            headers: { 
                authorization: `Bearer ${API_TOKEN}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({ text: stories })
        })
    ).listen(3000)
