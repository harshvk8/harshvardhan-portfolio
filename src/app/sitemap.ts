import type { MetadataRoute } from "next";
import { projects } from "@/content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/projects",
    "/experience",
    "/skills",
    "/resume",
    "/contact",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...projectRoutes];
}
