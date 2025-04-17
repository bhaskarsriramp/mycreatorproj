const React = require('react');
require('./styles/Home.module.css');
const { BrowserRouter: Router, Routes, Route, Outlet } = require('react-router-dom');

const UserSignup = require('./components/Brand/UserSignup.js');
const UserLogin = require('./components/Brand/UserLogin.js');
const UserSideNavBar = require('./components/Brand/UserSideNavBar.js');
const Support = require('./components/Brand/Support.js');
const Profile = require('./components/Brand/Profile.js');
const ForgotPassword = require('./components/Brand/ForgotPassword.js');
const LandingPage = require('./components/LandingPage.js');
const Pricing = require('./components/Pricing.js');
const Terms = require('./components/Terms.js');
const PrivacyPolicy = require('./components/PrivacyPolicy.js');
const CancellationRefund = require('./components/CancellationRefund.js');
const ShippingPolicy = require('./components/ShippingPolicy.js');
const ContactUs = require('./components/ContactUs.js');
const ProfileSettings = require('./components/Brand/Profile.js');
const AccountDetails = require('./components/Brand/AccountDetails.js');
const GoogleApiDisclosure = require('./components/GoogleApiDisclosure.js');
const YouTubeConnect = require('./components/Brand/YouTubeConnect.js');
const CommentAnalyzer = require('./components/Brand/CommentAnalyzer.js');
const DisclosurePolicy = require('./components/DisclosurePolicy.js');
const TrustCenter = require('./components/TrustCenter.js');
const AboutUs = require('./components/AboutUs.js');
const YouTubeDisclosure = require('./components/YoutubeApiDisclosure.js');
const Security = require('./components/Security.js');

const App = () => {
  return React.createElement('div', { className: 'App' },
    React.createElement('link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Poppins:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500&display=swap', rel: 'stylesheet' }),
    React.createElement('script', { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js' }),
    React.createElement('link', { href: 'https://fonts.googleapis.com/icon?family=Material+Icons', rel: 'stylesheet' }),

    React.createElement(Router, null,
      React.createElement(Routes, null,
        React.createElement(Route, { path: '/', element: React.createElement(LandingPage) }),
        React.createElement(Route, { path: '/login', element: React.createElement(UserLogin) }),
        React.createElement(Route, { path: '/signup', element: React.createElement(UserSignup) }),
        React.createElement(Route, { path: '/forgotPassword', element: React.createElement(ForgotPassword) }),
        React.createElement(Route, { path: '/pricing', element: React.createElement(Pricing) }),
        React.createElement(Route, { path: '/terms', element: React.createElement(Terms) }),
        React.createElement(Route, { path: '/privacy_policy', element: React.createElement(PrivacyPolicy) }),
        React.createElement(Route, { path: '/cancellation_refund', element: React.createElement(CancellationRefund) }),
        React.createElement(Route, { path: '/shipping_policy', element: React.createElement(ShippingPolicy) }),
        React.createElement(Route, { path: '/contact', element: React.createElement(ContactUs) }),
        React.createElement(Route, { path: '/profile', element: React.createElement(ProfileSettings) }),
        React.createElement(Route, { path: '/google_api_disclosure', element: React.createElement(GoogleApiDisclosure) }),
        React.createElement(Route, { path: '/disclosure_policy', element: React.createElement(DisclosurePolicy) }),
        React.createElement(Route, { path: '/trust_center', element: React.createElement(TrustCenter) }),
        React.createElement(Route, { path: '/about_us', element: React.createElement(AboutUs) }),
        React.createElement(Route, { path: '/youtube_api_disclosure', element: React.createElement(YouTubeDisclosure) }),
        React.createElement(Route, { path: '/security', element: React.createElement(Security) }),

        React.createElement(Route, { path: '/creator/*', element: React.createElement(UserSideNavBar) },
          React.createElement(Route, { path: 'support', element: React.createElement(Support) }),
          React.createElement(Route, { path: 'profile', element: React.createElement(Profile) }),
          React.createElement(Route, { path: 'account/details', element: React.createElement(AccountDetails) }),
          React.createElement(Route, { path: 'connect_youtube', element: React.createElement(YouTubeConnect) }),
          React.createElement(Route, { path: 'comment_analyzer', element: React.createElement(CommentAnalyzer) })
        ),

        React.createElement(Route, { path: '/', element: React.createElement(Outlet) })
      )
    )
  );
};

module.exports = App;
