import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	reactCompiler: true,
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "images.unsplash.com" },
			{ protocol: "https", hostname: "images.ctfassets.net" },
			{ protocol: "https", hostname: "cdn.shopify.com" },
			{
				protocol: "https",
				hostname: "pub-f0a6dec73e084e83be3f5ea518ee5da7.r2.dev",
			},
			{ protocol: "https", hostname: "img.vietqr.io" },
		],
	},
};

export default nextConfig;
