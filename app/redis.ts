import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: 'https://amazed-catfish-25236.upstash.io',
  token: 'AWKUAAIncDFmZjVhMGQzNjdmYTA0OWE1OTUwZmQ3ODFmY2VkYjRlM3AxMjUyMzY',
})

export default redis