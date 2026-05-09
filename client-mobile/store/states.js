import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isnavOpen: false,
  ip: "192.168.0.106",
};

export const extraSlice = createSlice({
  name: "extra",
  initialState,
  reducers: {
    openNav: (state) => {
      state.isnavOpen = true;
    },
    closeNav: (state) => {
      console.log(state.isnavOpen);
      state.isnavOpen = false;
    },
    setIp: (state, action) => {
      state.ip = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { openNav, closeNav, setIp } = extraSlice.actions;

export default extraSlice.reducer;
