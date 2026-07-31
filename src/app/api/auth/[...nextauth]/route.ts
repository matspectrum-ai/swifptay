import { handlers } from 'auth.js'
import { authOptions } from '@/lib/auth/config'

export const { GET, POST } = handlers(authOptions)