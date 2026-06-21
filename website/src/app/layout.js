import "./globals.css";
import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar";
import IdleScreen from "@/components/IdleScreen";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "CJ Chien | Photographer & Programmer",
  description:
    "Portfolio of CJ Chien — a multidisciplinary enthusiast specializing in Photography, Programming, and Ceramics.",
  metadataBase: new URL("https://cjchien.com"),
  openGraph: {
    title: "CJ Chien | Photographer & Programmer",
    description:
      "Portfolio of CJ Chien — Photography, Programming, and Ceramics.",
    url: "https://cjchien.com",
    siteName: "CJ Chien",
    locale: "en_US",
    type: "website",
    images: [{ url: "/profile.jpg", width: 1920, height: 742 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CJ Chien | Photographer & Programmer",
    description:
      "Portfolio of CJ Chien — Photography, Programming, and Ceramics.",
    images: ["/profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#090909",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://raw.githubusercontent.com" />
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
        <link
          rel="preconnect"
          href="https://open.spotify.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://i.scdn.co" />
        <link
          rel="preload"
          href="/profile.avif"
          as="image"
          type="image/avif"
          fetchPriority="high"
        />
      </head>
      <body>
        <NavBar />
        {children}
        <IdleScreen />
      </body>
    </html>
  );
}
