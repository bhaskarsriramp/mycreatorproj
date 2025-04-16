const React = require("react");
const { useState, useEffect } = React;

const { useNavigate } = require("react-router-dom");
const axios = require("axios");
const { toast, ToastContainer } = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");

const {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Grid,
} = require("@mui/material");

const { useDispatch } = require("react-redux");
const { login } = require("../../store/brandSlice");

const { useTheme } = require("@mui/material/styles");
const CircularProgress = require("@mui/material/CircularProgress");
const useMediaQuery = require("@mui/material/useMediaQuery");


function UserLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, getEmail] = useState("");
  const [password, getPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));


   useEffect(() => {
      const verifyToken = async () => {
        try {
          const res = await axios.get('/api/usersOn/verify-login-token', { withCredentials: true });
          if (res.data.valid) {
            navigate("/creator/comment_analyzer");
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          setIsLoading(false);
        }
      };
  
      verifyToken();
    }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning("All fields are mandatory");
    } else {
      setIsLoading(true);

      await axios
        .post(
          "/api/usersOn/brand-login",
          { email: email.toLowerCase(), password: password },
          {withCredentials: true}

        )
        .then((res) => {

         if(res.data.success && res.data.user.channel_connected){
             dispatch(login({ user_email: res.data.user.user_email, user_id: res.data.user.user_id }));
              setIsLoading(false);
             navigate("/creator/comment_analyzer");
       
           }

          else if(res.data.success && !res.data.user.channel_connected){
            dispatch(login({ user_email: res.data.user.user_email, user_id: res.data.user.user_id }));
             setIsLoading(false);
            navigate("/creator/connect_youtube");
      
          }
           else{
       
             toast.error("Something Wrong. Please try again.");
                 
           }
        })
        .catch((err) => {
          setIsLoading(false);

          if (
            err.response &&
            err.response.data.error === "All fields are mandatory"
          ) {
            toast.warning("All fields are mandatory");
          } else if (err.response && err.response.status === 401) {
            // Handle 401 error (Unauthorized)
            toast.error("Session expired. Please login again.");
            console.log("check-5"); // Display toast notification
            // navigate('/login/brand');
          } else if (
            err.response &&
            err.response.data.error === "User does not exists!"
          ) {
            toast.warning("User does not exists");
          } else if (
            err.response &&
            err.response.data.error === "email, password mismatch"
          ) {
            toast.warning("Invalid email or password");
          } else {
            toast.error("An error occurred. Please try again later.");
          }
        });
    }
  };

  const signupButton = async () => {
    navigate("/signup");
  };

  return (
    <>
      {isSmallScreen ? (
        <Grid item xs={12} paddingX={2}>
          <form action="#" method="post">
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  width: "100%",
                  marginTop: "30%",
                }}
              >
                <CircularProgress color="success" />
              </div>
            ) : (
              <>
                <Box
                  display="flex"
                  flexDirection={"column"}
                  maxWidth={450}
                  margin="auto"
                  marginTop={15}
                  padding={1}
                >
                  <Typography variant="h5" padding={3} textAlign="center">
                    Creator Login
                  </Typography>

                  <TextField
                    type="email"
                    id="email"
                    onChange={(e) => {
                      getEmail(e.target.value);
                    }}
                    margin="normal"
                    variant="outlined"
                    label="Email"
                  ></TextField>
                  <TextField
                    type="password"
                    id="password"
                    onChange={(e) => {
                      getPassword(e.target.value);
                    }}
                    margin="normal"
                    variant="outlined"
                    label="Password"
                  ></TextField>

                  <Typography
                    variant="body2"
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Link
                      href="/forgotPassword"
                      underline="none"
                      sx={{ color: "#362FD9" }}
                    >
                      Forgot password?
                    </Link>
                  </Typography>

                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                      marginTop: 2,
                      textTransform: "capitalize",
                      fontWeight: "300",
                      fontSize: 16,
                      background: "#362FD9",
                    }}
                    size="large"
                  >
                    Login
                  </Button>
                  <ToastContainer autoClose={2000} />

                  <Typography variant="body2" sx={{ marginTop: "5px" }}>
                    I agree to{" "}
                    <Link
                      href="https://creatorconsole.co/terms"
                      target="_blank"
                      underline="none"
                      sx={{ color: "#362FD9" }}
                    >
                      CreatorConsole's Terms of Service
                    </Link>
                  </Typography>

                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      marginTop: 3,
                      textTransform: "capitalize",
                      fontWeight: "400",
                      fontSize: 16,
                      color: "#362FD9",
                    }}
                    onClick={signupButton}
                  >
                    Create new Account Here
                  </Button>
                </Box>
              </>
            )}
          </form>
        </Grid>
      ) : (
        <Grid container spacing="1" sx={{ height: "100vh" }}>
          <Grid item xs={4} sx={{ background: "#362FD9" }}>
            <Box
              display="flex"
              flexDirection={"column"}
              margin="auto"
              padding={1}
            >
              <Typography
                textAlign="start"
                sx={{
                  fontSize: "46px",
                  fontWeight: "500",
                  color: "white",
                  paddingX: "20px",
                  paddingTop: "30%",
                }}
              >
                Comments... Replies...
              </Typography>

              <Typography
                textAlign="start"
                sx={{
                  fontSize: "22px",
                  color: "white",
                  paddingX: "20px",
                  paddingTop: "10%",
                }}
              >
                Understand a video verformance way better.
              </Typography>
            </Box>

            {/* <Box
              display="flex"
              flexDirection={"column"}
              margin="auto"
              padding={1}
              sx={{ marginTop: "20%" }}
            >
              <Typography
                textAlign="start"
                sx={{
                  fontSize: "22px",
                  color: "white",
                  paddingX: "20px",
                  paddingTop: "2%",
                }}
              >
                .Create <br />
                .Send <br />
                .Get Paid
              </Typography>
            </Box> */}
          </Grid>

          <Grid item xs={8}>
            <form action="#" method="post">
              {isLoading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                    marginTop: "30%",
                  }}
                >
                  <CircularProgress color="success" />
                </div>
              ) : (
                <>
                  <Box
                    display="flex"
                    flexDirection={"column"}
                    maxWidth={450}
                    margin="auto"
                    marginTop={15}
                    padding={1}
                  >
                    <Typography variant="h5" padding={3} textAlign="center">
                      Creator Login
                    </Typography>

                    <TextField
                      type="email"
                      id="email"
                      onChange={(e) => {
                        getEmail(e.target.value);
                      }}
                      sx={{ marginBottom: "12px" }}

                      margin="normal"
                      variant="outlined"
                      label="Email"
                    ></TextField>
                    <TextField
                      type="password"
                      id="password"
                      onChange={(e) => {
                        getPassword(e.target.value);
                      }}
                      variant="outlined"
                      label="Password"
                    ></TextField>

                    <Typography
                      variant="body2"
                      sx={{ display: "flex", justifyContent: "flex-end", mt: '8px' }}
                    >
                      <Link
                        href="/forgotPassword"
                        underline="none"
                        sx={{ color: "#362FD9" }}
                      >
                        Forgot password?
                      </Link>
                    </Typography>

                    <Button
                      type="submit"
                      onClick={handleSubmit}
                      variant="contained"
                      sx={{
                        marginTop: 2,
                        textTransform: "capitalize",
                        fontWeight: "300",
                        fontSize: 16,
                        background: "#362FD9",
                      }}
                      size="large"
                    >
                      Login
                    </Button>
                    <ToastContainer autoClose={2000} />

                    <Typography variant="body2" sx={{ marginTop: "5px" }}>
                      I agree to{" "}
                      <Link
                        href="https://creatorconsole.co/terms"
                        target="_blank"
                        underline="none"
                        sx={{ color: "#362FD9" }}
                      >
                        CreatorConsole's Terms of Service
                      </Link>
                    </Typography>

                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        marginTop: 3,
                        textTransform: "capitalize",
                        fontWeight: "400",
                        fontSize: 16,
                        color: "#362FD9",
                      }}
                      onClick={signupButton}
                    >
                      Create new Account Here
                    </Button>
                  </Box>
                </>
              )}
            </form>
          </Grid>
        </Grid>
      )}
    </>
  );
}


module.exports = UserLogin;

