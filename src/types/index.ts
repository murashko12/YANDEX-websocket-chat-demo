export interface Message {
    id: string
    text: string
    timestamp: number
    type: 'sent' | 'received'
}

export interface ConnectionState {
    isConnected: boolean
    isConnecting: boolean
    error: string | null
}