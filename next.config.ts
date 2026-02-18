import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';
const basePath = process.env.PAGES_BASE_PATH || '';

const nextConfig: NextConfig = {
  // 仅生产环境输出为纯静态站点
  ...(isDev ? {} : { output: "export" }),
  
  // GitHub Pages 等子路径部署
  basePath: basePath,
  assetPrefix: basePath,
  
  // 静态导出时禁用图片优化（需要服务端）
  images: {
    unoptimized: true,
  },
  
  // 添加 trailing slash 以兼容静态托管
  trailingSlash: true,
};

export default nextConfig;
