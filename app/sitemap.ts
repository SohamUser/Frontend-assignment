import { createSitemap, siteUrl } from "@/lib/seo";

export default function sitemap() {
  return createSitemap(siteUrl);
}
