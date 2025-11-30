import type { Message } from '../types'

interface MessageListProps {
  messages: Message[]
}

const MessageList = ({ messages }: MessageListProps) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${
                        message.type === 'sent' ? 'justify-end' : 'justify-start'
                    }`}
                >
                    <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'sent'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                    >
                        <p className="text-sm">{message.text}</p>
                        <p
                            className={`text-xs mt-1 ${
                                message.type === 'sent' ? 'text-blue-100' : 'text-gray-500'
                            }`}
                        >
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MessageList