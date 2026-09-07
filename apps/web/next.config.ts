import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";
import { fileURLToPath } from "url";

const monorepoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");


const nextConfig: NextConfig = {
  turbopack: {
    root: monorepoRoot,
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);