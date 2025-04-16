const { configureStore } = require("@reduxjs/toolkit");
const brandReducer = require('./brandSlice');
const creatorReducer = require('./creatorSlice');


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

module.exports = store;
