import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ConnectionState, Message } from '../types'

interface ChatState extends ConnectionState {
    messages: Message[]
}

const initialState: ChatState = {
    messages: [],
    isConnected: false,
    isConnecting: false,
    error: null
}

const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload)
        },
        setConnectionState: (state, action: PayloadAction<Partial<ConnectionState>>) => {
            return { ...state, ...action.payload }
        },
        clearMessages: (state) => {
            state.messages = []
        }
    }
})

export const { addMessage, setConnectionState, clearMessages } = connectionSlice.actions
export default connectionSlice.reducer