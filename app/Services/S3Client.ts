;`use strict`

import Logger from '@ioc:Adonis/Core/Logger'
import Env from '@ioc:Adonis/Core/Env'
import { CreateBucketResponseObject } from 'Contracts/createBucketResponseData'
const path = require(`path`)
const S3 = require(`aws-sdk/clients/s3`)
const mimeTypes = require(`mime-types`)
const axios = require(`axios`)
const uuidv4 = require(`uuid`).v4
const fs = require(`fs`)

const s3Config = {
  access_key: Env.get(`S3_ACCESS_KEY`),
  secret_key: Env.get(`S3_SECRET_KEY`),
  region: Env.get(`S3_REGION`),
  bucket: Env.get(`S3_BUCKET`),
}

export default class S3Client {
  private s3Obj: any

  constructor() {
    this.s3Obj = null
  }

  public async init() {
    this.s3Obj = await this.getClient()
  }

  public async getClient() {
    const s3params = {
      accessKeyId: s3Config.access_key,
      secretAccessKey: s3Config.secret_key,
      region: s3Config.region,
      signatureVersion: `v4`,
    }

    const s3client = new S3(s3params)
    s3client.listObjectsV2()
    s3client.BUCKET = s3Config.bucket
    s3client.REGION = s3Config.region

    return s3client
  }

  public generateFileName(fileName: string): string {
    return `${uuidv4() + path.extname(fileName)}`
  }

  public getContentType(fileName: string): string {
    return mimeTypes.lookup(fileName)
  }

  public async createNewBucket(bucketName: string): Promise<CreateBucketResponseObject> {
    if (this.s3Obj === null) await this.init()
    return new Promise<CreateBucketResponseObject>((resolve, reject) => {
      this.s3Obj.createBucket(
        {
          Bucket: bucketName,
        },
        (err, data) => {
          if (err) return reject(err)
          resolve(data)
        }
      )
    })
  }

  public async generateSignedUrl(filePath: string, fileName: string): Promise<object> {
    if (this.s3Obj === null) await this.init()
    const contentType = this.getContentType(fileName)
    const params = {
      Bucket: this.s3Obj.BUCKET,
      Key: filePath && filePath !== `` ? `${filePath}/${fileName}` : `${fileName}`,
      Expires: 5 * 60, // 5 minutes
      ContentType: contentType,
    }
    const data = await new Promise<object>((resolve, reject) => {
      this.s3Obj.getSignedUrl(`putObject`, params, (err, url) => {
        if (err) {
          Logger.error(`Error while generating signed url===>`, err)
          return reject(err)
        }
        resolve({
          url,
          fileName,
          contentType,
        })
      })
    })
    return data
  }

  public async upload(fileName, filePath, file) {
    if (this.s3Obj === null) await this.init()
    const params = {
      Bucket: s3Config.bucket,
      Key: filePath && filePath !== `` ? `${filePath}/${fileName}` : `${fileName}`,
      Body: fs.createReadStream(file.tmpPath),
    }
    return new Promise<object>((resolve, reject) => {
      this.s3Obj.upload(params, (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
  }

  public async findDocument(fileName: string, filePath: string = ``): Promise<object> {
    if (this.s3Obj === null) await this.init()
    return new Promise<object>((resolve, reject) => {
      this.s3Obj.listObjectsV2(
        {
          Prefix: filePath,
          Bucket: this.s3Obj.BUCKET,
        },
        (err, data) => {
          if (err) {
            Logger.error(`Error in listing s3 objects===>`, err)
            return reject(err)
          }

          const files = data.Contents
          const matchText = filePath && filePath !== `` ? `${filePath}/${fileName}` : `${fileName}`
          const matchingFile = files.filter((file) => file.Key === matchText)[0]
          if (!matchingFile) return reject(new Error(`FILE_NOT_EXISTS_IN_S3`))
          resolve(matchingFile)
        }
      )
    })
  }

  public async getUrlFromBucket(fileName: string): Promise<string> {
    if (this.s3Obj === null) await this.init()
    return `https://${this.s3Obj.BUCKET}.${this.s3Obj.endpoint.hostname}/${fileName}`
  }

  public async base64Encode(file: string): Promise<string> {
    return new Promise<string>(function (resolve, reject) {
      axios
        .get(file, {
          responseType: `arraybuffer`,
        })
        .then((response) => {
          const data = `data:${response.headers[`content-type`]};base64,${Buffer.from(
            response.data,
            `binary`
          ).toString(`base64`)}`
          resolve(data)
        })
        .catch((err) => reject(err))
    })
  }

  public async delete(filePath: string): Promise<void> {
    if (this.s3Obj === null) {
      await this.init()
    }

    const params = {
      Bucket: this.s3Obj.BUCKET,
      Key: filePath,
    }

    await new Promise<void>((resolve, reject) => {
      this.s3Obj.deleteObject(params, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}
