// Import the Google Cloud APIs.
import * as Datastore from '@google-cloud/datastore'
import * as Storage from '@google-cloud/storage'
// Import the settings we need to use.
import 'json5/lib/register'
import { // eslint-disable-next-line no-unused-vars
  database, storage, mongourl, folderPath, authjsonpath, projectId, bucketName
} from '../settings.json5'

// Initialize connection to Datastore and Cloud Storage.
// Potentially: MongoDB or Firestore?
const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS || authjsonpath
const datastore = new Datastore({ projectId, keyFilename })
const cloudStorage = Storage({ projectId, keyFilename })
// Get the bucket and verify its existence.
const bucket = cloudStorage.bucket(bucketName)
bucket.exists().then(i => i[0] || console.error('This bucket does not exist!')).catch(console.error)

// Export our resolvers.
export default {
  Query: {
    // Get upvotes through this query.
    getUpvotes: async (_, { imageId }) => {
      // Ensure the entity exists before upvoting.
      const key = datastore.key(['Image', imageId.toString()])
      let data = (await datastore.get(key))[0]
      if (!data) {
        data = await datastore.insert({ key, data: { upvotes: [] } })
        data = (await datastore.get(key))[0]
      }
      datastore.save({ key, data })
      return data['upvotes'].length
    }
  },
  Mutation: {
    // Upvote through this query.
    upvote: async (_, { imageId, deviceId }) => {
      // Ensure the entity exists before upvoting.
      const key = datastore.key(['Image', imageId.toString()])
      let data = (await datastore.get(key))[0]
      if (!data) {
        data = await datastore.insert({ key, data: { upvotes: [deviceId] } })
        data = (await datastore.get(key))[0]
      } else if (!data['upvotes'].includes(deviceId)) data['upvotes'].push(deviceId)
      datastore.save({ key, data })
      return data['upvotes'].length
    },
    // Remove upvote through this query.
    downvoteIfVoted: async (_, { imageId, deviceId }) => {
      // Ensure the entity exists before upvoting.
      const key = datastore.key(['Image', imageId.toString()])
      let data = (await datastore.get(key))[0]
      if (!data) {
        data = await datastore.insert({ key, data: { upvotes: [] } })
        data = (await datastore.get(key))[0]
      } else if (data['upvotes'].includes(deviceId)) {
        data['upvotes'].splice(data['upvotes'].indexOf(deviceId), 1)
      }
      datastore.save({ key, data })
      return data['upvotes'].length
    }
  }
}
