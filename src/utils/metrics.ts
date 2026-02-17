import fs from 'node:fs'
import path from 'node:path'

const LOG_FILE = path.join(__dirname, '../../metrics.json')

console.log('Logging metrics to', LOG_FILE)

export function recordMetrics(status: 'SUCCESS' | 'FAIL', startMs: number, error: null | Error = null) {
  const entry = {
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    ts: new Date().toISOString(),
    status: status,
    latency: `${startMs - Date.now()}ms`,
    error: error ? error.message : null
  }

  // Append as a single line so it's easy to parse
  fs.appendFile(LOG_FILE, JSON.stringify(entry) + '\n', (err) => {
    if (err) console.error('Could not write to log file', err)
  })
}
