import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from "react-router-dom";





function Pricing() {
  const [isMonthly, setIsMonthly] = useState(true);
  const navigate = useNavigate();


  const togglePricing = () => {
    setIsMonthly(!isMonthly);
  };

  const redirectToSignup = () => {
    navigate(`/signup`);
   
  };

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
        <title>Pricing and Rates | Audioreel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Checkout the prices and rates for Audioreel." />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-D1X0WBG5EL"></script>

        <link rel="icon" href="/favicon.ico" />
      </header>

      <Navbar />

      <div className="container mt-5 mb-5">
        <div className="text-center">
          <div className={`btn-group custom-btn-group ${isMonthly ? 'monthly' : 'yearly'}`} role="group">
            <button
              type="button"
              className={`btn ${isMonthly ? 'price-btn-color-1' : 'price-btn-color-2'} ${isMonthly ? 'active' : ''}`}
              onClick={togglePricing}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`btn ${isMonthly ? 'price-btn-color-1' : 'price-btn-color-2'} ${isMonthly ? '' : 'active'}`}
              onClick={togglePricing}
            >
              Annually (Save 40%)
            </button>
          </div>
        </div>
      </div>

      <div className="container row mx-auto justify-content-center mb-5">


        <div className="col-12 col-md-4 col-lg-4 py-3">
          <div className="border border-primary rounded p-3">
            <div className="row text-center">
              <p><span className="pricing-txt"> Free</span></p>
              <p><span className="pricing-txt-description"> To try out our platform and see if it fits your needs.</span></p>
              <p><span className="pricing-txt-price"> {isMonthly ? '$0' : '$0'}</span></p>
              <p><span className="pricing-txt-caption">Free forever</span></p>
              
            </div>
            <div className="features-details">

<div className="bb-txt-3 cussLine">
<span className="material-icons me-3">switch_video</span>
  <p>AI-powered stock video generation</p>
</div>

<div className="bb-txt-3 cussLine">
<span className="material-icons me-3">list_alt</span>
  <p>Customizable subtitles</p>
</div>


<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">play_circle</span>
  <p>1 video per month</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">ios_share</span>
  <p>Export quality (HD, 4K)</p>
</div>


<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">water_drop</span>
  <p>Watermarked video exports</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">support_agent</span>
  <p>Priority Customer Support</p>
</div>


</div>
            <div className="container my-4 mx-auto d-flex justify-content-center">
              <button className="btn login-btn-grad btn-g-fonts text-white" onClick={redirectToSignup} >Get Started</button>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4 col-lg-4 py-3">
          <div className="border border-primary rounded p-3">
            <div className="row text-center">
              <p><span className="pricing-txt"> Start Up</span></p>
              <p><span className="pricing-txt-description">For individual creators with minimal videos per month.</span></p>

              <p><span className="pricing-txt-price"> {isMonthly ? '$25' : '$29'}</span></p>
              <p><span className="pricing-txt-caption"> {isMonthly ? 'USD • Per month • Billed annually' : 'USD • Per month • Billed monthly'}</span></p>
            
            </div>
            <div className="features-details">

            <div className="bb-txt-3 cussLine">
<span className="material-icons me-3">switch_video</span>
  <p>AI-powered stock video generation</p>
</div>

<div className="bb-txt-3 cussLine">
<span className="material-icons me-3">list_alt</span>
  <p>Customizable subtitles</p>
</div>


<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">play_circle</span>
  <p>12 videos per month</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">ios_share</span>
  <p>Export quality (HD, 4K)</p>
</div>


<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">water_drop</span>
  <p>Watermark-free video exports</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">support_agent</span>
  <p>Priority Customer Support</p>
</div>

</div>
            <div className="container my-4 mx-auto d-flex justify-content-center">
              <button className="btn signup-btn-grad btn-g-fonts text-white" onClick={redirectToSignup}>Get Started</button>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4 col-lg-4 py-3">
          <div className="border border-primary rounded p-3">
            <div className="row text-center">
              <p><span className="pricing-txt"> Advanced</span></p>
              <p><span className="pricing-txt-description">For professionals creators and teams with large video generation needs.</span></p>

              <p><span className="pricing-txt-price"> {isMonthly ? '$45' : '$49'}</span></p>
              <p><span className="pricing-txt-caption"> {isMonthly ? 'USD • Per month • Billed annually' : 'USD • Per month • Billed monthly'}</span></p>

            </div>
            <div className="features-details">

            <div className="bb-txt-3 cussLine">
<span className="material-icons me-3">switch_video</span>
  <p>AI-powered stock video generation</p>
</div>

<div className="bb-txt-3 cussLine">
<span className="material-icons me-3">list_alt</span>
  <p>Customizable subtitles</p>
</div>


<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">play_circle</span>
  <p>30 videos per month</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">ios_share</span>
  <p>Export quality (HD, 4K)</p>
</div>


<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">water_drop</span>
  <p>Watermark-free video exports</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">support_agent</span>
  <p>Priority Customer Support</p>
</div>

</div>
            <div className="container my-4 mx-auto d-flex justify-content-center">
              <button className="btn signup-btn-grad btn-g-fonts text-white" onClick={redirectToSignup}>Get Started</button>
            </div>
          </div>
        </div>



      </div>

      <Footer />
    </>
  );
}

export default Pricing;
