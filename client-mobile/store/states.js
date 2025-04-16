import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isnavOpen: false,
}

export const extraSlice = createSlice({
  name: 'extra',
  initialState,
  reducers: {
    openNav:(state,)=>{
      state.isnavOpen = true
    },
    closeNav:(state,)=>{
      state.isnavOpen = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { openNav,closeNav } = extraSlice.actions

export default extraSlice.reducer