import { createRobots, siteUrl } from "@/lib/seo";

export default function robots() {
  return createRobots(siteUrl);
}
