import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ resolve, event }) => {
    const response = await resolve(event);
    // Apply CORS header for API routes
    if (event.url.pathname.startsWith('/api')) {
        let cors = "";
        const originDomain = new URL(event.request.headers.get('origin') || '').hostname;
        cors = `https://${originDomain}`
        // Required for CORS to work
        if (event.request.method === 'OPTIONS' && cors) {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                    'Access-Control-Allow-Origin': cors,
                    'Access-Control-Allow-Headers': '*'
                }
            });
        }

        response.headers.append('Access-Control-Allow-Origin', `*`);
    }

    return response;
};