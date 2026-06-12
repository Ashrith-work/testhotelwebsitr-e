import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import TopStrip from "@/components/TopStrip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BodyWithStage from "@/components/BodyWithStage";
import { site } from "@/data/site";
import { auth } from "@/auth";

// Elegant serif for the hotel name + titles; clean sans-serif for body/nav.
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.location}`,
    template: `%s | ${site.shortName}`,
  },
  description:
    "Neelakurunji Luxury Plantation Bungalow — a supremely luxurious plantation home set amidst the boulders, tea and cardamom slopes of Munnar, Kerala. Far from the maddening crowd.",
  keywords: [
    "Neelakurunji",
    "Munnar resort",
    "plantation bungalow Munnar",
    "luxury stay Kerala",
    "Munnar hotels",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read the session server-side and hand the user to the (client) Navbar so it
  // can render the Sign In button or the profile dropdown without a client-side
  // session fetch.
  const session = await auth();

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} scroll-smooth`}>
      <BodyWithStage>
        <TopStrip />
        <Navbar user={session?.user ?? null} />
        <main>{children}</main>
        <Footer />

        {/*
          HotelTrack tracking snippet — DO NOT REMOVE.
          Renders only when the site ID is configured (set the two
          NEXT_PUBLIC_HOTELTRACK_* env vars in .env.local and in Vercel).
        */}
        {process.env.NEXT_PUBLIC_HOTELTRACK_SITE_ID && (
          <script
            src={`${process.env.NEXT_PUBLIC_HOTELTRACK_APP_URL}/t.js?id=${process.env.NEXT_PUBLIC_HOTELTRACK_SITE_ID}`}
            async
          />
        )}
      </BodyWithStage>
    </html>
  );
}
