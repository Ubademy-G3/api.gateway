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

const exams = {
  amount: 0,
  creator_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  exam_templates: [
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      course_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      name: "string",
      state: "string",
      max_score: 0,
      has_multiple_choice: true,
      has_written: true,
      has_media: true
    }
  ]
}

const solvedExams = {
  user_id: "15ffbbce-4bf9-11ec-81d3-0242ac130003",
  amount: 1,
  amount_graded: 1,
  average_score: 8,
  approval_rate: 1,
  exam_solutions: [
    {
      id: "c403f182-4bf8-11ec-81d3-0242ac130003",
      course_id: "378f684b-69e2-4ad2-9d23-b64f971cf875",
      user_id: "15ffbbce-4bf9-11ec-81d3-0242ac130003",
      exam_template_id: "3b71b977-97c0-4662-aaab-38978786bc7f",
      corrector_id: "2979a282-4bf9-11ec-81d3-0242ac130003",
      graded: true,
      score: 8,
      max_score: 10,
      approval_state: true
    }
  ]
}

const userNotFoundResponse = { response: { status: 404, data: "User not found" } };

const request = supertest(app);

describe("usersController", () => {
  test("valid user id should return success code 200 and user information", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${fakeUser.id}`).reply(200, fakeUser);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/users`).reply(200, { state: "active", apikey: "asd" });
    await request.get(`/users/${fakeUser.id}`).set("authorization", "ABCTEST").expect(200, fakeUser);
  });

  test("invalid user id should return user not found code 404", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/23432432`).reply(404, userNotFoundResponse);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/users`).reply(200, { state: "active", apikey: "asd" });
    await request.get("/users/23432432").set("authorization", "ABCTEST").expect(404, userNotFoundResponse);
  });

  test("unexpected error getting user should return code 500", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${fakeUser.id}`).reply(500);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/users`).reply(200, { state: "active", apikey: "asd" });
    await request.get(`/users/${fakeUser.id}`).set("authorization", "ABCTEST").expect(500);
  });

  test("missing token getting user should return code 401", async () => {
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/users`).reply(200, { state: "active", apikey: "asd" });
    await request.get(`/users/${fakeUser.id}`).expect(401);
  });

  test("valid user id should return success code 200 and new user information", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onPatch(`${process.env.USERS_SERVICE_URL}/users/${fakeUser.id}`).reply(200, newFakeUser);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/users`).reply(200, { state: "active", apikey: "asd" });
    await request.patch(`/users/${fakeUser.id}`).set("authorization", "ABCTEST").expect(200, newFakeUser);
  });

  test("invalid user id should return user not found code 404", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onPatch(`${process.env.USERS_SERVICE_URL}/users/23432432`).reply(404, userNotFoundResponse);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/users`).reply(200, { state: "active", apikey: "asd" });
    await request.patch("/users/23432432").set("authorization", "ABCTEST").expect(404, userNotFoundResponse);
  });

  test("unexpected error getting user should return code 500", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onPatch(`${process.env.USERS_SERVICE_URL}/users/${fakeUser.id}`).reply(500);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/users`).reply(200, { state: "active", apikey: "asd" });
    await request.patch(`/users/${fakeUser.id}`).set("authorization", "ABCTEST").expect(500);
  });

  test("get courses returns all courses when valid user_id", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/user/${fakeUser.id}`).reply(200, courses);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/users`).reply(200, { state: "active", apikey: "asd" });
    await request.get(`/users/${fakeUser.id}/courses`).set("authorization", "ABCTEST").expect(200, courses);
  });

  test("invalid user id should return user not found code 404 when getting courses", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/user/23432432`).reply(404, userNotFoundResponse);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/users`).reply(200, { state: "active", apikey: "asd" });
    await request.get("/users/23432432/courses").set("authorization", "ABCTEST").expect(404, userNotFoundResponse);
  });

  test("unexpected error getting courses should return code 500", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/user/${fakeUser.id}`).reply(500);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/users`).reply(200, { state: "active", apikey: "asd" });
    await request.get(`/users/${fakeUser.id}/courses`).set("authorization", "ABCTEST").expect(500);
  });

  test("get exams returns all exams when valid user_id", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.EXAMS_SERVICE_URL}/exams/creator/${fakeUser.id}`).reply(200, exams);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/users`).reply(200, { state: "active", apikey: "asd" });
    await request.get(`/users/${fakeUser.id}/exams`).set("authorization", "ABCTEST").expect(200, exams);
  });

  test("invalid user id should return user not found code 404 when getting exams", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.EXAMS_SERVICE_URL}/exams/creator/23432432`).reply(404, userNotFoundResponse);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/users`).reply(200, { state: "active", apikey: "asd" });
    await request.get("/users/23432432/exams").set("authorization", "ABCTEST").expect(404, userNotFoundResponse);
  });

  test("unexpected error getting exams should return code 500", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.EXAMS_SERVICE_URL}/exams/creator/${fakeUser.id}`).reply(500);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/users`).reply(200, { state: "active", apikey: "asd" });
    await request.get(`/users/${fakeUser.id}/exams`).set("authorization", "ABCTEST").expect(500);
  });

  test("get solved exams returns all exams when valid user_id", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.EXAMS_SERVICE_URL}/exams/solutions/user/${fakeUser.id}`).reply(200, solvedExams);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/users`).reply(200, { state: "active", apikey: "asd" });
    await request.get(`/users/${fakeUser.id}/solved-exams?user_type=user`).set("authorization", "ABCTEST").expect(200, solvedExams);
  });

  test("invalid user id should return user not found code 404 when getting solved exams", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.EXAMS_SERVICE_URL}/exams/solutions/user/23432432`).reply(404, userNotFoundResponse);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/users`).reply(200, { state: "active", apikey: "asd" });
    await request.get("/users/23432432/solved-exams?user_type=user").set("authorization", "ABCTEST").expect(404, userNotFoundResponse);
  });

  test("unexpected error getting solved exams should return code 500", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.EXAMS_SERVICE_URL}/exams/solutions/user/${fakeUser.id}`).reply(500);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/users`).reply(200, { state: "active", apikey: "asd" });
    await request.get(`/users/${fakeUser.id}/solved-exams?user_type=user`).set("authorization", "ABCTEST").expect(500);
  });

  test("bad request error if missing user_type when getting solved exams", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/users`).reply(200, { state: "active", apikey: "asd" });
    await request.get(`/users/${fakeUser.id}/solved-exams`).set("authorization", "ABCTEST").expect(400, { message: "Missing 'user_type' field" });
  });
});
