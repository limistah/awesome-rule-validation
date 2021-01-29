const request = require("supertest");
const app = require("../app");

describe("/", () => {
  describe("GET /", () => {
    let server = null;

    beforeAll(() => {
      server = request(app);
    });

    it("should exists", async () => {
      const res = await server.get("/");
      expect(res.statusCode).toEqual(200);
    });

    it("should have required fields", async () => {
      const res = await server.get("/");
      expect(res.body.message).toEqual("My Rule-Validation API");
      expect(res.body.status).toEqual("success");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data.name).toEqual("Aleem Isiaka");
      expect(res.body.data.github).toEqual("@limistah");
      expect(res.body.data.twitter).toEqual("@limistah");
      expect(res.body.data.email).toEqual("aleemisiaka@gmail.com");
      expect(res.body.data.mobile).toEqual("08120254644");
    });
  });
});
