const React = require("react");
const { useState, useEffect } = React;

const {
  Button,
  Typography,
  Grid,
  Stack,
  Box,
  Skeleton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
  ClickAwayListener,
} = require("@mui/material");

const { useNavigate } = require("react-router-dom");
const axios = require("axios");
const { toast, ToastContainer } = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");

const { logout } = require("../../store/brandSlice");
const { useDispatch } = require("react-redux");

const LogoutIcon = require("@mui/icons-material/Logout");
const DeleteOutlineOutlinedIcon = require("@mui/icons-material/DeleteOutlineOutlined");




const AccountDetailsPage1 = () => {

      const dispatch = useDispatch();
      const navigate = useNavigate();
      const [ loading, setLoading ] = useState(false);
      const [ unlinkLoading, setUnlinkLoading ] = useState(false);
      const [ deleteRequestLoading, setDeleteRequestLoading ] = useState(false);
      const [ deleteCodeLoading, setDeleteCodeLoading ] = useState(false);
      const [ userDetails, setUserDetails ] = useState({});
      const [originalPassword, setOriginalPassword] = useState("");
      const [newPassword, setNewPassword] = useState("");
      const [passwordDialogue, setPasswordDialogue] = useState(false);
      const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
      const [enterCodeDialog, setEnterCodeDialog] = useState(false);
      const [unlinkDialogue, setUnlinkDialogue] = useState(false);
      const [emailCode, setEmailCode] = useState("");


      
  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };

      const handleSignOut = async () => {
        try {
            await axios.post("/api/usersOn/logout", {}, { withCredentials: true });
            dispatch(logout()); // Clear Redux state
            window.location.href = "/login"; // Ensures full logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleDialogPasswordClose = () => {
      setPasswordDialogue(false);
    };

    const handleDialogUnlinkClose = () => {
      setUnlinkDialogue(false);
    };

    const handleDialogAccountDeleteClose = () => {
      setDeleteAccountDialog(false);
    };

    const goToConnectYoutube = () => {

      navigate('/creator/connect_youtube');

    };

      const checkPin = async (e) => {
        e.preventDefault();

        setDeleteCodeLoading(true);
    
        if(!emailCode){

            toast.warning("Enter valid 6-digit Pin");
          }
    
          else {
    
    
          await axios.post("/api/usersOn/check-deleteCode-withDb",
            { pin : emailCode }, {withCredentials : true}
          )
          .then((res) => {
    
                if(!res.data.matching){
    
        setDeleteCodeLoading(true);
                    toast.error("Invalid Code");
    
                }
                else if(res.data.matching){
                    
        setDeleteCodeLoading(true);
                    toast.success("Account and data has been deleted successfully!");
        dispatch(logout()); // Clear Redux state

                    setTimeout(() => {
                    navigate('/');
                    }, 2500);
                    
                }
    
          })
          .catch((err) => {
    
    
            if (err.response && err.response.data.error === "User does not exists!") {
              toast.warning("User does not exists");
            } 
    
            else if (err.response && err.response.data.error === "email, password mismatch") {
              toast.warning("Invalid email or password");
            } 
            
            else {
              toast.error("An error occurred. Please try again later.");
            }
          });
    
        }
    
        
      };

    


    const updatePassword = async (e) => {
      e.preventDefault();
      setLoading(true);
    
      if (!originalPassword || !newPassword) {
        toast.warning("Enter a valid password");
        setLoading(false);
        return;
      }
    
      try {
        const res = await axios.post(
          '/api/usersOn/change-password',
          { password: originalPassword, newPassword: newPassword },
          { withCredentials: true }
        );
    
        if (res.data.success) {
          toast.success("Password updated successfully");
          setPasswordDialogue(false);
        } else {
          toast.error(res.data.message || "Password update failed. Please try again.");
        }
      } catch (err) {
        if (err.response) {
          const errorMessage = err.response.data.message || "An error occurred. Please try again later.";
          
          if (errorMessage === "Wrong current password") {
            toast.warning("Wrong current password");
          } else {
            toast.error(errorMessage);
          }
        } else {
          toast.error("Network error. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    const unlinkChannel = async (e) => {

      e.preventDefault();
      setUnlinkLoading(true);
    
  const unlinkYouTubeChannel = true;
    
      try {
        const res = await axios.post(
          '/api/usersOn/unlink-youtube-channel',
          { unlinkYouTubeChannel },
          { withCredentials: true }
        );
    
        if (res.data.success) {
          toast.success("Unlink successful.");
          setUnlinkDialogue(false);
          window.location.reload();

        } else {
          toast.error(res.data.message || "Unlink failed. Please try again.");
        }
      } catch (err) {
        if (err.response) {
          const errorMessage = err.response.data.message || "An error occurred. Please try again later.";
          
        } else {
          toast.error("Network error. Please try again later.");
        }
      } finally {
        setUnlinkLoading(false);
      }
    };

    const deleteAccount = async (e) => {
      e.preventDefault();
      setDeleteRequestLoading(true);
    
      try {
        const res = await axios.post(
          '/api/usersOn/delete-account-permanently-with-code',
          {},
          { withCredentials: true }
        );
    
        if (res.data?.emailSent) {
          toast.success("Code sent to your email");
          setDeleteRequestLoading(false);
          setEnterCodeDialog(true);
        } else {
          toast.error("Technical error. Try again.");
        }
      } catch (err) {
        if (err.response) {
          const { error } = err.response.data;
    
          if (error === "User does not exist") {
            setDeleteRequestLoading(false);
            toast.warning("User does not exist");
          } else {
            setDeleteRequestLoading(false);
            toast.error(error || "Something went wrong. Try again.");
          }
        } else {
          setDeleteRequestLoading(false);
          toast.error("Network error. Please try again.");
        }
      }
    };
    
      
    const handleSessionExpired = () => {
      toast.error("Session expired. Please log in again.");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    };
 

    useEffect(() => {
      const verifyToken = async () => {
        setLoading(true);
      
        try {
          const res = await axios.get('/api/usersOn/verify-login-token', { withCredentials: true });
      
          if (res.data.valid) {
            fetchData();
          } else {
            handleSessionExpired();
          }
        } catch (error) {
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            handleSessionExpired();
          } else {
            toast.error("Network error, please try again later.");
          }
        } finally {
          setLoading(false);
        }
      };
      
  
      verifyToken();
    }, []);

 
          const fetchData = async () => {
            try {
      
                  // axios.post("/api/usersOn/get-user-details", {
                    await axios.post("/api/usersOn/get-user-details", { }, { withCredentials : true}).then(ress=>{

                      if(ress.data.success){
                        setUserDetails(ress.data.data);
                        setLoading(false);
                      }
                      else {
                        setLoading(false);
                        toast.error("Session expired. Please log in again.");
                        setTimeout(() => {
                        navigate('/login');
                        }, 2000);
                      }
            
                }).catch(e=>{
            
                })
            
            } catch (error) {
              setLoading(false);
              toast.error("Network error. Please log in again.");
              setTimeout(() => {
              navigate('/login');
              }, 2000);
            }
          };

  return (
  <>

    <Grid container mt={5}>

        <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ fontSize : '18px', fontWeight : '500'}}>Your Account</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={8}>
            
            <Grid container fullWidth sx={{  borderStyle : 'solid', borderWidth :'1px', borderColor : '#BCCCDC', marginBottom : '22px', paddingY : '12px', paddingX : '12px'}}>
                
                <Grid item md={4}>
                <Typography sx={{ fontSize : '14px', fontWeight : '500'}}>Email</Typography>
                </Grid>

                <Grid item md={8}>
                  {loading ? (      <Skeleton variant="rectangular" width={300} height={20} />
                  ): (<Typography sx={{ fontSize : '14px', fontWeight : '400'}}>{userDetails.email}</Typography>) }
                        
                </Grid>

            </Grid>

            
            <Grid container fullWidth sx={{  borderStyle : 'solid', borderWidth :'1px', borderColor : '#BCCCDC', marginBottom : '22px', paddingY : '12px', paddingX : '12px', alignItems : 'center'}}>
                
                <Grid item md={4}>
                <Typography sx={{ fontSize : '14px', fontWeight : '500'}}>Channel</Typography>
                </Grid>

                <Grid item md={8}>
                  {loading ? (      <Skeleton variant="rectangular" width={180} height={20} />
                  ): userDetails.channelConnected ? (

                    <Stack sx={{ display : 'flex', flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>

                      <div style={{ display : 'flex', flexDirection : 'row', gap: '10%', alignItems : 'center'}}>

                      <Avatar alt="youtube channel" src={userDetails.profile_img} sx={{ width: 28, height: 28 }} />
                  <Typography sx={{ fontSize : '14px', fontWeight : '400'}}>{userDetails.channelName}</Typography>


                      </div>
                     
                  <Box sx={{ border : '1px solid grey', borderRadius : '4px', px: '12px', py: '4px', cursor: 'pointer', ":hover": { backgroundColor: "#D6D6D6" }}}onClick={()=> {setUnlinkDialogue(true)}}>
                   <Typography sx={{ fontSize : '14px', fontWeight : 400}}>Unlink</Typography>
                </Box>


                    </Stack>
                  
                  
                  ) : (
                    <Box sx={{ width: 'fit-content', border : '1px solid grey', borderRadius : '4px', px: '12px', py: '4px', cursor: 'pointer', ":hover": { backgroundColor: "#D6D6D6" }}}onClick={()=> {goToConnectYoutube()}}>
                    <Typography sx={{ fontSize : '14px', fontWeight : 400}}>Link YouTube Channel</Typography>
                 </Box>
                  ) }
                        
                </Grid>

                

            </Grid>


            <Grid container fullWidth sx={{  borderStyle : 'solid', borderWidth :'1px', borderColor : '#BCCCDC', marginBottom : '22px', paddingY : '12px', paddingX : '12px', alignItems : 'center'}}>
                
                <Grid item md={4}>
                <Typography sx={{ fontSize : '14px', fontWeight : '500'}}>Password</Typography>
                </Grid>

                <Grid item md={8}>
                  
                  {loading ? (      
                  <Stack sx={{ display : 'flex', flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
                    <Skeleton variant="rectangular" width={160} height={20} />
                    <Skeleton variant="rectangular" width={100} height={20} />
                    
                    </Stack>

                  ): (
                  <>
                  <Stack sx={{ display : 'flex', flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>

                  <Typography sx={{ fontSize : '14px', fontWeight : '400'}}>***************</Typography>
 
                  <Box sx={{ border : '1px solid grey', borderRadius : '4px', px: '12px', py: '4px', cursor: 'pointer', ":hover": { backgroundColor: "#D6D6D6" }}}onClick={()=> {setPasswordDialogue(true)}}>
                   <Typography sx={{ fontSize : '14px', fontWeight : 400}}>Change Password</Typography>
                </Box>

                </Stack>   

                  </>)}
                      
              
                </Grid>

                

            </Grid>

       

       

            <div style={{ textAlign: 'start'}}>
                    <Button startIcon={<LogoutIcon />} sx={{ color : 'grey', textTransform : 'none'}} variant="outlined" color="warning" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </div>

                



                  <Grid
  container
  fullWidth
  sx={{
    border: '1px solid #BCCCDC',
    mb: '44px',
    py: '12px',
    px: '12px',
    alignItems: 'center',
    mt: 16,
  }}
>
  {/* Left side text */}
  <Grid item xs={12} md={6}>
    <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
      Delete my account & erase data
    </Typography>
  </Grid>

  {/* Right side button */}
  <Grid item xs={12} md={6}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      {loading ? (
        <Skeleton variant="rectangular" width={80} height={32} />
      ) : (
        <Box
          onClick={() => setDeleteAccountDialog(true)}
          sx={{
            border: '1px solid grey',
            borderRadius: '4px',
            px: '12px',
            py: '4px',
            cursor: 'pointer',
            ":hover": { backgroundColor: "#D6D6D6" },
          }}
        >
          <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>Delete</Typography>
        </Box>
      )}
    </Box>
  </Grid>
</Grid>




            
        </Grid>

     </Grid>

     {passwordDialogue && (
          <Dialog
            open={passwordDialogue}
            onClose={handleDialogPasswordClose}
            disableEscapeKeyDown
            keepMounted
            maxWidth="sm" // Makes the dialog wider
            fullWidth // Ensures it takes full width of "sm"
          >
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent dividers>
          
            <Typography sx={{fontSize: '16px', marginTop: '5px'}} >
                Please enter current password
              </Typography>

              <TextField
                type="password"
                id="password"
                onChange={(e) => {
                  setOriginalPassword(e.target.value);
                }}
                margin="normal"
                variant="outlined"
                label="Current Password"
              />

              <Typography sx={{fontSize: '16px', marginTop: '5px'}} >
                Please enter new password
              </Typography>

              <TextField
                type="password"
                id="password"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                margin="normal"
                variant="outlined"
                label="New Password"
              />

        </DialogContent>
            <DialogActions>
              <Button onClick={()=> setPasswordDialogue(false)} color="primary">
                Cancel
              </Button>
              <Button color="success" onClick={updatePassword}>
                SUBMIT
              </Button>
            </DialogActions>
          </Dialog>
      )}

{unlinkDialogue && (
          <Dialog
            open={unlinkDialogue}
            onClose={handleDialogUnlinkClose}
            disableEscapeKeyDown
            keepMounted
            maxWidth="sm" 
            fullWidth 
          >
            <DialogTitle>Unlink Channel</DialogTitle>
            <DialogContent dividers>

              {unlinkLoading ? (  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 150 }}>
          <CircularProgress />
        </Box>) : (
                <>
                 <Typography sx={{fontSize: '16px', marginTop: '5px', marginBottom : '22px'}} >
                Are you sure, you want to unlink your YouTube channel ?
              </Typography>
          
            <div style={{ display : 'flex', flexDirection : 'row', gap: '2%', alignItems : 'center'}}>
          

<Avatar alt="youtube channel" src={userDetails.profile_img} sx={{ width: 28, height: 28 }} />
<Typography sx={{ fontSize : '16px', fontWeight : '400'}}>{userDetails.channelName}</Typography>


</div>
                </>
              )}


        </DialogContent>
            <DialogActions>
              <Button onClick={()=> setUnlinkDialogue(false)}  sx={{ borderRadius : '18px', backgroundColor : '#EC5228', color : '#FFFFFF', px: 3, textTransform : 'none'}}>
                No
              </Button>
              <Button color="success" onClick={unlinkChannel} sx={{ textTransform : 'none'}}>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
      )}

{deleteAccountDialog && (
          <Dialog
            open={deleteAccountDialog}
            onClose={handleDialogAccountDeleteClose}
            disableEscapeKeyDown
            keepMounted
            maxWidth="sm" 
            fullWidth 
          >
            <DialogTitle>
              <Stack sx={{ display : 'flex', flexDirection : 'row', gap: 2, alignItems : 'center'}}>
                <Box sx={{ backgroundColor : '#F8E8EE', px: '6px', py: '2px', borderRadius : '6px', alignItems : 'center'}}>
                <DeleteOutlineOutlinedIcon sx={{ fontSize : '26px', color: 'red' }}/>

                </Box>
                <Typography sx={{ fontSize : '16px', fontWeight : 500}}>Delete account & erase data ?</Typography>
              </Stack>
              </DialogTitle>
            <DialogContent dividers>

              {deleteRequestLoading ? (  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 150 }}>
          <CircularProgress />
        </Box>) : (
                <>
                 <Typography sx={{fontSize: '16px', marginTop: '5px', marginBottom : '22px'}} >
               All your data and account will be deleted permanently. This cannot be undone. Are you sure you want to proceed?
              </Typography>
          
            <div style={{ display : 'flex', flexDirection : 'row', gap: '2%', alignItems : 'center'}}>
          

<Typography sx={{ fontSize : '14px', fontWeight : '400', color : 'grey'}}>A delete code will be sent to your email address : {userDetails.email}</Typography>


</div>
                </>
              )}


        </DialogContent>
            <DialogActions>
              <Button onClick={()=> setDeleteAccountDialog(false)} sx={{ borderRadius : '18px', backgroundColor : '#EC5228', color : '#FFFFFF', px: 3, textTransform : 'none'}}>
                Cancel
              </Button>
              <Button color="success" onClick={deleteAccount} sx={{ textTransform : 'none'}}>
                Proceed
              </Button>
            </DialogActions>
          </Dialog>
      )}

          {enterCodeDialog && (
              <ClickAwayListener onClickAway={handleClickAway}>
                <Dialog
                 open={enterCodeDialog}
                 onClose={handleDialogAccountDeleteClose}
                 disableEscapeKeyDown
                 keepMounted
                 maxWidth="sm" 
                 fullWidth 
                >
                  <DialogTitle>Verify Email</DialogTitle>
                  <DialogContent dividers>

                  {deleteCodeLoading ? (  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 150 }}>
          <CircularProgress />
        </Box>) : (
                <>
                  <Typography sx={{fontSize: '16px', marginTop: '5px'}} >
                  Enter the 6-digit delete code that was sent to {userDetails.email}
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
                    </>
        )}
      
              </DialogContent>
                  <DialogActions>
                    <Button onClick={()=> setEnterCodeDialog(false)} color="primary" sx={{ textTransform : 'none'}}>
                      Cancel
                    </Button>
                    <Button color="success" onClick={checkPin} sx={{ borderRadius : '18px', backgroundColor : '#EC5228', color : '#FFFFFF', px: 3, textTransform : 'none'}}>
                      Submit
                    </Button>
                  </DialogActions>
                </Dialog>
              </ClickAwayListener>
            )}







           <ToastContainer autoClose= {2000}/>
      
  </>
  );
};


module.exports = AccountDetailsPage1;

