import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import Script from "next/script";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Run before paint to prevent theme flash */}
      <Script id="theme-init" strategy="beforeInteractive">{`
        try {
          var t = localStorage.getItem('theme');
          if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch(e) {}
      `}</Script>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
