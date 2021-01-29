const request = require("supertest");
const app = require("../app");

describe("/", () => {
  let server = null;
  beforeAll(() => {
    server = request(app);
  });

  afterAll(async () => {
    await server.close();
  });
  describe("GET /", () => {
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

  describe("POST /validate-rule", () => {
    let server = null;

    beforeAll(() => {
      server = request(app);
    });

    it("should exists", async () => {
      const res = await server.post("/validate-rule");
      expect(res.statusCode).not.toBe(404);
    });

    it("should throw if rule is not set", async () => {
      const res = await server.post("/validate-rule").send({});
      expect(res.statusCode).toBe(400);
    });

    it("should return a message when rule is not set", async () => {
      const res = await server.post("/validate-rule").send({});
      expect(res.body.message).toBe("rule is required.");
      expect(res.body.status).toBe("error");
      expect(res.body.data).toBeNull();
    });

    it("should throw if rule is not set", async () => {
      const res = await server.post("/validate-rule").send({});
      expect(res.statusCode).toBe(400);
    });

    it("should return a message when data is not set", async () => {
      const res = await server.post("/validate-rule").send({ rule: {} });
      expect(res.body.message).toBe("data is required.");
      expect(res.body.status).toBe("error");
      expect(res.body.data).toBeNull();
    });
  });
});
