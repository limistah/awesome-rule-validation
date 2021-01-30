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
    it("should throw if rule has no field property", async () => {
      let res = await server
        .post("/validate-rule")
        .send({ rule: "{}", data: {} });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("rule.field is required.");
    });

    it("should throw if rule has no condition property", async () => {
      let res = await server
        .post("/validate-rule")
        .send({ rule: { field: "name" }, data: {} });
      expect(res.body.message).toBe("rule.condition is required.");
    });

    it("should throw if rule has no valid condition_value property", async () => {
      let res = await server
        .post("/validate-rule")
        .send({ rule: { field: "name", condition: "eq" }, data: {} });
      expect(res.body.message).toBe("rule.condition_value is required.");
    });

    // c/ The data field can be any of:
    // c1/ A valid JSON object
    it("should pass if data is a JSON object", async () => {
      let res = await server.post("/validate-rule").send({
        rule: { field: "name", condition: "eq", condition_value: "Aleem" },
        data: { name: "Aleem" },
      });
      expect(res.statusCode).toBe(200);
    });
    // c3/ A string
    it("should pass if data is string", async () => {
      let res = await server.post("/validate-rule").send({
        rule: { field: "name", condition: "eq", condition_value: "Aleem" },
        data: '{"name":"Aleem"}',
      });
      expect(res.statusCode).toBe(200);
    });
    it("should fail if data is a number", async () => {
      let res = await server.post("/validate-rule").send({
        rule: { field: "name", condition: "eq", condition_value: "Aleem" },
        data: 1,
      });
      expect(res.statusCode).toBe(400);
    });
    // g/ If the field specified in the rule object is missing from the data passed, your endpoint response (HTTP 400 status code) should be
    it("should fail if field value is not in data", async () => {
      let res = await server.post("/validate-rule").send({
        rule: { field: "name", condition: "eq", condition_value: "eq" },
        data: {},
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("field name is missing from data.");
    });
    // Failing eq condition
    it("should fail for unmatching eq condition", async () => {
      let res = await server.post("/validate-rule").send({
        rule: { field: "firstName", condition: "eq", condition_value: "Aleem" },
        data: { firstName: "Isiaka" },
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("field firstName failed validation.");
    });
    it("should fail for matching eq condition on a string", async () => {
      let res = await server.post("/validate-rule").send({
        rule: {
          field: "0",
          condition: "eq",
          condition_value: "a",
        },
        data: "damien-marley",
      });
      expect(res.body.message).toBe("field 0 failed validation.");
      expect(res.statusCode).toBe(400);
    });
    // Passing eq condition
    it("should pass for matching eq condition", async () => {
      let res = await server.post("/validate-rule").send({
        rule: { field: "firstName", condition: "eq", condition_value: "Aleem" },
        data: { firstName: "Aleem" },
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("field firstName successfully validated.");
    });
    it("should pass for matching eq condition on a string", async () => {
      let res = await server.post("/validate-rule").send({
        rule: {
          field: "0",
          condition: "eq",
          condition_value: "d",
        },
        data: "damien-marley",
      });
      expect(res.body.message).toBe("field 0 successfully validated.");
      expect(res.statusCode).toBe(200);
    });
    // Failing contains condition
    it("should fail for unmatching contains condition", async () => {
      let res = await server.post("/validate-rule").send({
        rule: {
          field: "5",
          condition: "contains",
          condition_value: "rocinante",
        },
        data: ["The Nauvoo", "The Razorback", "The Roci", "Tycho"],
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("field 5 is missing from data.");
    });
    // Passing contains condition
    it("should pass for matching contains condition", async () => {
      let res = await server.post("/validate-rule").send({
        rule: {
          field: "3",
          condition: "contains",
          condition_value: "Tycho",
        },
        data: ["The Nauvoo", "The Razorback", "The Roci", "Tycho"],
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("field 3 successfully validated.");
    });

    // Failing neq condition
    it("should fail for matching neq condition", async () => {
      let res = await server.post("/validate-rule").send({
        rule: {
          field: "firstName",
          condition: "neq",
          condition_value: "Aleem",
        },
        data: { firstName: "Aleem" },
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("field firstName failed validation.");
    });
    it("should fail for matching neq condition on a string", async () => {
      let res = await server.post("/validate-rule").send({
        rule: {
          field: "1",
          condition: "neq",
          condition_value: "a",
        },
        data: "damien-marley",
      });
      expect(res.body.message).toBe("field 1 failed validation.");
      expect(res.statusCode).toBe(400);
    });
    // Passing eq condition
    it("should pass for unmatching neq condition", async () => {
      let res = await server.post("/validate-rule").send({
        rule: {
          field: "firstName",
          condition: "neq",
          condition_value: "Aleem",
        },
        data: { firstName: "Isiaka" },
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("field firstName successfully validated.");
    });
    it("should pass for unmatching eq condition on a string", async () => {
      let res = await server.post("/validate-rule").send({
        rule: {
          field: "0",
          condition: "neq",
          condition_value: "a",
        },
        data: "damien-marley",
      });
      expect(res.body.message).toBe("field 0 successfully validated.");
      expect(res.statusCode).toBe(200);
    });
    // Failing gt condition
    it("should fail for unmatching gt condition", async () => {
      let res = await server.post("/validate-rule").send({
        rule: {
          field: "total",
          condition: "gt",
          condition_value: "10",
        },
        data: { total: "20" },
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("field total failed validation.");
    });
    // Passing gt condition
    it("should pass for matching gt condition", async () => {
      let res = await server.post("/validate-rule").send({
        rule: {
          field: "total",
          condition: "gt",
          condition_value: "20",
        },
        data: { total: "20" },
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("field total successfully validated.");
    });
  });
});
