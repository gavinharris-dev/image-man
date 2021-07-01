import app from "../app";
import request from "supertest";
import * as storage from "../utils/storage";
import fs from "fs";
import path from "path";

const getFileReadStreamSpy = jest.spyOn(storage, "getFileReadStream");

getFileReadStreamSpy.mockImplementation(() =>
  fs.createReadStream(path.join(__dirname, "assets", "koala.jpg"))
);

describe("Download Success", () => {
  it("Should allow me to download a file", (done) => {
    request(app)
      .get("/f/test")
      .expect(200, (err, response) => {
        if (err) {
          return done(err);
        }

        expect(getFileReadStreamSpy).toHaveBeenCalled();
        done();
      });
  });
});

describe("Download Errors", () => {
  it("Should return an error when a silly width is provided", (done) => {
    request(app)
      .get("/f/test?w=ee")
      .expect(400, (err, response) => {
        if (err) {
          return done(err);
        }

        expect(getFileReadStreamSpy).toHaveBeenCalled();
        done();
      });
  });

  it("Should return an error when a silly height is provided", (done) => {
    request(app)
      .get("/f/test?h=ee")
      .expect(400, (err, response) => {
        if (err) {
          return done(err);
        }

        expect(getFileReadStreamSpy).toHaveBeenCalled();
        done();
      });
  });

  it("Should return an error when a silly quality is provided", (done) => {
    request(app)
      .get("/f/test?q=ee")
      .expect(400, (err, response) => {
        if (err) {
          return done(err);
        }

        expect(getFileReadStreamSpy).toHaveBeenCalled();
        done();
      });
  });
});
