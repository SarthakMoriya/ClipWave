import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  log: [],
}

export const logSlice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    addLog: (state,{payload}) => {
      console.log("----------")
      console.log(payload)
      console.log("----------")
      state.log.push({content:payload.payload,type:payload.type})
    },
    removeLog: (state,payload) => {
      state.log = state.log.filter(log => log.id !== payload)
    }
  },
})

// Action creators are generated for each case reducer function
export const { addLog,removeLog } = logSlice.actions

export default logSlice.reducer