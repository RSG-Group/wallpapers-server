export default {
  Query: {
    getUpvotes: (_, { imageId }) => 10,
    upvoteAndQuery: (_, { imageId, deviceId }) => 10,
    downvoteAndQuery: (_, { imageId, deviceId }) => 10
  }
}
