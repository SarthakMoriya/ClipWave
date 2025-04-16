import { configureStore } from '@reduxjs/toolkit'
import logReducer from './clipboard'
import extraReducer from './states'
export const store = configureStore({
  reducer: {log:logReducer,extra:extraReducer},
})