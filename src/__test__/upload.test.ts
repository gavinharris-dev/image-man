import app from "../app";
import request from "supertest";
import { upload } from "../utils/storage";

jest.mock("../utils/storage");

describe("POST File", () => {
  it("Should allow me to upload a file", (done) => {
    request(app)
      .post("/")
      .field("metadata", JSON.stringify({}))
      .attach("img", "src/__test__/assets/koala.jpg")
      .expect(201, (err, response) => {
        if (err) {
          return done(err);
        }

        try {
          expect(upload).toHaveBeenCalled();
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
