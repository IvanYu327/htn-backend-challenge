import { server } from "./server.js";
import supertest from "supertest";
const request = supertest(server);

describe("General Testing", () => {
  it("GET / should return a 'pong'", async () => {
    const res = await request.get("/");

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual("pong");
  });
});

describe("User Endpoints", () => {
  it("GET /user should show all users", async () => {
    const res = await request.get("/users");

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body.data.length).toEqual(250);
    res.body.data.forEach((user) => {
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("company");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("phone");
      expect(user).toHaveProperty("is_registered");
      expect(user).toHaveProperty("skills");
    });
  });

  it("GET /users/?limit=2&offset=1 should show 2 users", async () => {
    const res = await request.get("/users/?limit=2&offset=1");

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body.data.length).toEqual(2);
  });

  it("GET /users/?limit=abc should show a bad request", async () => {
    const res = await request.get("/users/?limit=abc");

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining("json"));
  });

  it("GET /user/3 should show a user", async () => {
    const res = await request.get("/users/3");
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty("name");
    expect(res.body.data).toHaveProperty("company");
    expect(res.body.data).toHaveProperty("email");
    expect(res.body.data).toHaveProperty("phone");
    expect(res.body.data).toHaveProperty("is_registered");
    expect(res.body.data).toHaveProperty("skills");
  });

  it("GET /user/PlsInterviewMe should show a bad request", async () => {
    const res = await request.get("/users/PlsInterviewMe");
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining("json"));
  });
});

describe("Skills Endpoints", () => {
  it("GET /skills/:skill should show a count of the skill's occurence", async () => {
    const res = await request.get("/skills/php");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("count");
  });

  it("GET /skills/ThisIsProbablyNotASkill should show 0 occurences", async () => {
    const res = await request.get("/skills/ThisIsProbablyNotASkill");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("count");
    expect(res.body.count).toEqual(0);
  });

  it("GET /skills/?min_frequency=2&max_frequency=5 should return an array of skills", async () => {
    const res = await request.get("/skills/?min_frequency=2&max_frequency=5");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("message");
    res.body.data.forEach((skill) => {
      expect(typeof skill).toEqual("string");
    });
  });

  it("GET /skills/?min_frequency=6&max_frequency=2 should show a bad request", async () => {
    const res = await request.get("/skills/?min_frequency=6&max_frequency=2");
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining("json"));
  });
});
