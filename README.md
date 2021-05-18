# Adonisjs-S3-Operations

* It is a sample NodeJs application demonstration AWS S3 operations such as upload, download or delete file.
* It uses AdonisJs as NodeJs framework

## Initial setup
1. Cloning
    - Open terminal and run `git clone git@github.com:the-vishal-kumar/adonisjs-s3-operations.git`

1. Install modules using yarn
    - Go to Project Path `cd adonisjs-s3-operations`
    - Run `yarn install` in the terminal

1. Set environment variables
    - Copy `.env.sample` from root directory and paste it as `.env` to root directory
    - Generate S3 key from Amazon S3 Console and paste them in respective keys

## Development

1. Run server locally without Docker
    - Run `yarn dev` to start API server with `nodemon` support, or
    - Run `yarn start`
1. Import `Adonisjs-S3-Operations.postman_collection` in [Postman]
    - You can try APIs to upload, download and delete photos for your S3 Bucket
1. Currently you can only upload `pdf`, `jpg`, `gif`, `png` files of size less than or equal to 10MB because of a validator (See path - `app/Validators/Document/UploadValidator`). Remove the validations to upload file of any file format and size

## APIs

1. POST **{{host}}/document/generateSignedUrl**

    > body

        {
            "fileName": "s3-operations.png", // string
            "filePath": "s3Uploaded"
        }

    Front-end is supposed to hit the API, and receive a Pre-signed url. Then front-end has to upload file to this url in a PUT method.

1. POST **{{host}}/document/upload**

    > body

        {
            "filePath": "s3Uploaded",
            "file": "s3-operations.png" // file
        }

    Front-end is sending file to back-end which is then uploading file to S3 bucket.

1. GET **localhost:3333/document/download?fileName=*006ea7e2-813a-42ae-bc0d-1ff85167c335.png*&filePath=*s3Uploaded***

    Front-end can download any file by providing file name and file path. Backend will find the file in S3 bucket and then return it in response.

1. DELETE **localhost:3333/document/delete?fileName=*006ea7e2-813a-42ae-bc0d-1ff85167c335.png*&filePath=*s3Uploaded***

    Front-end can delete any file by providing file name and file path. Backend will find the file in S3 bucket and then delete it and send success response.

## Technology
- Language - [NodeJs]
- Framework - [Adonis]
- API Testing - [Postman]

## Folder Structure
    .
    ├──app
    |   ├──Controllers
    |   |   |   ├──DocumentController.ts
    |   ├──Exceptions
    |   |   ├──ErrorException.ts
    |   |   ├──Handler.ts
    |   ├──Services
    |   |   ├──S3Client.ts
    |   ├──Validators
    |   |   ├──Document
    |   |   |   ├──FileNameAndFilePathValidator.ts
    |   |   |   ├──UploadValidator.ts
    ├──start
    |   ├──routes
    |   |   ├──document.ts
    |   |   ├──index.ts
    ├──env.ts
    ├──server.ts
    └──package.json

## License
MIT

## Meet The Makers
[Vishal Kumar] - Software Engineer 👨‍💻 and an Aspiring Entrepreneur👨‍💼  
[funGyaan] - Promoting Curiosity

[NodeJs]: <https://nodejs.dev/>
[Adonis]: <https://adonisjs.com/>
[Postman]: <https://www.postman.com/>
[Vishal Kumar]: <https://www.linkedin.com/in/the-vishal-kumar/>
[funGyaan]: <https://www.funGyaan.com/>