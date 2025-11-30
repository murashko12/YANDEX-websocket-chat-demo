import { useAppSelector } from '../hooks/redux'

const ConnectionStatus = () => {
    const { isConnected, isConnecting, error } = useAppSelector(
        (state) => state.connection
    )

    const getStatusColor = () => {
        if (error) return 'bg-red-500'
        if (isConnected) return 'bg-green-500'
        if (isConnecting) return 'bg-yellow-500'
        return 'bg-gray-500'
    }

    const getStatusText = () => {
        if (error) return `Ошибка: ${error}`
        if (isConnected) return 'Подключено'
        if (isConnecting) return 'Подключаемся...'
        return 'Отключено'
    }

    return (
        <div className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
            <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
    )
}

export default ConnectionStatus