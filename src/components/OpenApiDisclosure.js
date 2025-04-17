import React, { useEffect } from 'react';
import Navbar from './Navbar'
import Footer from './Footer'


function OpenApiDisclosure() {

     useEffect(() => {
          // Ensure dataLayer is defined before calling gtag
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            window.dataLayer.push(arguments);
          }
          gtag('js', new Date());
          gtag('config', 'G-D1X0WBG5EL');
        }, []);

  return (
   <>

      <header>
        <title>Security and Data Protection | Audioreel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-D1X0WBG5EL"></script>

      </header>
   <Navbar />


    <div className="container">

        <div className = "google-api-disclosure-text">Open API Disclosure</div>

        <div className = "google-api-disclosure-text-desc">Audioreel's use and transfer of information received from Open APIs to any other app will adhere to <span className="span-txt-70"><a href="https://openai.com/policies/" target="_blank" style={{ textDecoration : 'none', color : 'blue'}}>Open API Services User Data Policy</a></span>, including the Limited Use requirements.</div>
    </div>
    <Footer />
   </>
  )
}

export default OpenApiDisclosure