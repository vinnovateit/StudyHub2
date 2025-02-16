import "./globals.css";
import Script from 'next/script';
import { Fragment } from 'react';
import NextHead from 'next/head';
import NAVBAR from "../components/navbar"
import FOOTER from "../components/footer"
import { Poppins, IBM_Plex_Mono } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["100"],
  variable: "--font-ibm-plex-mono",
});


export const metadata = {
  title: "StudyHub by VinnovateIT",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Fragment>
        <NextHead>
          <script
            data-partytown-config
            dangerouslySetInnerHTML={{
              __html: `
            partytown = {
              lib: "/_next/static/~partytown/",
              debug: true
            };
          `,
            }}
          />

          <link rel="icon" type="image/png" href="/img/sglogofav.png" />

          <meta name="author" content="VinnovateIT" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta
            name="description"
            content="The guide for your CATs and FATs - StudyHub"
          />
          <meta name="theme-color" content="#17a2b8" />

          {/* Facebook Meta Tags */}
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="StudyHub - The guide for your CATs and FATs."
          />
          <meta
            property="og:description"
            content="The best resources and materials to help ace college and university examinations and  challenges."
          />
          <meta
            property="og:image"
            content="https://studyhub.vinnovateit.com/img/sglogofav.png"
          />
          <meta property="og:url" content="https://studyhub.vinnovateit.com/" />
          <meta property="og:site_name" content="StudyHub" />

          {/* Twitter Meta Tags */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="StudyHub" />
          <meta
            name="twitter:title"
            content="StudyHub - The guide for your CATs and FATs."
          />
          <meta
            name="twitter:description"
            content="The best resources and materials to help ace college and university examinations and  challenges."
          />
          <meta name="twitter:creator" content="@Sriesh_Agrawal" />
          <meta
            name="twitter:image"
            content="https://studyhub.vinnovateit.com/img/sglogofav.png"
          />


          {/* End Meta Tags */}

        </NextHead>
      </Fragment>
      <body className={`${poppins.variable} ${ibmPlexMono.variable}`}>
        <NAVBAR></NAVBAR>
        {children}
        <FOOTER></FOOTER>
        <Script
          src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://code.jquery.com/jquery-3.5.1.js"
          integrity="sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc="
          crossOrigin="anonymous"
        />
        <Script
          src="https://kit.fontawesome.com/695fbc93f3.js"
          crossOrigin="anonymous"
        />
        <Script rel="preload" strategy="beforeInteractive" src="https://unpkg.com/css-doodle@0.14.2/css-doodle.min.js" />  
      </body>
    </html>
  );
}
