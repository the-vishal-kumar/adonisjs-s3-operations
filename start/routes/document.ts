import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post(`generateSignedUrl`, `DocumentController.generateSignedUrl`)
  Route.post(`upload`, `DocumentController.upload`)
  Route.get(`download`, `DocumentController.download`)
  Route.delete(`delete`, `DocumentController.delete`)
})
  .namespace(`App/Controllers`)
  .prefix(`document`)
