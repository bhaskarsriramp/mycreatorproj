const Navbar = require('./Navbar');
const React = require('react');
const Footer = require('./Footer');

const { Box, Typography, useMediaQuery } = require('@mui/material');


function PrivacyPolicy() {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>

<header>
        <title>Privacy Policy | Creator Console</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </header>


      <Navbar />
      <Box sx={{ px: isMobile ? 3 : 10, py: isMobile ? 5 : 10, mt: 8 }}>
        <Typography variant={isMobile ? 'h4' : 'h3'} gutterBottom fontWeight={600}>
          Privacy Policy
        </Typography>

        <Typography variant="body1" gutterBottom>
          Last updated on Dec 29th, 2024
        </Typography>

        <Typography variant="body1" paragraph>
          At Creator Console, your privacy is not just a responsibility – it's a priority. We are committed to ensuring that your privacy is protected. Should we request any information that can identify you while using our platform, you can rest assured it will only be used in accordance with this privacy statement.
        </Typography>

        <Typography variant="body1" paragraph>
          Creator Console (Linck One Enterprises) may revise this policy periodically by updating this page. We recommend checking this page regularly to ensure you remain satisfied with any modifications.
        </Typography>

        <Typography variant="h5" gutterBottom fontWeight={600}>What We Collect</Typography>
        <ul>
          <li>Name and job title</li>
          <li>Contact details, including email address</li>
          <li>Demographic information (e.g., postcode, preferences, interests)</li>
          <li>Other relevant data for surveys, feedback, or offers</li>
        </ul>

        <Typography variant="h5" gutterBottom fontWeight={600}>How We Use the Information</Typography>
        <ul>
          <li>To better understand your needs and enhance our services</li>
          <li>Internal record keeping and analytics</li>
          <li>Improving our product offerings</li>
          <li>Sending updates, new features, or promotional content via email (only if permitted)</li>
          <li>Market research outreach by email, phone, or mail</li>
          <li>Personalizing our platform according to your interests</li>
        </ul>

        <Typography variant="h5" gutterBottom fontWeight={600}>Data Security</Typography>
        <Typography variant="body1" paragraph>
          We implement robust security measures to safeguard your information. These include advanced encryption protocols, secure data storage, access control mechanisms, and regular audits to prevent unauthorized access or disclosure.
        </Typography>

        <Typography variant="h5" gutterBottom fontWeight={600}>Cookies & Tracking</Typography>
        <Typography variant="body1" paragraph>
          A cookie is a small file stored on your computer's hard drive. Cookies help us monitor traffic and personalize your experience. We only use this data for analytical purposes and never share it externally.
        </Typography>

        <ul>
          <li>Cookies help our website respond to you as an individual</li>
          <li>We use traffic log cookies to identify popular pages</li>
          <li>Data is used to optimize our website's content and functionality</li>
          <li>No cookie gives us access to your computer or personal data</li>
        </ul>

        <Typography variant="body1" paragraph>
          You can choose to accept or decline cookies. Most browsers accept them by default, but you can modify this behavior via browser settings.
        </Typography>

        <Typography variant="h5" gutterBottom fontWeight={600}>Managing Your Personal Data</Typography>
        <ul>
          <li>You may limit the use of your data by adjusting settings when filling out forms</li>
          <li>You can unsubscribe from direct marketing anytime by emailing us at support@creatorconsole.co</li>
          <li>We do not sell, distribute, or lease your data to third parties unless we have your explicit permission or are required by law</li>
          <li>We may occasionally send promotional information about third parties if you opt in</li>
        </ul>

        <Typography variant="body1" paragraph>
          If you believe any information we hold is incorrect or incomplete, please write to or email us. We will promptly correct any inaccuracies.
        </Typography>
      </Box>
      <Footer />
    </>
  );
}


module.exports = PrivacyPolicy;
