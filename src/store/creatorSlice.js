import { createSlice } from "@reduxjs/toolkit";

const storedState = JSON.parse(localStorage.getItem("influencerDetails"));

const creatorUserSlice = createSlice({
    name: 'creatorUser',
    
    initialState: {
        isLoggedIn: storedState?.isLoggedIn || false,
        email: storedState?.email || '', // Use stored email or empty string
        creator_id: storedState?.creator_id || '', // Use stored creator_id or empty string
        creator_category: storedState?.creator_category || '', // Use stored creator_category or empty string
    },

    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.email = action.payload.email;
            state.creator_id = action.payload.creator_id;
            state.creator_category = action.payload.creator_category;
            state.isInstagramLinked = action.payload.isInstagramLinked;
        
            const influencerDetails = {
              isLoggedIn: state.isLoggedIn,
              email: state.email,
              creator_id: state.creator_id,
              creator_category: state.creator_category,
              isInstagramLinked : state.isInstagramLinked
            };
        
            localStorage.setItem("influencerDetails", JSON.stringify(influencerDetails));
          },

        logout: (state) => {
            state.isLoggedIn = false;
            state.email = '';
            state.creator_id = '';
            state.creator_category = '';
            state.isInstagramLinked = false;

            localStorage.removeItem("influencerDetails");

        },
    },

});

export const { login, logout } = creatorUserSlice.actions;
export default creatorUserSlice.reducer;