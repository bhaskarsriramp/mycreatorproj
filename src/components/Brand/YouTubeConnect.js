const React = require("react");
const { GoogleOAuthProvider } = require("@react-oauth/google");
require("react-toastify/dist/ReactToastify.css");

const ConnectYoutubeChannel = require("./ConnectYoutubeChannel");




const CLIENT_ID = "1065806162563-l3l8jh235enot489m5da9hhefjiclv41.apps.googleusercontent.com"; // Replace with your Google OAuth Client ID

const YoutubeAuth = () => {
  
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>

         <ConnectYoutubeChannel />
    
    
    </GoogleOAuthProvider>
  );
};

module.exports = YoutubeAuth;

