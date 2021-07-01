import app from "../src/app";
import request from "supertest";
import * as storage from "../src/utils/storage";
import fs from "fs";
import path from "path";

const getFileReadStreamSpy = jest.spyOn(storage, "getFileReadStream");

beforeAll(() =>
  getFileReadStreamSpy.mockImplementation(() =>
    fs.createReadStream(path.join(__dirname, "assets", "koala.jpg"))
  )
);

beforeEach(() => getFileReadStreamSpy.mockClear());

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
        expect(response.body.msg).toEqual(
          "Expected positive integer for width but received NaN of type number"
        );
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
        expect(response.body.msg).toEqual(
          "Expected positive integer for height but received NaN of type number"
        );
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
        expect(response.body.msg).toEqual(
          "Expected integer between 1 and 100 for quality but received NaN of type number"
        );
        done();
      });
  });

  it("Should return an error when multiple Heights provided", (done) => {
    request(app)
      .get("/f/test?h=100&h=120")
      .expect(400, (err, response) => {
        if (err) {
          return done(err);
        }
        expect(response.body.msg).toEqual("Bad Parameter: height (h)");
        expect(getFileReadStreamSpy).not.toHaveBeenCalled();
        done();
      });
  });

  it("Should return an error when multiple Widths provided", (done) => {
    request(app)
      .get("/f/test?w=100&w=120")
      .expect(400, (err, response) => {
        if (err) {
          return done(err);
        }
        expect(response.body.msg).toEqual("Bad Parameter: width (w)");
        expect(getFileReadStreamSpy).not.toHaveBeenCalled();
        done();
      });
  });

  it("Should return an error when multiple Qualities provided", (done) => {
    request(app)
      .get("/f/test?q=100&q=120")
      .expect(400, (err, response) => {
        if (err) {
          return done(err);
        }
        expect(response.body.msg).toEqual("Bad Parameter: quality (q)");
        expect(getFileReadStreamSpy).not.toHaveBeenCalled();
        done();
      });
  });
});
