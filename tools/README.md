# Irwansyah Tools

Website tools berbasis `Astro + TypeScript + Tailwind` dengan fokus SEO dan monetisasi AdSense.

## Stack

- Astro (static output)
- TypeScript
- Tailwind CSS v4
- Sitemap + robots.txt

## Struktur Utama

```text
src/
	components/
		AdSlot.astro
		ToolCard.astro
	config/
		site.ts
	layouts/
		BaseLayout.astro
	pages/
		index.astro
		robots.txt.ts
		tools/
			json-viewer.astro
			base64-encode-decode.astro
			base64-to-image.astro
```

Perubahan layout global cukup dilakukan di `src/layouts/BaseLayout.astro` agar semua halaman ikut ter-update.

## Menjalankan Proyek

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
```

Output static ada di `dist/`.

## SEO

- Domain canonical sudah diset ke `https://tools.irwansyah.my.id` di `astro.config.mjs`.
- `@astrojs/sitemap` otomatis generate `sitemap-index.xml` saat build.
- `robots.txt` tersedia di route `/robots.txt`.
- Meta title/description, Open Graph, canonical, dan JSON-LD dipusatkan di `BaseLayout`.

## AdSense

Set environment variable:

```bash
PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
```

Jika belum diset, komponen ad menampilkan placeholder.

Slot iklan dapat diatur pada komponen `AdSlot` di `BaseLayout` atau per halaman.
