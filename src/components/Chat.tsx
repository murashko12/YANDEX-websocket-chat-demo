import { useState, useEffect, type FormEvent } from 'react'
import { useConnectMutation, useDisconnectMutation, useSendMessageMutation } from '../store/websocketApi'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { addMessage, setConnectionState } from '../store/connectionSlice'

import ConnectionStatus from './ConnectionStatus'
import MessageList from './MessageList'
import type { Message } from '../types'

const Chat = () => {
    const [ messageText, setMessageText ] = useState('')
    const [ connect ] = useConnectMutation()
    const [ disconnect ] = useDisconnectMutation()
    const [ sendMessage ] = useSendMessageMutation()
  
    const dispatch = useAppDispatch()

    const { messages, isConnected, isConnecting } = useAppSelector(
        (state) => state.connection
    )

    useEffect(() => {
        handleConnect()
    }, [])

    const handleConnect = async () => {
        try {
            dispatch(setConnectionState({ isConnecting: true, error: null }))
            
            await connect().unwrap()
            
            dispatch(setConnectionState({ 
                isConnected: true, 
                isConnecting: false, 
                error: null 
            }))
      
            const welcomeMessage: Message = {
                id: Date.now().toString(),
                text: 'Добро пожаловать в чат! Соединение установлено.',
                timestamp: Date.now(),
                type: 'received'
            }
            
            dispatch(addMessage(welcomeMessage))
        } catch (error) {
            dispatch(setConnectionState({ 
                isConnected: false, 
                isConnecting: false, 
                error: 'Не удалось подключиться' 
            }))
        }
    }

    const handleDisconnect = async () => {
        try {
            await disconnect().unwrap()
            dispatch(setConnectionState({ 
                isConnected: false, 
                isConnecting: false, 
                error: null 
            }))
        } catch (error) {
            console.error('Error disconnecting:', error)
        }
    }

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault()
        
        if (!messageText.trim() || !isConnected) return

        const newMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            timestamp: Date.now(),
            type: 'sent'
        }

        dispatch(addMessage(newMessage))
        
        try {
            await sendMessage(messageText).unwrap()
            setMessageText('')
        } catch (error) {
            const errorMessage: Message = {
                id: Date.now().toString(),
                text: 'Ошибка отправки сообщения',
                timestamp: Date.now(),
                type: 'received'
            }
            dispatch(addMessage(errorMessage))
        }
    }

    return (
        <div className="max-w-2xl mx-auto  h-screen flex flex-col bg-gray-50">
            <div className="p-4 border-b bg-white">
                <h1 className="text-2xl font-bold text-gray-800">WebSocket Chat Demo</h1>
                <ConnectionStatus />
            </div>

            <MessageList messages={messages} />

            <div className="p-4 border-t bg-white">
                <div className="flex space-x-2 mb-4">
                    <button
                        onClick={handleConnect}
                        disabled={isConnected || isConnecting}
                        className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isConnecting ? 'Подключение...' : 'Подключиться'}
                    </button>
                    <button
                        onClick={handleDisconnect}
                        disabled={!isConnected}
                        className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Отключиться
                    </button>
                </div>

                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Введите сообщение..."
                        disabled={!isConnected}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                    <button
                        type="submit"
                        disabled={!isConnected || !messageText.trim()}
                        className="px-6 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Отправить
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Chat