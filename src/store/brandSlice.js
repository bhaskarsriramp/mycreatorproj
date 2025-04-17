import { createSlice } from "@reduxjs/toolkit";

const storedState = JSON.parse(localStorage.getItem("userDetails"));


const brandUserSlice = createSlice({
    name: 'brandUser',

      
    initialState: {
        isLoggedIn: storedState?.isLoggedIn || false,
        user_email: storedState?.user_email || '', // Use stored email or empty string
        user_id: storedState?.user_id || '', // Use stored creator_id or empty string
    },

    reducers: {

        login: (state, action) => {
            state.isLoggedIn = true;
            state.user_email = action.payload.user_email;
            state.user_id = action.payload.user_id;
        
            const userDetails = {
              isLoggedIn: state.isLoggedIn,
              user_email: state.user_email,
              user_id: state.user_id,
             
            };
        
            localStorage.setItem("userDetails", JSON.stringify(userDetails));
          },

        logout: (state) => {
            state.isLoggedIn = false;
            state.user_email = '';
            state.user_id = '';
           
            localStorage.removeItem("userDetails");
        },
    },

});

export const { login, logout } = brandUserSlice.actions;
export default brandUserSlice.reducer;