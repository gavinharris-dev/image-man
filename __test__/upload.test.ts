import app from "../src/app";
import request from "supertest";
import * as storage from "../src/utils/storage";

const storageUploadSpy = jest.spyOn(storage, "upload");

beforeEach(() => storageUploadSpy.mockImplementation(jest.fn()));

describe("Server Error", () => {
  beforeEach(() =>
    storageUploadSpy.mockImplementation(() => {
      throw new Error("this is an error");
    })
  );

  it("Shoud return an error", (done) => {
    request(app)
      .post("/")
      .attach("img", "__test__/assets/koala.jpg")
      .expect(500, done);
  });
});

describe("User errors", () => {
  it("Should require a file", (done) => {
    request(app)
      .post("/")
      .expect(400, (err, response) => {
        expect(response.body.msg).toEqual("No file uplodated");
        done();
      });
  });

  it("The file should be in the form field 'img'", (done) => {
    request(app)
      .post("/")
      .attach("notImg", "__test__/assets/koala.jpg")
      .expect(400, (err, response) => {
        expect(response.body.msg).toEqual(
          "Upload the image the form name `img`"
        );
        done();
      });
  });

  it("There should only be one file in 'img'", (done) => {
    request(app)
      .post("/")
      .attach("img", "__test__/assets/koala.jpg")
      .attach("img", "__test__/assets/koala.jpg")
      .expect(400, (err, response) => {
        expect(response.body.msg).toEqual(
          "I'm not supporting multiple files yet. Sorry."
        );
        done();
      });
  });
});

describe("POST File", () => {
  it("Should allow me to upload a file", (done) => {
    request(app)
      .post("/")
      .attach("img", "__test__/assets/koala.jpg")
      .expect(201, (err, response) => {
        if (err) {
          return done(err);
        }

        try {
          expect(storageUploadSpy).toHaveBeenCalled();
          expect(response.body).toHaveProperty("url");
          expect(response.body.url).toEqual(
            "http://localhost:3000/f/2d8250fb9d8ad6a3a88ee29789084427"
          );
          done();
        } catch (error) {
          return done(error);
        }
      });
  });
});
