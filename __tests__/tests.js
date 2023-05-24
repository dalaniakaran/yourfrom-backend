const request = require("supertest");
const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("UserForm test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4001, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    await server.close();
  });
  test("check wether a user can be created", async () => {
    const response = await agent.post("/user").send({
      name: "John Doe",
      dateOfBirth: "1990-01-01",
      email: "johndoe@gmail.com",
      phoneNumber: "1234567890",
    });
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual("John Doe");
  });
  test("check wether a created user can be recieved back", async () => {
    await agent.post("/user").send({
      name: "James Doe",
      dateOfBirth: "1990-01-01",
      email: "johndoe@gmail.com",
      phoneNumber: "1234567890",
    });
    const getUsers = await agent.get("/submittedForms");
    expect(getUsers.status).toEqual(200);
    const parsedResponse = JSON.parse(getUsers.text);
    const getLatestUserName = parsedResponse[parsedResponse.length - 1].name;
    expect(getLatestUserName).toEqual("James Doe");
  });
});
