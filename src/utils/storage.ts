import { Storage } from "@google-cloud/storage";
import { Readable } from "stream";
import { UploadedFile } from "express-fileupload";
const storage = new Storage();
const bucket = storage.bucket("image-man.appspot.com");

export let upload = function upload(file: UploadedFile, name: string) {
  return new Promise<void>((resolve, reject) => {
    const writeStream = bucket.file(`${name}`).createWriteStream();

    writeStream
      .on("finish", () => {
        resolve();
      })
      .on("error", (error) => {
        reject(error);
      });

    Readable.from(file.data).pipe(writeStream);
  });
};

export let getFileReadStream = (name: string): Readable =>
  bucket.file(name).createReadStream();
