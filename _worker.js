export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.endsWith('.html') || url.pathname.endsWith('.htm') || url.pathname.endsWith('/')) {
      return new Response("404 Not Found", { status: 404 });
    }

    if (request.method === 'POST' && request.headers.get('Content-Type') === 'application/json') {
      const body = await request.json();

      // Check if the request is for GPT-4 or GPT-4-turbo
      if (body.model === 'gpt-4' || body.model === 'gpt-4-turbo-preview' || body.model === 'gpt-4-vision-preview' || body.model === 'gpt-4-0125-preview' || body.model === 'gpt-4o' || body.model === 'gpt-4-turbo') {
        body.model = 'gpt-4o-mini'; 
      }

      const modifiedRequest = new Request(request.url, {
        headers: request.headers,
        method: request.method,
        body: JSON.stringify(body),
        redirect: 'follow'
      });

      url.host = "api.openai-proxy.org"; 
      return fetch(url, modifiedRequest);
    }

    url.host = "api.openai-proxy.org"; 
    return fetch(url, {
      headers: request.headers,
      method: request.method,
      body: request.body,
      redirect: 'follow'
    });
  }
}
