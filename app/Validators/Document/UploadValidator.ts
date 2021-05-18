import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UploadValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    filePath: schema.string.optional(),
    file: schema.file({
      size: `10mb`,
      extnames: [`pdf`, `jpg`, `gif`, `png`],
    }),
  })

  public messages = {
    'filePath.required': `File path is required`,
  }
}
