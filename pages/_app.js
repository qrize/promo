import { useEffect } from 'react';
import Script from 'next/script';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as gtag from '../lib/gtag';
import '../styles/globals.scss';

const App = ({ Component, pageProps }) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      <Head>
        <title>Qrize | Tiny QR codes for your web pages</title>
        <meta name="keywords" content="qr code tiny url shortener script integrate" />
        <meta
          name="description"
          content="QR code and URL shortener got married. Create tiny QR codes for your web-pages"
        />
        <meta name="robots" content="index,follow" />
        <meta name="viewport" content="width=device-width" />
        <meta name="author" content="Serhii Holinei" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Component {...pageProps} />
    </>
  );
};

export default App;
