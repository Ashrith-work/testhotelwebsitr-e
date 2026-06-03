/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Unsplash is used ONLY for placeholder imagery. When the owners send
    // real photos, drop them into /public and switch the <Image> src to a
    // local path — these remote patterns can then be removed.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      // Google account profile pictures (Sign in with Google).
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
