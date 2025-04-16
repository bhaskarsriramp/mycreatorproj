// // import Head from 'next/head'
// import React, { useEffect } from 'react';
// import Navbar from '../components/Navbar'
// import BodyMain from '../components/BodyMain'
// import Accordian from '../components/Accordian'
// import Footer from '../components/Footer'
// import BodyBlocks from '../components/BodyBlocks'
// import { Helmet } from "react-helmet";
// import BodyBlocksTabs from './BodyBlocksTabs';
// // import Script from 'next/script'

// export default function LandingPage() {

//   useEffect(() => {
//     // Ensure dataLayer is defined before calling gtag
//     window.dataLayer = window.dataLayer || [];
//     function gtag() {
//       window.dataLayer.push(arguments);
//     }
//     gtag('js', new Date());
//     gtag('config', 'G-D1X0WBG5EL');
//   }, []);

//   return (

//     <>

//         <Helmet>
//         <title>Turn Audio into Stunning Videos | AudioReel</title>
//         <meta name="description" content="Transform your audio into stunning videos with AI-powered tools. Perfect for creators, speakers, and audiobooks. Create professional videos instantly!" />
//         <meta property="og:title" content="Turn Audio into Stunning Videos | AudioReel" />
//         <meta property="og:description" content="Transform your audio into stunning videos with AI-powered tools. Perfect for creators, speakers, and audiobooks. Create professional videos instantly!" />
//         <meta property="og:type" content="website" />
//         <link rel="canonical" href="https://www.audioreel.io" />
//         <meta name="google-site-verification" content="Y8Lu6AhM03esRTZg_PR1fnHPfEv-QVz70Px3WMg2boc" />
//         <script async src="https://www.googletagmanager.com/gtag/js?id=G-D1X0WBG5EL"></script>

//       </Helmet>

//       <Navbar />
//       <BodyMain />
//       {/* <BodyBlocksTabs /> */}
//       <BodyBlocks />
//       {/* <Accordian /> */}
//       <Footer />
//       {/* <Script async src="https://www.googletagmanager.com/gtag/js?id=G-D0SY7XGY0L"></Script>

//         <Script id="analytics-script" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || [];
//                 function gtag(){
//                 dataLayer.push(arguments);
//                 }
//                 gtag('js', new Date());
//                 gtag('config', 'G-D0SY7XGY0L');`}}></Script> */}

//          </>
//   )
// }

const React = require("react");
const { useEffect, useState } = React;

const Navbar = require("../components/Navbar");
const BodyMain = require("../components/BodyMain");
const BodyBlocks = require("../components/BodyBlocks");
const Footer = require("../components/Footer");

const { Helmet } = require("react-helmet");
const CookieConsent = require("react-cookie-consent");

const { Typography, Stack, useMediaQuery } = require("@mui/material");


export default function LandingPage() {
  const [cookieConsent, setCookieConsent] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (cookieConsent === "accept") {
      // Initialize Google Analytics only if the user accepts cookies
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "G-D1X0WBG5EL");
    }
  }, [cookieConsent]);

  const handleAccept = () => {
    // Save token (or any necessary cookies)
    document.cookie = "user_token=your_token; path=/; max-age=3600"; // Example token
    setCookieConsent("accept");
    console.log("Cookies accepted. Token saved and GA initialized.");
  };

  const handleDecline = () => {
    setCookieConsent("decline");
    console.log("Cookies rejected. GA not initialized.");
  };

  return (
    <>
      <Helmet>
        <title>Turn Audio into Stunning Videos | AudioReel</title>
        <meta
          name="description"
          content="Transform your audio into stunning videos with AI-powered tools. Perfect for creators, speakers, and audiobooks. Create professional videos instantly!"
        />
        <meta
          property="og:title"
          content="Turn Audio into Stunning Videos | AudioReel"
        />
        <meta
          property="og:description"
          content="Transform your audio into stunning videos with AI-powered tools. Perfect for creators, speakers, and audiobooks. Create professional videos instantly!"
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.audioreel.io" />
        <meta
          name="google-site-verification"
          content="Y8Lu6AhM03esRTZg_PR1fnHPfEv-QVz70Px3WMg2boc"
        />
      </Helmet>

      <Navbar />
      <BodyMain />
      <BodyBlocks />
      <Footer />

        <CookieConsent
          location="bottom"
          buttonText="Accept"
          declineButtonText="Reject"
          enableDeclineButton
          cookieName="audioreel_cookie_consent"
          style={{
            background: "#2B373B",
            zIndex: 9999,
            borderTopLeftRadius: "18px",
            borderTopRightRadius: "18px",
            paddingLeft: isMobile ? "" : "22px",
            paddingRight: isMobile ? "" : "32px",
          }}
          buttonStyle={{
            color: "#4e503b",
            fontSize: "14px",
            borderRadius: "16px",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
          declineButtonStyle={{
            color: "#ffffff",
            backgroundColor: "#a40000",
            fontSize: "14px",
            borderRadius: "16px",
          }}
          expires={150}
          onAccept={handleAccept}
          onDecline={handleDecline}
        >
          <Typography sx={{ fontSize: "15px" }}>
            This website uses cookies to enhance the user experience.
            <a
              href="/privacy_policy"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#ffd700",
                textDecoration: "underline",
                fontSize: "15px",
                display: "inline",
                marginLeft: "12px",
              }}
            >
              Learn more
            </a>
          </Typography>
        </CookieConsent>
    </>
  );
}
