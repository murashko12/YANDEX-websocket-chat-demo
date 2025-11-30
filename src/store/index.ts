import { configureStore } from '@reduxjs/toolkit'
import { websocketApi } from './websocketApi'
import connectionReducer from './connectionSlice'

export const store = configureStore({
    reducer: {
        connection: connectionReducer,
        [ websocketApi.reducerPath ]: websocketApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(websocketApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch