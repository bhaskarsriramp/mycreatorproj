require('./styles/Home.module.css');
const { BrowserRouter: Router, Routes, Route, Outlet } = require('react-router-dom');

const UserSignup = require('./components/Brand/UserSignup');
const UserLogin = require('./components/Brand/UserLogin');
const UserSideNavBar = require('./components/Brand/UserSideNavBar');
const Support = require('./components/Brand/Support');
const Profile = require('./components/Brand/Profile');
const ForgotPassword = require('./components/Brand/ForgotPassword');
const LandingPage = require('./components/LandingPage');
const Pricing = require('./components/Pricing');
const Terms = require('./components/Terms');
const PrivacyPolicy = require('./components/PrivacyPolicy');
const CancellationRefund = require('./components/CancellationRefund');
const ShippingPolicy = require('./components/ShippingPolicy');
const ContactUs = require('./components/ContactUs');
const ProfileSettings = require('./components/Brand/Profile');
const AccountDetails = require('./components/Brand/AccountDetails');
const GoogleApiDisclosure = require('./components/GoogleApiDisclosure');
const YouTubeConnect = require('./components/Brand/YouTubeConnect');
const CommentAnalyzer = require('./components/Brand/CommentAnalyzer');
const DisclosurePolicy = require('./components/DisclosurePolicy');
const TrustCenter = require('./components/TrustCenter');
const AboutUs = require('./components/AboutUs');
const YouTubeDisclosure = require('./components/YoutubeApiDisclosure');
const Security = require('./components/Security');


function App() {
  return (
    <div className="App">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Poppins:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>

      <Router>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/login" element={<UserLogin/>}/>
          <Route path="/signup" element={<UserSignup/>}/>
          <Route path="/forgotPassword" element={<ForgotPassword/>}/>
          <Route path="/pricing" element={<Pricing/>}/>
          <Route path="/terms" element={<Terms/>}/>
          <Route path="/privacy_policy" element={<PrivacyPolicy/>}/>
          <Route path="/cancellation_refund" element={<CancellationRefund/>}/>
          <Route path="/shipping_policy" element={<ShippingPolicy/>}/>
          <Route path="/contact" element={<ContactUs/>}/>
          <Route path="/profile" element={<ProfileSettings/>}/>
          <Route path="/google_api_disclosure" element={<GoogleApiDisclosure/>}/>
          <Route path="/disclosure_policy" element={<DisclosurePolicy/>}/>
          <Route path="/trust_center" element={<TrustCenter/>}/>
          <Route path="/about_us" element={<AboutUs/>}/>
          <Route path="/youtube_api_disclosure" element={<YouTubeDisclosure/>}/>
          <Route path="/security" element={<Security/>}/>

          <Route path="/creator/*" element={<UserSideNavBar />}>
            <Route path="support" element={<Support/>}/>
            <Route path="profile" element={<Profile/>}/>
            <Route path="account/details" element={<AccountDetails/>}/>
            <Route path="connect_youtube" element={<YouTubeConnect/>}/>
            <Route path="comment_analyzer" element={<CommentAnalyzer/>}/>
          </Route>

          <Route path="/" element={<Outlet />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
