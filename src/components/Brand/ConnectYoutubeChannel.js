const React = require("react");
const { useEffect, useState } = React;

const { GoogleOAuthProvider } = require("@react-oauth/google");
const axios = require("axios");
const { useNavigate } = require("react-router-dom");
const { toast, ToastContainer } = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");

const {
  Box,
  CircularProgress,
  Stack,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
} = require("@mui/material");

const youtube_logo = require("../../images/youtube_3991722.png");


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const YoutubeAuth = () => {
  const [isValid, setIsValid] = useState(false); // null means loading, true means valid, false means invalid
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile view



  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      exchangeCodeForToken(code);
    }

  }, []);
  

  const exchangeCodeForToken = async (code) => {
    try {

      setLoading(true);
      const response = await axios.post('/api/usersOn/connect_youtube', { code }, { withCredentials: true });
     if(response.data.valid){
        setIsValid(true);
        setLoading(false);
      navigate('/creator/comment_analyzer');

     }
      
    } catch (error) {
      if (error.response) {
                               const { status } = error.response;
                         
                               if (status === 401 || 400 ) {
                                 setLoading(false);
                                 toast.warning("Session expired, please login again!");
                                 setTimeout(() => {
                                   navigate('/login');
                                   
                                 }, 2000);
                               }
    
                               else {
                                   setLoading(false);
                                   toast.warning("Network error, please try again later!");
                               }
                             } else {

                               setLoading(false);
                               toast.warning("Network error, please try again later!");
           
                             }

    }
  };

  // Redirect user to YouTube OAuth Consent Screen
  const handleLogin = () => {
    const redirectUri = encodeURIComponent("https://creatorconsole.co/creator/connect_youtube");
    const scopes = encodeURIComponent("https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/youtube.force-ssl");

    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code&access_type=offline&prompt=consent`;

    window.location.href = authUrl; // Redirect user to YouTube authorization page
};


  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
        
        {loading ? (
  <Box display="flex" justifyContent="center" alignItems="center" height={150}>
    <CircularProgress />
  </Box>
) : (
  !isValid && isMobile ? (
    <div style={{ marginTop : '22px'}}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '4px',
          py: 2,
          px: 2,
          backgroundColor: '#EFEFEF'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar alt="YouTube channel" src={youtube_logo} sx={{ width: 24, height: 24 }} />
          <Typography sx={{ fontSize: '18px', fontWeight: 500 }}>YouTube</Typography>
        </Stack>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: 'fit-content',
            border: '1px solid grey',
            borderRadius: '4px',
            px: 1,
            py: '2px',
            cursor: 'pointer',
            ":hover": { backgroundColor: "#D6D6D6" }
          }}
        >
          <Typography sx={{ fontSize: '10px', fontWeight: 500 }}>Need Help?</Typography>
        </Box>
      </Box>

      <Stack mt={3} mb={3}>
        <Typography sx={{ fontSize: '15px', fontWeight: 500, mb: '4px' }}>Connect to YouTube</Typography>
        <Typography sx={{ fontSize : '14px'}}>
          To connect your YouTube channel, click the button below and log in with the Gmail account associated with it.
        </Typography>
      </Stack>

      <Box
        onClick={handleLogin}
        sx={{
          width: 'fit-content',
          px: '12px',
          py: '6px',
          backgroundColor: '#211C84',
          cursor: "pointer",
          borderRadius: '4px'
        }}
      >
        <Typography sx={{ fontSize: '12px', color: '#FFFFFF' }}>Connect YouTube</Typography>
      </Box>
    </div>
  ) : (
    <div style={{ padding: "40px" }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '4px',
          py: 3,
          px: 3,
          backgroundColor: '#EFEFEF'
        }}
      >
        <Stack direction="row" spacing={2}>
          <Avatar alt="YouTube channel" src={youtube_logo} sx={{ width: 28, height: 28 }} />
          <Typography sx={{ fontSize: '22px', fontWeight: 500 }}>YouTube</Typography>
        </Stack>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: 'fit-content',
            border: '1px solid grey',
            borderRadius: '4px',
            px: 1,
            py: '2px',
            cursor: 'pointer',
            ":hover": { backgroundColor: "#D6D6D6" }
          }}
        >
          <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>Need Help?</Typography>
        </Box>
      </Box>

      <Stack spacing={1} mt={3} mb={3}>
        <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>Connect to YouTube</Typography>
        <Typography>
          To connect your YouTube channel, click the button below and log in with the Gmail account associated with it.
        </Typography>
      </Stack>

      <Box
        onClick={handleLogin}
        sx={{
          width: 'fit-content',
          px: '12px',
          py: '6px',
          backgroundColor: '#211C84',
          cursor: "pointer",
          borderRadius: '4px'
        }}
      >
        <Typography sx={{ fontSize: '14px', color: '#FFFFFF' }}>Connect YouTube</Typography>
      </Box>
    </div>
  )
)}


        <ToastContainer autoClose={3000} />
    </GoogleOAuthProvider>
  );
};

export default YoutubeAuth;
