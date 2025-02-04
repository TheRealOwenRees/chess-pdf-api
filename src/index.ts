import { PORT } from './utils/config'
import logger from './utils/logger'
import app from './app'

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`)
  await logger.discord({ type: 'info', message: `Server started on port ${PORT}` })
})
