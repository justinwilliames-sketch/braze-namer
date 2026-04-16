import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://namer.yourorbit.team", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: "https://namer.yourorbit.team/login", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: "https://namer.yourorbit.team/signup", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
