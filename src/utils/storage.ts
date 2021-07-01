import { Storage } from "@google-cloud/storage";
import { Readable } from "stream";
import { UploadedFile } from "express-fileupload";
const storage = new Storage();
const bucket = storage.bucket("image-man.appspot.com");

console.log("ENV", process.env.GOOGLE_APPLICATION_CREDENTIALS);

export let upload = function upload(file: UploadedFile, name: string) {
  return new Promise<void>((resolve, reject) => {
    const writeStream = bucket.file(`${name}`).createWriteStream();

    writeStream
      .on("finish", () => {
        console.log("Resolve upload");
        resolve();
      })
      .on("error", (error) => {
        console.log("Error upload", error.message);
        reject(error);
      });

    Readable.from(file.data).pipe(writeStream);
  });
};

export let getFileReadStream = (name: string): Readable =>
  bucket.file(name).createReadStream();
