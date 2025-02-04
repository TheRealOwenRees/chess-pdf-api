import * as process from 'node:process'

type DiscordLogType = 'error' | 'info'

interface IDiscordLog {
  type: DiscordLogType
  message: string
}

const embedColours: Record<DiscordLogType, number> = {
  error: 0xff0000,
  info: 0x00ff00
}

const logger = {
  info: (...params: string[]) => {
    if (process.env.NODE_ENV !== 'production') console.log(...params)
  },
  error: (...params: string[] | Error[]) => {
    if (process.env.NODE_ENV !== 'production') console.error(...params)
  },
  discord: async ({ type, message }: IDiscordLog) => {
    if (process.env.NODE_ENV === 'production') {
      const date = new Date()
      const timestamp = date.toISOString()
      const formattedTimestamp = date.toString()
      const messageTypeTitle = type.charAt(0).toUpperCase() + type.slice(1)

      await fetch(process.env.DISCORD_ERROR_LOG_WEBHOOK as string, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          embeds: [
            {
              title: messageTypeTitle,
              color: embedColours[type],
              fields: [
                { name: 'Timestamp', value: `${timestamp}\n${formattedTimestamp}` },
                { name: messageTypeTitle, value: message }
              ]
            }
          ]
        })
      })
      return true
    } else {
      return false
    }
  }
}

export default logger
