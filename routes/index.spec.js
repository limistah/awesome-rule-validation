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

    // a/ The rule and data fields are required.
    it("should throw if rule is not set", async () => {
      const res = await server.post("/validate-rule").send({});
      expect(res.statusCode).toBe(400);
    });

    // a/ The rule and data fields are required.
    it("should return a message when rule is not set", async () => {
      const res = await server.post("/validate-rule").send({});
      expect(res.body.message).toBe("rule is required.");
      expect(res.body.status).toBe("error");
      expect(res.body.data).toBeNull();
    });

    // a/ The rule and data fields are required.
    it("should throw if rule is not set", async () => {
      const res = await server.post("/validate-rule").send({});
      expect(res.statusCode).toBe(400);
    });

    // a/ The rule and data fields are required.
    it("should return a message when data is not set", async () => {
      const res = await server.post("/validate-rule").send({ rule: {} });
      expect(res.body.message).toBe("data is required.");
      expect(res.body.status).toBe("error");
      expect(res.body.data).toBeNull();
    });

    // b/ The rule field should be a valid JSON object
    it("should fail if rule is not a JSON object", async () => {
      const res = await server
        .post("/validate-rule")
        .send({ rule: 1, data: {} });
      expect(res.body.message).toBe("rule should be an object.");
      expect(res.body.status).toBe("error");
      expect(res.body.data).toBeNull();
      expect(res.statusCode).toBe(400);
    });
    // it("should pass if rule is a JSON object", async () => {
    //   let res = await server
    //     .post("/validate-rule")
    //     .send({ rule: {}, data: {} });
    //   expect(res.statusCode).toBe(200);

    //   res = await server.post("/validate-rule").send({ rule: "{}", data: {} });
    //   expect(res.statusCode).toBe(200);
    // });
    // 2b1 rule should contain field,condition & condition_value
    it("should pass if rule has field, condition, condition_value properties", async () => {
      let res = await server
        .post("/validate-rule")
        .send({ rule: "{}", data: {} });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("rule.field is required.");
    });

    it("should pass if rule has condition property", async () => {
      let res = await server
        .post("/validate-rule")
        .send({ rule: { field: "name" }, data: {} });
      expect(res.body.message).toBe("rule.condition is required.");
    });

    it("should pass if rule has condition_value property", async () => {
      let res = await server
        .post("/validate-rule")
        .send({ rule: { field: "name", condition: "$eq" }, data: {} });
      expect(res.body.message).toBe("rule.condition_value is required.");
    });
  });
});
