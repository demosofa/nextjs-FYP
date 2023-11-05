const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	eslint: {
		dirs: ['pages', 'frontend', 'shared', 'backend']
	},
	images: {
		remotePatterns: [
			{
				hostname: 'res.cloudinary.com'
			}
		]
	},
	sassOptions: {
		includePaths: [path.join(__dirname, 'sass')]
	}
	// modularizeImports: {
	//   "react-icons/?(((\\w*)?/?)*)": {
	//     transform: "react-icons/{{matches.[1]}}",
	//     skipDefaultConversion: true,
	//   },
	// },
};

const runtimeCaching = require('next-pwa/cache');

const withPWA = require('next-pwa')({
	dest: 'public',
	skipWaiting: true,
	disable: process.env.NODE_ENV === 'development',
	runtimeCaching
	// buildExcludes: ["/chunks/.*$/"],
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer(withPWA(nextConfig));
