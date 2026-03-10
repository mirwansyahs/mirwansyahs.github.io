import type { APIRoute } from "astro";
import { NAV_ITEMS, SITE } from "../config/site";

const escapeXml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&apos;");

export const GET: APIRoute = () => {
    const base = SITE.url.replace(/\/$/, "");
    const toolPaths = NAV_ITEMS.filter((item) => item.href.startsWith("/tools/"))
        .map((item) => item.href)
        .sort((a, b) => a.localeCompare(b));

    const paths = ["/", ...toolPaths];
    const uniquePaths = Array.from(new Set(paths));

    const urls = uniquePaths
        .map((path) => {
            const normalized = path === "/" ? "/" : `${path.replace(/\/$/, "")}/`;
            return `  <url><loc>${escapeXml(`${base}${normalized}`)}</loc></url>`;
        })
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
        },
    });
};
