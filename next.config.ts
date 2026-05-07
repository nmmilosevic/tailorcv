import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : undefined,
  basePath: isGithubPages ? "/tailorcv" : undefined,
  assetPrefix: isGithubPages ? "/tailorcv/" : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: isGithubPages,
};

export default nextConfig;
