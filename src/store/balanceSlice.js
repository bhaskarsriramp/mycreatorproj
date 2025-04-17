const { createSlice } = require('@reduxjs/toolkit');

const balanceSlice = createSlice({
  name: 'balance',
  initialState: null,

  reducers: {
    setBalance: (state, action) => {
      return action.payload;
    },
  },
});

const { setBalance } = balanceSlice.actions;

module.exports = { setBalance, default: balanceSlice.reducer };
