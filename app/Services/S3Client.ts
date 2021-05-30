;`use strict`

import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'
import { S3, IAM } from 'aws-sdk'
const path = require(`path`)
const mimeTypes = require(`mime-types`)
const axios = require(`axios`)
const uuidv4 = require(`uuid`).v4
const fs = require(`fs`)

const s3Config = {
  access_key: Env.get(`S3_ACCESS_KEY`),
  secret_key: Env.get(`S3_SECRET_KEY`),
  region: Env.get(`S3_REGION`),
}

export default class S3Client {
  private s3Obj: S3
  private iamObj: IAM

  public async init() {
    const { s3client, iamClient } = await this.getClient()
    this.s3Obj = s3client
    this.iamObj = iamClient
  }

  public async getClient() {
    const params = {
      accessKeyId: s3Config.access_key,
      secretAccessKey: s3Config.secret_key,
      region: s3Config.region,
      signatureVersion: `v4`,
    }

    const s3client = new S3(params)
    const iamClient = new IAM(params)

    return { s3client, iamClient }
  }

  public generateFileName(fileName: string): string {
    return `${uuidv4() + path.extname(fileName)}`
  }

  public getContentType(fileName: string): string {
    return mimeTypes.lookup(fileName)
  }

  public async createBucket(bucketName: string): Promise<S3.CreateBucketOutput> {
    await this.init()

    const bucketParams = {
      Bucket: bucketName,
    }

    return new Promise<S3.CreateBucketOutput>((resolve, reject) => {
      this.s3Obj.createBucket(bucketParams, (err, data) => {
        if (err) {
          Logger.error(err, `Error in S3.createBucket`)
          return reject(err)
        }
        resolve(data)
      })
    })
  }

  public async updateBucketPolicy(bucketName: string): Promise<void> {
    await this.init()

    const bucketPolicy = {
      Version: `2012-10-17`,
      Statement: [
        {
          Effect: `Allow`,
          Principal: `*`,
          Action: [`s3:ListBucket`, `s3:GetBucketLocation`],
          Resource: `arn:aws:s3:::${bucketName}`,
        },
        {
          Effect: `Allow`,
          Principal: `*`,
          Action: [`s3:PutObject`, `s3:PutObjectAcl`, `s3:GetObject`, `s3:DeleteObject`],
          Resource: `arn:aws:s3:::${bucketName}/*`,
        },
      ],
    }

    const bucketPolicyParams = {
      Bucket: bucketName,
      Policy: JSON.stringify(bucketPolicy),
    }

    return new Promise((resolve, reject) => {
      this.s3Obj.putBucketPolicy(bucketPolicyParams, (err) => {
        if (err) {
          Logger.error(err, `Error in S3.putBucketPolicy`)
          return reject(err)
        }
        resolve()
      })
    })
  }

  public async updateBucketCors(bucketName: string) {
    await this.init()

    const corsParams = {
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: [`*`],
            AllowedMethods: [`PUT`],
            AllowedOrigins: [`*`],
            ExposeHeaders: [],
          },
        ],
      },
    }

    return new Promise((resolve, reject) => {
      this.s3Obj.putBucketCors(corsParams, (err) => {
        if (err) {
          Logger.error(err, `Error in S3.putBucketCors`)
          return reject(err)
        }
        resolve(null)
      })
    })
  }

  public async createIAMPolicy(
    bucketName: string,
    policyName: string
  ): Promise<IAM.CreatePolicyResponse> {
    await this.init()

    const myManagedPolicy = {
      Version: `2012-10-17`,
      Statement: [
        {
          Sid: `VisualEditor0`,
          Effect: `Allow`,
          Action: [
            `s3:PutObject`,
            `s3:GetObject`,
            `s3:PutObjectVersionAcl`,
            `s3:DeleteObject`,
            `s3:PutObjectAcl`,
          ],
          Resource: `arn:aws:s3:::${bucketName}/*`,
        },
        {
          Sid: `VisualEditor1`,
          Effect: `Allow`,
          Action: `s3:ListBucket`,
          Resource: `arn:aws:s3:::${bucketName}`,
        },
      ],
    }

    const params: IAM.CreatePolicyRequest = {
      PolicyDocument: JSON.stringify(myManagedPolicy),
      PolicyName: `Access${policyName}Bucket`,
    }

    return new Promise<IAM.CreatePolicyResponse>((resolve, reject) => {
      this.iamObj.createPolicy(params, (err, data) => {
        if (err) {
          Logger.error(err, `Error in IAM.createPolicy`)
          reject(err)
        }
        resolve(data)
      })
    })
  }

  public async createIAMUser(userName: string, arn: string): Promise<IAM.CreateUserResponse> {
    await this.init()

    const params: IAM.CreateUserRequest = {
      UserName: userName,
      PermissionsBoundary: arn,
    }

    return new Promise<IAM.CreateUserResponse>((resolve, reject) => {
      this.iamObj.createUser(params, (err, data) => {
        if (err) {
          Logger.error(err, `Error in IAM.createUser`)
          reject(err)
        }
        resolve(data)
      })
    })
  }

  public async createIAMAccessKey(userName: string): Promise<IAM.CreateAccessKeyResponse> {
    await this.init()

    const params = {
      UserName: userName,
    }

    return new Promise<IAM.CreateAccessKeyResponse>((resolve, reject) => {
      this.iamObj.createAccessKey(params, (err, data) => {
        if (err) {
          Logger.error(err, `Error in IAM.createAccessKey`)
          return reject(err)
        }
        resolve(data)
      })
    })
  }

  public async generateSignedUrl(
    fileName: string,
    filePath: string,
    bucketName: string
  ): Promise<object> {
    await this.init()

    const contentType = this.getContentType(fileName)
    const params = {
      Bucket: bucketName,
      Key: filePath && filePath !== `` ? `${filePath}/${fileName}` : `${fileName}`,
      Expires: 5 * 60, // 5 minutes
      ContentType: contentType,
    }

    return new Promise<object>((resolve, reject) => {
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
  }

  public async upload(fileName: string, filePath: string, bucketName: string, file: any) {
    await this.init()

    const params = {
      Bucket: bucketName,
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

  public async findDocument(
    fileName: string,
    filePath: string = ``,
    bucketName: string
  ): Promise<object> {
    await this.init()

    return new Promise<object>((resolve, reject) => {
      this.s3Obj.listObjectsV2(
        {
          Prefix: filePath,
          Bucket: bucketName,
        },
        (err, data) => {
          if (err) {
            Logger.error(`Error in listing s3 objects===>`, err)
            return reject(err)
          }

          const files = data.Contents || []
          const matchText = filePath && filePath !== `` ? `${filePath}/${fileName}` : `${fileName}`
          const matchingFile = files.filter((file) => file.Key === matchText)[0]

          if (!matchingFile) return reject(new Error(`FILE_NOT_EXISTS_IN_S3`))

          resolve(matchingFile)
        }
      )
    })
  }

  public async getUrlFromBucket(fileName: string, bucketName: string): Promise<string> {
    await this.init()

    return `https://${bucketName}.${this.s3Obj.endpoint.hostname}/${fileName}`
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
        .catch((err) => {
          Logger.error(err, `Error in base64Encode`)
          reject(err)
        })
    })
  }

  public async delete(filePath: string, bucketName: string): Promise<void> {
    await this.init()

    const params = {
      Bucket: bucketName,
      Key: filePath,
    }

    await new Promise<void>((resolve, reject) => {
      this.s3Obj.deleteObject(params, (err) => {
        if (err) {
          Logger.error(err, `Error in S3.deleteObject`)
          return reject(Error(`FILE_CANNOT_BE_DELETED`))
        }
        resolve()
      })
    })
  }
}
