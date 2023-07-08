import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";

import Head from "next/head";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <div className={`container mx-auto ${poppins.className}`}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
