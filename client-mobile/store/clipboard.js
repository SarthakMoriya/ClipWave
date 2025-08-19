import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  log: [],
  type: 1,
};

export const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {
    addLog: (state, { payload }) => {
      if (payload.payload)
        state.log.push({ content: payload.payload, type: payload.type });
    },
    removeLog: (state, payload) => {
      state.log = state.log.filter((log) => log.id !== payload);
    },
    setType: (state, { payload }) => {

      state.type = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addLog, removeLog, setType } = logSlice.actions;

export default logSlice.reducer;
