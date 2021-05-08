import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FileNameAndFilePathValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    fileName: schema.string(),
    filePath: schema.string(),
  })

  public messages = {
    'fileName.required': `File name is required`,
    'filePath.required': `File path is required`,
  }
}
