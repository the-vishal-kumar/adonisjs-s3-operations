import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import ErrorException from './ErrorException'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error, { response }) {
    const existingResponse = response?.response
    let statusCode = existingResponse?.statusCode

    if (error instanceof ErrorException) {
      statusCode = 400
    }

    response.status(statusCode).send({
      status: statusCode,
      meta: null,
      data: {},
      errors: error.messages ? error.messages.errors : [],
      message: error.message,
    })
  }
}
