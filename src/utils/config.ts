import dotenv from 'dotenv'
dotenv.config()

export const PORT = 5000

export const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST']
}
