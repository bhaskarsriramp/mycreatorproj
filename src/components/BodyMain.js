const React = require('react');
const { useEffect } = require('react');
const { Link } = require('react-router-dom');
const { useMediaQuery, useTheme } = require('@mui/material');
const AOS = require('aos'); // Import AOS
require('aos/dist/aos.css'); // Import AOS CSS

// Icons (feel free to import any icons you like, here I'm using emoji icons for simplicity)
import { FaThumbsUp, FaHeart, FaRegSmile, FaAngry } from 'react-icons/fa';

const BodyMain = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    AOS.init({
      duration: 1200, // Animation duration in ms
      once: true, // Animation will run once
    });
  }, []);

  return (
    <>
      <div className="main-hero-box" style={{ position: 'relative', overflow: 'hidden' }}>

        <div className="main-hero-cutom-div">

          <div className="mx-auto row">

            <div className="col-md-12 col-lg-12">

              <h1
                className="txt-2"
                style={{ color: '#09122C' }}
                data-aos="fade-up" // Fade-up effect for the header
              >
                Understand <span style={{ display: 'inline', color: '#E52020' }}>Comments.</span> Connect <span style={{ display: 'inline', color: '#0118D8' }}>Better.</span>
                <br />
              </h1>

              <h2
                className="txt-4"
                data-aos="fade-up" // Fade-up effect for subheading
                data-aos-delay="200" // Delay for the subheading animation
              >
                Understand your audience, optimize content, and grow smarter — all in one place.
              </h2>

            </div>

            {/* Emojis/Sentiment Icons */}
            <div className="emoji-container" style={{ position: 'absolute', top: isSmallScreen ? '25%' : '20%', left: '10%', animation: 'bounce 6s infinite' }} data-aos="zoom-in" data-aos-delay="400">
              <FaRegSmile size={40} color="#2DAA9E" />
            </div>

            <div className="emoji-container" style={{ position: 'absolute', top: isSmallScreen ? '12%' : '35%', left: isSmallScreen ? '70%' : '72%', animation: 'bounce 2s 2' }} data-aos="zoom-in" data-aos-delay="600">
              <FaThumbsUp size={30} color="#4CAF50" />
            </div>

            {/* Rocket and Star with one-time rotation */}
            <div className="emoji-container" style={{ position: 'absolute', top: isSmallScreen ? '40%' : '45%', left: isSmallScreen ? '75%' : '82%', animation: 'rotateOnce 2s ease-in-out' }} data-aos="fade-in" data-aos-delay="800">
              <FaHeart size= { isSmallScreen ? 20 : 40} color="#E52020" />
            </div>

            <div className="emoji-container" style={{ position: 'absolute', top: isSmallScreen ? '85%' : '85%', left: isSmallScreen ? '80%' :'90%', animation: 'rotateOnce 2s ease-in-out' }} data-aos="fade-in" data-aos-delay="1000">
              <FaAngry size={25} color="#FFC107" />
            </div>

            {/* More Emojis/Sentiment Icons */}
            <div className="emoji-container" style={{ position: 'absolute', top: '70%', left: '5%', animation: 'float 4s ease-in-out infinite' }} data-aos="fade-in" data-aos-delay="1200">
              <span role="img" aria-label="celebrate">🎉</span>
            </div>

            <div className="emoji-container" style={{ position: 'absolute', top: '60%', left: '20%', animation: 'float 4s ease-in-out infinite' }} data-aos="zoom-in" data-aos-delay="1400">
              <span role="img" aria-label="smile">😊</span>
            </div>

            <div className="col-12 col-md-12 get-started-button-credit-card mt-4">
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button
                  className="btn signup-btn-grad btn-g-fonts"
                  data-aos="zoom-in" // Zoom-in effect for the button
                  data-aos-delay="1600" // Delay for the button animation
                >
                  Try for free
                </button>
              </Link>
            </div>

          </div>

        </div>

      </div>

      <style jsx>{`
        /* Keyframes for Emoji Animations */
        @keyframes bounce {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-30px);
            opacity: 0.7;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Rotate Animation for Rocket and Star (One-time rotation) */
        @keyframes rotateOnce {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Floating animation for celebration emoji */
        @keyframes float {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-40px);
            opacity: 0.6;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

module.exports = BodyMain;
