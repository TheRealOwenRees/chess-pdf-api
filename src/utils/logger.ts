const logger = {
  info: (...params: string[]) => {
    console.log(...params)
  },
  error: (...params: string[] | Error[]) => {
    console.error(...params)
  }
}

export default logger
