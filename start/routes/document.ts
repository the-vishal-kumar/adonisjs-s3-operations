import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post(`create-new-bucket`, `DocumentController.createNewBucket`)

  Route.post(`generate-signed-url`, `DocumentController.generateSignedUrl`)

  Route.post(`upload`, `DocumentController.upload`)
  Route.get(`download`, `DocumentController.download`)
  Route.delete(`delete`, `DocumentController.delete`)
})
  .namespace(`App/Controllers`)
  .prefix(`document`)
