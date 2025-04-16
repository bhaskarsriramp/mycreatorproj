const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  showDetails: false,
  selectedCampaignId: null,
};

const campaignDetailsSlice = createSlice({
  name: 'campaignDetails',
  initialState,
  reducers: {
    setShowDetails: (state, action) => {
      state.showDetails = action.payload;
    },
    setSelectedCampaignId: (state, action) => {
      state.selectedCampaignId = action.payload;
    },
  },
});

const { setShowDetails, setSelectedCampaignId } = campaignDetailsSlice.actions;

module.exports = {
  setShowDetails,
  setSelectedCampaignId,
  reducer: campaignDetailsSlice.reducer
};
