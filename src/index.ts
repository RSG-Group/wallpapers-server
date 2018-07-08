import { GraphQLServer } from 'graphql-yoga'
import resolvers from './resolvers'

// If production is explicitly specified via flag..
if (process.argv[2] === '--production') process.env.NODE_ENV = 'production'
// Check for development environment.
const dev = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT, 10) || 3000 // If port variable has been set.

// Initialize server..
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
})

// Listen to requests on specified port.
server.start({
  port,
  endpoint: '/graphql',
  playground: dev ? '/playground' : false,
  subscriptions: '/subscriptions'
}, () => {
  console.log(`> Ready on http://localhost:${port}`)
})
