import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post(`create-bucket`, `BucketController.createBucket`)
})
  .namespace(`App/Controllers`)
  .prefix(`s3`)
