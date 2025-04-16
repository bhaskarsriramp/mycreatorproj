import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Grid,
  Rating,
  Stack,
  ClickAwayListener,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { toast } from "react-toastify";
// import sideImage from "../../images/IMG_1025.jpg";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

function UserSignup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [errorMessage, setErrorMessage] = useState("");

  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };


  async function submit(e) {
    e.preventDefault();

    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!email || !password ) {
      toast.warning("All fields are mandatory");
    } else if (!emailRegex.test(email)) {
      toast.warning("Invalid email address");
    } else {
      setIsLoading(true);

      try {
        const response = await axios.post("/api/usersOn/signup-brand", {
          email: email,
          password: password
        });

        if (response.data.success) {
          setIsLoading(false);
          setIsDialogOpen(true);
        } else {
          // Handle other errors or display a generic error toast
          setIsLoading(false);
          toast.error("An error occurred. Please try again later.");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data.error === "User already exists"
        ) {
          setIsLoading(false);
          toast.warning("User already exists. Please login to continue...");
        } else if (
          error.response &&
          error.response.data.error === "All fields are mandatory"
        ) {
          setIsLoading(false);
          toast.warning("All fields are mandatory");
        } else {
          setIsLoading(false);
          toast.error("Technical Error. Please try again later.");
        }
      }
    }
  }

  const checkPin = async (e) => {
    e.preventDefault();

    if (!emailCode) {
      toast.warning("Enter valid 6-digit Pin");
    } else {
      await axios
        .post(
          "/api/usersOn/check-resetPin-withDb-brandTemps",
          { email: email.toLowerCase(), pin: emailCode },
          { withCredentials: true }
        )
        .then((res) => {
          setIsLoading(true);

          if (!res.data.matching) {
            setIsLoading(false);
            toast.error("Invalid Pin");
          } else if (res.data.matching) {
            setIsLoading(false);
            setIsDialogOpen(false);
            toast.success(
              "Account created successfully. Please login."
            );

            setTimeout(() => {
              navigate("/login");
            }, 2000);
          }
        })
        .catch((err) => {
          if (
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



  const loginButton = async () => {
    navigate("/login");
  };

  return (
    <>
      {/* <Grid container spacing='2'> */}

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
                    Creator Signup
                  </Typography>

                  <TextField
                    type="email"
                    id="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    margin="normal"
                    variant="outlined"
                    label="Email"
                  ></TextField>
                  <TextField
                    type="password"
                    id="password"
                    margin="normal"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    variant="outlined"
                    label="Create a Password"
                  ></TextField>

                  {errorMessage && (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                  )}
                  <Button
                    type="submit"
                    onClick={submit}
                    variant="contained"
                    sx={{
                      marginTop: 3,
                      textTransform: "capitalize",
                      fontWeight: "300",
                      fontSize: 16,
                      background: "#362FD9",
                    }}
                    size="large"
                  >
                    Create Account
                  </Button>

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
                      fontWeight: "300",
                      fontSize: 16,
                      fontWeight: "400",
                      color: "#362FD9",
                    }}
                    onClick={loginButton}
                  >
                    Already have an account? Login here
                  </Button>
                </Box>
              </>
            )}

            <ToastContainer autoClose={2000} />
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
                  paddingTop: "25%",
                }}
              >
                Welcome to our community.
              </Typography>

              <Typography
                textAlign="start"
                sx={{
                  fontSize: "22px",
                  color: "white",
                  paddingX: "20px",
                  paddingTop: "3%",
                }}
              >
                Unlock new horizons for unparalleled social presence and growth.
              </Typography>
            </Box>

            <Box
              display="flex"
              flexDirection={"column"}
              margin="auto"
              padding={1}
              sx={{ marginTop: "20%" }}
            >
              <Rating
                sx={{ paddingX: "20px" }}
                name="half-rating-read"
                defaultValue={4.5}
                precision={0.5}
                readOnly
              />

              <Typography
                textAlign="start"
                sx={{
                  fontSize: "14px",
                  color: "white",
                  paddingX: "20px",
                  paddingTop: "2%",
                }}
              >
                "It's a game-changing tool that streamlines channel growth like never before, offering solutions that many small
                social media influencers didn't even realize they needed until now."
              </Typography>

              <Stack
                display="flex"
                flexDirection={"row"}
                padding={1}
                sx={{ marginTop: "5%", paddingX: "20px" }}
              >
                {/* <Avatar alt="Travis Howard" src={''} sx={{ width: 40, height: 40 }}/> */}
                <Box display="flex" flexDirection={"column"}>
                  <Typography
                    textAlign="start"
                    sx={{ fontSize: "14px", color: "white" }}
                  >
                    Karan Jaiswal <br />
                  </Typography>

                  <Typography
                    textAlign="start"
                    sx={{ fontSize: "12px", color: "#E4F1FF" }}
                  >
                    Founder, Audioreel
                  </Typography>
                </Box>
              </Stack>
            </Box>
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
                      Creator Signup
                    </Typography>

                    <TextField
                      type="email"
                      id="email"
                      sx={{ marginBottom: "12px" }}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      variant="outlined"
                      label="Email"
                      margin="normal"

                    ></TextField>
                    <TextField
                      type="password"
                      id="password"
                      sx={{ marginBottom: "12px" }}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      variant="outlined"
                      label="Create a Password"

                    ></TextField>
                    {errorMessage && (
                      <p style={{ color: "red" }}>{errorMessage}</p>
                    )}

                    <Button
                      type="submit"
                      onClick={submit}
                      variant="contained"
                      sx={{
                        marginTop: 3,
                        textTransform: "capitalize",
                        fontWeight: "300",
                        fontSize: 16,
                        background: "#362FD9",
                      }}
                      size="large"
                    >
                      Create Account
                    </Button>

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
                        fontWeight: "300",
                        fontSize: 16,
                        fontWeight: "400",
                        color: "#362FD9",
                      }}
                      onClick={loginButton}
                    >
                      Already have an account? Login here
                    </Button>
                  </Box>
                </>
              )}

              <ToastContainer autoClose={2000} />
            </form>
          </Grid>
        </Grid>
      )}

      {email && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isDialogOpen}
            onClose={handleDialogClose}
            disableEscapeKeyDown
            keepMounted
          >
            <DialogTitle>Verify Email</DialogTitle>
            <DialogContent dividers>
              <Typography sx={{ fontSize: "16px", marginTop: "5px" }}>
                Please enter 6-digit code which was sent to {email}
              </Typography>

              <TextField
                type="email"
                id="email"
                onChange={(e) => {
                  setEmailCode(e.target.value);
                }}
                margin="normal"
                variant="outlined"
                label="6-digit code"
                value={emailCode}
              ></TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDialogOpen(false)} color="primary" sx={{ textTransform : 'none'}}>
                Cancel
              </Button>
              <Button color="success" onClick={checkPin} sx={{ borderRadius : '18px', backgroundColor : '#67AE6E', color : '#FFFFFF', px: 3, textTransform : 'none'}}>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}
    </>
  );
}

export default UserSignup;
