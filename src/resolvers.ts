// Import the Google Cloud APIs.
import * as Datastore from '@google-cloud/datastore'
import * as Storage from '@google-cloud/storage'
// Import the settings we need to use.
import 'json5/lib/register'
import { // eslint-disable-next-line no-unused-vars
  database, storage, mongourl, authjsonpath, projectId, folderPath, bucketName
} from '../settings.json5'

// Initialize connection to Datastore and Cloud Storage.
// Potentially: MongoDB, Spanner, Firestore?
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
    getUpvotes: (_, { imageId }) => datastore.get(datastore.key(['Image', imageId.toString()]))
      .then(i => i[0]['upvotes'].length), // If entity didn't exist, upvotes = 0.
    // Upvote through this query.
    upvoteAndQuery: async (_, { imageId, deviceId }) => {
      // Ensure the entity exists before upvoting.
      const key = datastore.key(['Image', imageId.toString()])
      await datastore.save({ key, data: {} })
      const data = (await datastore.get(key))[0]
      if (data['upvotes']) data['upvotes'].push(deviceId)
      else data['upvotes'] = [deviceId]
      datastore.save({ key, data })
      return data['upvotes'].length
    },
    downvoteAndQuery: async (_, { imageId, deviceId }) => {
      // Ensure the entity exists before upvoting.
      const key = datastore.key(['Image', imageId.toString()])
      await datastore.save({ key, data: {} })
      const data = (await datastore.get(key))[0]
      if (data['upvotes'].includes(deviceId)) {
        data['upvotes'].splice(data['upvotes'].indexOf(deviceId), 1)
      }
      datastore.save({ key, data })
      return data['upvotes'].length
    }
  }
}
