const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const supertest = require("supertest");
const app = require("../app");

const mock = new MockAdapter(axios);

const fakeUser = [{
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  email: "string",
  firstName: "string",
  lastName: "string",
  rol: "string",
  location: "string",
  interests: [
    "string",
  ],
  profilePictureUrl: "string",
  subscription: "string",
  subscriptionExpirationDate: "2021-11-17T00:21:26.828Z",
  favoriteCourses: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
  description: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
}];

const newFakeUser = [{
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  email: "newemail@test.com",
  firstName: "newName",
  lastName: "newLastName",
  rol: "string",
  location: "string",
  interests: [
    "string",
  ],
  profilePictureUrl: "string",
  subscription: "string",
  subscriptionExpirationDate: "2021-11-17T00:21:26.828Z",
  favoriteCourses: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
  description: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
}];

const courses = [
  {
    course_id: "7134f2d4-f607-4f4a-b902-9a71b6f71dfd",
    user_type: "student",
    progress: 0,
    aprobal_state: false,
  },
  {
    course_id: "09244783-f0d2-400e-9d16-e9cfbc6e7fd9",
    user_type: "student",
    progress: 0,
    aprobal_state: false,
  },
  {
    course_id: "09244783-f0d2-400e-9d16-e9cfbc6e7fd9",
    user_type: "student",
    progress: 0,
    aprobal_state: false,
  },
];

const userNotFoundResponse = { response: { status: 404, data: "User not found" } };

const request = supertest(app);

describe("usersController", () => {
  test("valid user id should return success code 200 and user information", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${fakeUser.id}`).reply(200, fakeUser);
    await request.get(`/users/${fakeUser.id}`).set("authorization", "ABCTEST").expect(200, fakeUser);
  });

  test("invalid user id should return user not found code 404", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/23432432`).reply(404, userNotFoundResponse);
    await request.get("/users/23432432").set("authorization", "ABCTEST").expect(404, userNotFoundResponse);
  });

  test("unexpected error getting user should return code 500", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${fakeUser.id}`).reply(500);
    await request.get(`/users/${fakeUser.id}`).set("authorization", "ABCTEST").expect(500);
  });

  test("missing token getting user should return code 401", async () => {
    await request.get(`/users/${fakeUser.id}`).expect(401);
  });

  test("valid user id should return success code 200 and new user information", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onPatch(`${process.env.USERS_SERVICE_URL}/users/${fakeUser.id}`).reply(200, newFakeUser);
    await request.patch(`/users/${fakeUser.id}`).set("authorization", "ABCTEST").expect(200, newFakeUser);
  });

  test("invalid user id should return user not found code 404", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onPatch(`${process.env.USERS_SERVICE_URL}/users/23432432`).reply(404, userNotFoundResponse);
    await request.patch("/users/23432432").set("authorization", "ABCTEST").expect(404, userNotFoundResponse);
  });

  test("unexpected error getting user should return code 500", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onPatch(`${process.env.USERS_SERVICE_URL}/users/${fakeUser.id}`).reply(500);
    await request.patch(`/users/${fakeUser.id}`).set("authorization", "ABCTEST").expect(500);
  });

  test("get courses returns all courses when valid user_id", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/user/${fakeUser.id}`).reply(200, courses);
    await request.get(`/users/${fakeUser.id}/courses`).set("authorization", "ABCTEST").expect(200, courses);
  });

  test("invalid user id should return user not found code 404 when getting courses", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/user/23432432`).reply(404, userNotFoundResponse);
    await request.get("/users/23432432/courses").set("authorization", "ABCTEST").expect(404, userNotFoundResponse);
  });

  test("unexpected error getting courses should return code 500", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/user/${fakeUser.id}`).reply(500);
    await request.get(`/users/${fakeUser.id}/courses`).set("authorization", "ABCTEST").expect(500);
  });
});
