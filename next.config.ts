import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 输出为纯静态站点
  output: "export",
  
  // 静态导出时禁用图片优化（需要服务端）
  images: {
    unoptimized: true,
  },
  
  // 添加 trailing slash 以兼容静态托管
  trailingSlash: true,
};

export default nextConfig;
