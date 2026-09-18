import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Overlays from "@/components/Overlays";
import RevealController from "@/components/RevealController";
import { SITE } from "@/lib/seo";
import { StoreProvider } from "@/lib/store";
import { organisationSchema, websiteSchema } from "@/lib/structured-data";
import "./globals.css";
import "./pages.css";

/* Only the weights the stylesheet actually uses — every declared file is
   preloaded, so unused weights cost every visitor bandwidth. */
const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/fraunces-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/fraunces-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

const nunitoSans = localFont({
  src: [
    {
      path: "./fonts/nunito-sans-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/nunito-sans-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/nunito-sans-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-nunito-sans",
  display: "swap",
});

const caveat = localFont({
  src: [
    { path: "./fonts/caveat-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/caveat-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-caveat",
  display: "swap",
});

/* Brush script reserved for the largest hand-lettered headings. */
const caveatBrush = localFont({
  src: [
    {
      path: "./fonts/caveat-brush-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-caveat-brush",
  display: "swap",
});

const HOME_TITLE = "Leaf & Root — Bonsai for a Greener Tomorrow";
const HOME_DESCRIPTION =
  "Leaf & Root is a small bonsai shop bringing nature closer to home with carefully grown bonsai trees for beginners, hobbyists and collectors.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: HOME_TITLE,
    template: "%s — Leaf & Root Bonsai",
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "shopping",
  keywords: [
    "bonsai",
    "bonsai shop",
    "bonsai Philippines",
    "indoor bonsai",
    "bonsai care",
    "buy bonsai online",
    "Quezon City bonsai",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: "/",
    siteName: SITE.name,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Leaf & Root — Small Trees, Big Peace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#F4EFE4",
  colorScheme: "light",
};

/** Preconnect/DNS hints are handled automatically by next/font for local files. */

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${nunitoSans.variable} ${caveat.variable} ${caveatBrush.variable}`}
    >
      <body>
        {/* Runs before the rest of the body parses: gates the scroll-reveal
            styles on JS being available, so content is never hidden by a
            bundle that failed to load. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
        <JsonLd data={[organisationSchema(), websiteSchema()]} />
        <a className="sr-only" href="#main">
          Skip to content
        </a>
        <StoreProvider>
          {/* Everything behind the off-canvas UI lives here so it can be made
              `inert` while a drawer, the menu or search is open. */}
          <div id="page-shell">
            <Header />
            {children}
            <Footer />
          </div>
          <Overlays />
          <RevealController />
        </StoreProvider>
      </body>
    </html>
  );
}
