import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post(`generate-signed-url`, `DocumentController.generateSignedUrl`)
  Route.resource(`/`, `DocumentController`).only([`store`, `show`, `destroy`])
}).namespace(`App/Controllers`)
  .prefix(`iam`)
