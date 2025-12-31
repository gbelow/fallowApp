import { Redis } from '@upstash/redis'
import { env } from 'process'


const redis = new Redis({
  url: 'https://amazed-catfish-25236.upstash.io',
  token: env.UPSTASH_REDIS_REST_TOKEN ?? '',
})

export default redis