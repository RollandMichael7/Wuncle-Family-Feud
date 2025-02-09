import "../css/global.css";
import "../css/scroll-bg.css";
import "../css/prism.css";
import ThemeProvider from "@/components/ThemeProvider";
import Head from "next/head";
import Script from "next/script";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Standard Favicons */}
        <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon/icon.svg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/icon.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon/icon.png" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon.png" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#c94343" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />

        {/* Web App Manifest */}
        <link rel="manifest" href="/favicon/manifest.json" />

        {/* Theme Colors */}
        <meta name="theme-color" content="#c94343" />
        <meta name="apple-mobile-web-app-title" content="FriFeud" />
        <meta name="application-name" content="Friendly Feud" />
        {/* Prevent unloaded theme on page refresh causing white flash if dark theme */}
      </Head>
      <Script
        id="theme-loader"
        dangerouslySetInnerHTML={{
          __html: `
          var theme = localStorage.getItem('theme') || 'default'
          document.documentElement.classList.add(theme)
        `,
        }}
      />
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
