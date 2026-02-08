import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  compress: true,
  // 禁用图片优化以移除重型依赖 sharp (其二进制文件超过 10MB，会导致 HF 部署失败)
  images: {
    unoptimized: true,
  },
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild',
      'node_modules/webpack',
      'node_modules/terser',
      'node_modules/typescript',
      'node_modules/prettier',
      'node_modules/eslint',
    ],
  },
};

export default nextConfig;
