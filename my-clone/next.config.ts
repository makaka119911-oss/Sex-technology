import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Standalone не задаём: на Vercel стандартная сборка; env и serverless стабильнее */
  /** Разрешаем встраивание каталога в iframe с основного сайта */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://makaka119911-oss.github.io https://сексология.com https://www.сексология.com https://xn--c1adkgfrbtc9l.com https://www.xn--c1adkgfrbtc9l.com http://localhost:3000 http://127.0.0.1:3000;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
