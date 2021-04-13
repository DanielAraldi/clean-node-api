import request from "supertest";
import { app } from "../config/app";

describe("Content Type Middleware", () => {
  test("Should return default content type as json", async () => {
    app.get("/test_content_type", (req, res) => {
      res.send("");
    });
    await request(app)
      .get("/test_content_type")
      // If there is a JSON word in any type of content it will be accepted by default
      .expect("content-type", /json/);
  });
});
