import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /** Разрешаем встраивание каталога в iframe со страницы GitHub Pages (shop/index.html) */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://makaka119911-oss.github.io http://localhost:3000 http://127.0.0.1:3000;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
