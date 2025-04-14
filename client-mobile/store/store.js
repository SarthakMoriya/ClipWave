import { configureStore } from '@reduxjs/toolkit'
import logReducer from './clipboard'
export const store = configureStore({
  reducer: {log:logReducer},
})