import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";
import ConnectYoutubeChannel from "./ConnectYoutubeChannel";



const CLIENT_ID = "1065806162563-l3l8jh235enot489m5da9hhefjiclv41.apps.googleusercontent.com"; // Replace with your Google OAuth Client ID

const YoutubeAuth = () => {
  
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>

         <ConnectYoutubeChannel />
    
    
    </GoogleOAuthProvider>
  );
};

export default YoutubeAuth;
