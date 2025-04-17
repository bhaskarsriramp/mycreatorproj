import React from 'react';
import './styles/Home.module.css';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import UserSignup from './components/Brand/UserSignup.js';
import UserLogin from './components/Brand/UserLogin.js';
import UserSideNavBar from './components/Brand/UserSideNavBar.js';
import Support from './components/Brand/Support.js';
import Profile from './components/Brand/Profile.js';
import ForgotPassword from './components/Brand/ForgotPassword.js';
import LandingPage from './components/LandingPage.js';
import Pricing from './components/Pricing.js';
import Terms from './components/Terms.js';
import PrivacyPolicy from './components/PrivacyPolicy.js';
import CancellationRefund from './components/CancellationRefund.js';
import ShippingPolicy from './components/ShippingPolicy.js';
import ContactUs from './components/ContactUs.js';
import ProfileSettings from './components/Brand/Profile.js';
import AccountDetails from './components/Brand/AccountDetails.js';
import GoogleApiDisclosure from './components/GoogleApiDisclosure.js';
import YouTubeConnect from './components/Brand/YouTubeConnect.js';
import CommentAnalyzer from './components/Brand/CommentAnalyzer.js';
import DisclosurePolicy from './components/DisclosurePolicy.js';
import TrustCenter from './components/TrustCenter.js';
import AboutUs from './components/AboutUs.js';
import YouTubeDisclosure from './components/YoutubeApiDisclosure.js';
import Security from './components/Security.js';



const App = () => {
  return (
    <div className="App">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Poppins:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet" />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      <Router>
        <Routes>
          {/* <Route path="/" element={<LandingPage />} /> */}
          <Route path="/" element={React.createElement(LandingPage)} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy_policy" element={<PrivacyPolicy />} />
          <Route path="/cancellation_refund" element={<CancellationRefund />} />
          <Route path="/shipping_policy" element={<ShippingPolicy />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/google_api_disclosure" element={<GoogleApiDisclosure />} />
          <Route path="/disclosure_policy" element={<DisclosurePolicy />} />
          <Route path="/trust_center" element={<TrustCenter />} />
          <Route path="/about_us" element={<AboutUs />} />
          <Route path="/youtube_api_disclosure" element={<YouTubeDisclosure />} />
          <Route path="/security" element={<Security />} />

          <Route path="/creator/*" element={<UserSideNavBar />}>
            <Route path="support" element={<Support />} />
            <Route path="profile" element={<Profile />} />
            <Route path="account/details" element={<AccountDetails />} />
            <Route path="connect_youtube" element={<YouTubeConnect />} />
            <Route path="comment_analyzer" element={<CommentAnalyzer />} />
          </Route>

          <Route path="/" element={<Outlet />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

