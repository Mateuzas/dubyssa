/**
 * Resolves general site media (logos, hero images/video, lookbook shots —
 * anything NOT managed through the product catalog's upload flow) to the
 * right source for the current environment.
 *
 * - In dev (`next dev`), files are served straight from
 *   `public/dev-media/<path>`. That folder is gitignored, so drop raw files
 *   there to preview them on localhost without ever committing them.
 * - In production, the same relative `<path>` is read from the `site-media`
 *   Supabase Storage bucket. Upload the file there under the identical path
 *   before/when you deploy — see the project README for the upload steps.
 *
 * Product photos should keep going through the existing admin upload flow
 * (`uploadProductImage` in admin/products/actions.ts), which already stores
 * a full Supabase URL per product — this helper is only for static assets
 * referenced directly in components.
 */
const SITE_MEDIA_BUCKET = "site-media";

export function siteMedia(path: string): string {
  // Encode each path segment individually (not the slashes themselves) —
  // several filenames here have spaces/parentheses in them (e.g. AI-export
  // filenames), which must be percent-encoded for the Supabase Storage URL
  // to resolve correctly in production.
  const cleanPath = path
    .replace(/^\/+/, "")
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  if (process.env.NODE_ENV === "development") {
    return `/dev-media/${cleanPath}`;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/${SITE_MEDIA_BUCKET}/${cleanPath}`;
}
