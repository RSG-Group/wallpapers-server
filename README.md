# wallpapers-server

Back-end for wallpapers. Former submodule of wallpapers repo.

Uses Google Cloud Datastore and Cloud Storage, but supports MongoDB and a local folder for local development.

Note: MongoDB and local folder development is NOT SUPPORTED at the moment. This is to get with initial setup as quick as possible.

[For authentication with Google Cloud, see here.](https://cloud.google.com/docs/authentication/getting-started)

`settings.json5`

```json
{
  "database": "<datastore or mongodb>",
  "storage": "<folder or cloud-storage>",
  // Required for MongoDB.
  "mongodburl": "<url to MongoDB instance>",
  // Required for Google Cloud to authenticate if environment variable not provided
  "authjsonpath": "<path to JSON>",
  // Required for Google Cloud every time
  "projectId": "<ID of your project>",
  // Required for folder
  "folderPath": "<path to folder with wallpapers>",
  // Required for Cloud Storage
  "bucketName": "<name of bucket w/ wallpapers>"
}
```
