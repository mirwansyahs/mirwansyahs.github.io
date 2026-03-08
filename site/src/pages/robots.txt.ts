import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
    const base = site?.toString().replace(/\/$/, '') ?? 'https://irwansyah.my.id';

    const body = [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${base}/sitemap.xml`,
        'Sitemap: https://tools.irwansyah.my.id/sitemap-index.xml',
    ].join('\n');

    return new Response(body, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
};
