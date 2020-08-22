import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AWSService {
  BucketName = environment.amazonS3.bucketName;

  constructor() { }

  private getS3Bucket(): any {
    const bucket = new S3(
      {
        accessKeyId: environment.amazonS3.accessKeyId,
        secretAccessKey: environment.amazonS3.secretAccessKey,
        region: environment.amazonS3.region
      }
    );

    return bucket;
  }

  createDirectory(folder, directory): Promise<any> {
    let dir = folder + directory + '/';
    return new Promise((resolve, reject) => { 
      this.getS3Bucket().putObject({ Bucket: this.BucketName, Key: dir}, function (err, data) {
        if (err) {
          reject(`There was an error creating directory`);
        } else { 
          resolve('Directory is created successfully');
        }
      });
    });
  }

  getFiles(folder): Promise<Array<S3File>> {
    return new Promise((resolve, reject) => {
      const bucketFiles = new Array<S3File>();

      const params = {
        Bucket: this.BucketName,
        Prefix: folder
      };
    
      this.getS3Bucket().listObjects(params, function (err, data) {
          if (err) {
            reject(`There was an error getting your files: ${err}`);
          } else { 
            const fileDatas = data.Contents;

            //console.log(fileDatas);

            fileDatas.forEach(function (file) {
              if(file.Key != folder) {
                bucketFiles.push(
                  new S3File(
                    file.Key, 
                    file.Key.replace(folder, ''),
                    file.Size, 
                    file.LastModified
                  )
                );
              }
            });

            return resolve(bucketFiles);
          }
        })
    });
  }

  downloadFile(key): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getS3Bucket().getObject({ 
        Bucket: this.BucketName, 
        Key: key 
      }, function (error, data) {
          if (error) {
            reject(error.message);
          } else {
          
            // alert("Loaded " + data.ContentLength + " bytes");
            // do something with data.Body

            //const string = new TextDecoder('utf-8').decode(data.Body);
            var a = document.createElement('a');
            var blob = new Blob([data.Body]);
            const url = window.URL.createObjectURL(blob);

            let fileNameArr = key.split("/");

            a.href = url;
            a.download = fileNameArr[fileNameArr.length - 1];
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();

            resolve();
          }
        }
      );
    });
  }

  uploadFile(folder, file): Promise<any> {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this.BucketName,
        Key: folder + file.name,
        Body: file,
        ACL: 'public-read',
        ContentType: file.type
      };

      this.getS3Bucket().upload(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });

      //for upload progress   
      /*bucket.upload(params).on('httpUploadProgress', function (evt) {
                console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
      }).send(function (err, data) {
          if (err) {
              console.log('There was an error uploading your file: ', err);
              return false;
          }
          console.log('Successfully uploaded file.', data);
          return true;
      });*/
    });
  }

  deleteFile(key) {
    return new Promise((resolve, reject) => {
      this.getS3Bucket().deleteObject({ 
          Bucket: this.BucketName, 
          Key: key 
        }, function (err, data) {
        if (err) {
          reject(err.message);
        } else {
          resolve('Successfully deleted file.');
        }
      });
    });
  }

}

class S3File implements S3FileModel {
  Key: string;
  Name: string;
  Size: number;
  LastModified: Date;
  IsFolder: boolean;
  Level: number;
  // SubDirectory: string;

  constructor(Key: string, Name: string, Size: number, LastModified: Date) {
    let tempName = Name.replace(/\/$/, "");
    let tempNameArr = tempName.split("/");
    let isFolder = Name.endsWith("/")? true: false;
    

    this.Key = Key;
    this.Name = tempNameArr[tempNameArr.length - 1];
    this.Size = Size;
    this.LastModified = LastModified;
    this.IsFolder = isFolder;
    this.Level = tempNameArr.length;
    // this.SubDirectory = isFolder? Name: null;
  }
}
