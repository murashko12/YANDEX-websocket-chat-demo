import { createApi, type BaseQueryFn } from '@reduxjs/toolkit/query/react'
import type { Message } from '../types'

type WebSocketMessage = {
    type: 'SEND_MESSAGE' | 'CONNECT' | 'DISCONNECT'
    payload?: any
}

const createWebSocketBaseQuery = (): BaseQueryFn<
    WebSocketMessage,
    unknown,
    unknown
> => {
    let socket: WebSocket | null = null
    let listeners: ((data: Message) => void)[] = []

    return async (args) => {
        try {
            if (args.type === 'CONNECT') {
                if (socket?.readyState === WebSocket.OPEN) {
                    return { data: 'Already connected' }
                }

                socket = new WebSocket('wss://echo.websocket.org')

                return new Promise((resolve, reject) => {
                    if (!socket) return reject('Socket not initialized')

                    socket.onopen = () => {
                        resolve({ data: 'Connected' })
                    }

                    socket.onmessage = (event) => {
                        const message: Message = {
                            id: Date.now().toString(),
                            text: event.data,
                            timestamp: Date.now(),
                            type: 'received'
                        }
                        
                        listeners.forEach(listener => listener(message))
                    }

                    socket.onerror = (_) => {
                        reject({ error: 'WebSocket error' })
                    }

                    socket.onclose = (event) => {
                        let disconnectReason = 'Неизвестная причина'
  
                        if (event.wasClean) {
                            disconnectReason = 'Соединение закрыто корректно'
                        } else {
                            switch (event.code) {
                                case 1000:
                                    disconnectReason = 'Нормальное закрытие'
                                    break
                                case 1001:
                                    disconnectReason = 'Сервер ушел'
                                    break
                                case 1002:
                                    disconnectReason = 'Протокольная ошибка'
                                    break
                                case 1003:
                                    disconnectReason = 'Неподдерживаемые данные'
                                    break
                                case 1005:
                                    disconnectReason = 'Нет кода статуса'
                                    break
                                case 1006:
                                    disconnectReason = 'Аномальное закрытие'
                                    break
                                default:
                                    disconnectReason = `Ошибка: код ${event.code}`
                            }
                        }

                        const disconnectMessage: Message = {
                            id: `close-${Date.now()}`,
                            text: `${disconnectReason}${event.reason ? `: ${event.reason}` : ''}`,
                            timestamp: Date.now(),
                            type: 'received'
                        }
  
                        listeners.forEach(listener => listener(disconnectMessage))
                    }
                })
            }

            if (args.type === 'DISCONNECT') {
                socket?.close()
                return { data: 'Disconnected' }
            }

            if (args.type === 'SEND_MESSAGE' && socket?.readyState === WebSocket.OPEN) {
                socket.send(args.payload)
                return { data: 'Message sent' }
            }

            return { error: 'WebSocket not connected' }
        } catch (error) {
            return { error }
        }
    }
}

export const websocketApi = createApi({
    reducerPath: 'websocketApi',
    baseQuery: createWebSocketBaseQuery(),
    tagTypes: ['Messages'],
    endpoints: (builder) => ({
        connect: builder.mutation<string, void>({
            query: () => ({ type: 'CONNECT' })
        }),
        disconnect: builder.mutation<string, void>({
            query: () => ({ type: 'DISCONNECT' })
        }),
        sendMessage: builder.mutation<string, string>({
            query: (message) => ({ 
                type: 'SEND_MESSAGE', 
                payload: message 
            }),
            invalidatesTags: ['Messages']
        })
    })
})

export const { 
    useConnectMutation, 
    useDisconnectMutation, 
    useSendMessageMutation 
} = websocketApi