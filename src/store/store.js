import { configureStore } from "@reduxjs/toolkit";
import brandReducer from './brandSlice';
import creatorReducer from './creatorSlice';

const persistedStateJSON = localStorage.getItem("influencerDetails");
const persistedState = persistedStateJSON
  ? JSON.parse(persistedStateJSON)
  : {};

  const brandPersistedStateJSON = localStorage.getItem("userDetails");
  const brandPersistedState = brandPersistedStateJSON
    ? JSON.parse(brandPersistedStateJSON)
    : {};

const store = configureStore({
    reducer: {
        brandUser: brandReducer,
        creatorUser: creatorReducer,

    },
    preloadedState: {
        creatorUser: persistedState,
        brandUser: brandPersistedState,
    },

})

export default store;