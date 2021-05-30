import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post(`create-user`, `BucketController.createUser`)
})
  .namespace(`App/Controllers`)
  .prefix(`iam`)
