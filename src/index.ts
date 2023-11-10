import { PORT } from './utils/config'
import logger from './utils/logger'
import app from './app'

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
