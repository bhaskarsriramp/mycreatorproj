import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, ClickAwayListener, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logout } from "../../store/brandSlice.js";
import { useDispatch } from "react-redux";





function Profile() {

  const user = useSelector(state => state.brandUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState(true);
  const [ userDetails, setUserDetails ] = useState('');
  const [passwordDialogue, setPasswordDialogue] = useState(false);
  const [originalPassword, setOriginalPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);




  const handleSignOut = () => {
    dispatch(logout());
    navigate(`/login`);
   
  };

  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };


  useEffect(() => {

    if(!user.user_id){

      navigate("/login");
  
    }
    else if(user.user_id){

    
    const fetchData = async () => {
      try {

            // axios.post("/api/usersOn/get-user-details", {
              axios.post("/api/usersOn/get-user-details", {
            userId: user.user_id
          }).then(ress=>{
      
           
          
            setUserDetails(ress.data.data);
            setLoading(false);
      
          }).catch(e=>{
      
          })
      
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }
  }, []);

  const updatePassword = async (e) => {
    e.preventDefault();

    setIsLoading(true);


    if(!originalPassword || !newPassword){
        setIsLoading(false);
        toast.warning("Enter Valid Password");
      }


      else {


      await axios.post("/api/usersOn/change-password",
        { userId: user.user_id, password : originalPassword, newPassword : newPassword },
        {withCredentials: true}
      )
      .then((res) => {


            if(!res.data.success){

                setIsLoading(false);
                toast.error("Password update failed. Please try again.");

            }
            else if(res.data.success){
                
                setIsLoading(false);
                setPasswordDialogue(false);
                toast.success("Password updated successfully");
                
            }

      })
      .catch((err) => {


        if (err.response && err.response.data.error === "Wrong current password") {
          toast.warning("Wrong current password");
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




  return (
    <>
 

      {user.user_id ? (
        <> 

        { loading ?  (<CircularProgress />) : (
          <>

<Grid container>
<Grid item xs={12} sm={6} md={8}>
<div >
      {/* 1st Line: Email */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '20px' }}>
                <div style={{ flex: '1' }}>
                    <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                    Email
                    </Typography>
                    <Typography variant="body1">
                    {userDetails.email}
                    </Typography>
                </div>
              
        </div>
                <hr style={{ color: 'grey', border: 'none', height: '1px', backgroundColor: 'grey' }} />


{ userDetails.is_google_user ? (null) : (
  <>
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ flex: '1' }}>
                    <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                    Password
                    </Typography>
                    <Typography variant="body1">
                    **********
                    </Typography>
                </div>
                <Button variant="outlined" color="primary" onClick={()=> {setPasswordDialogue(true)}}>
                    Change Password
                </Button>
        </div>
                <hr style={{ color: 'grey', border: 'none', height: '1px', backgroundColor: 'grey' }} />
  </>
)}

      

      {/* 5th Line: Signout Button */}
      <div style={{ textAlign: 'start'}}>
        <Button variant="outlined" color="secondary" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      <ToastContainer autoClose={2500}/>
    </div>


    </Grid>
    </Grid>
 
 
 
         </>
        ) }

        </>
       
              
       
      ) : (
        <p>Please log in to view your profile.</p>
      )}
     
     <ToastContainer autoClose= {2000}/>




     {user && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={passwordDialogue}
            onClose={()=> setPasswordDialogue(false)}
            disableEscapeKeyDown
            keepMounted
            fullWidth
          >
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent dividers>
          
            <Typography sx={{fontSize: '16px', marginTop: '5px'}} >
                Please enter current password
              </Typography>

              <TextField
                type="password"
                id="originalPassword"
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
                id="newPassword"
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
        </ClickAwayListener>
      )}

    </>
  );
}

export default Profile;
