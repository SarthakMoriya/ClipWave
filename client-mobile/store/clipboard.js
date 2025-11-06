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
      console.log(state.log)
      console.log(payload)
      if (payload.payload)
        state.log.push({ content: payload.payload, type: payload.type });
    },
    removeLog: (state, payload) => {
      state.log = state.log.filter((log) => log.id !== payload);
    },
    setType: (state, { payload }) => {
      state.type = payload;
    },
    removeLogs: (state, payload) => {
      switch (payload.type) {
        case 1:
          state.log = state.log.filter((log) => log.type !== 1);
          return;
        case 2:
          state.log = state.log.filter((log) => log.type !== 2);
          return;
        case 3:
          state.log = state.log.filter((log) => log.type !== 3);
          return;
        case 4:
          state.log = state.log.filter((log) => log.type !== 4);
          return;
        case 5:
          state.log = state.log.filter((log) => log.type !== 5);
          return;
        case 6:
          state.log = state.log.filter((log) => log.type !== 6);
          return;
        default:
          state.log = [];
          return;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { addLog, removeLog, setType,removeLogs } = logSlice.actions;

export default logSlice.reducer;
