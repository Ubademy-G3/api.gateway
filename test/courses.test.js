const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const supertest = require("supertest");
const app = require("../app");

const mock = new MockAdapter(axios);
const request = supertest(app);

const fakeCourse = {
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  name: "string",
  description: "string",
  category: 0,
  subscription_type: "string",
  location: "string",
  profile_picture: "string",
};

const freeCourse = {
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  name: "string",
  description: "string",
  category: 0,
  subscription_type: "free",
  location: "string",
  profile_picture: "string",
};
const goldCourse = {
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  name: "string",
  description: "string",
  category: 0,
  subscription_type: "gold",
  location: "string",
  profile_picture: "string",
};
const premiumCourse = {
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  name: "string",
  description: "string",
  category: 0,
  subscription_type: "premium",
  location: "string",
  profile_picture: "string",
};

const freeUser = {
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
  subscription: "Free",
  subscriptionExpirationDate: "2021-11-17T00:21:26.828Z",
  favoriteCourses: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
  description: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
};
const goldUser = {
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
  subscription: "Gold",
  subscriptionExpirationDate: "2021-11-17T00:21:26.828Z",
  favoriteCourses: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
  description: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
};
const premiumUser = {
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
  subscription: "Premium",
  subscriptionExpirationDate: "2021-11-17T00:21:26.828Z",
  favoriteCourses: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
  description: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
};

const fakeInvalidCourse = {
  description: "someDescription",
};
const badRequestResponse = { response: { status: 400, data: "Bad request" } };

describe("courses routes", () => {
  test("valid course on creation should return success code 200 and course information", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses`, fakeCourse).reply(200, fakeCourse);
    await request.post("/courses").send(fakeCourse).set("authorization", "ABCTEST").expect(200, fakeCourse);
  });
  test("incomplete course should return bad request code 400", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses`, fakeInvalidCourse).reply(400, badRequestResponse);
    await request.post("/courses").send(fakeInvalidCourse).set("authorization", "ABCTEST").expect(400, badRequestResponse);
  });
  test("unexpected error getting user should return code 500", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses`).reply(500);
    await request.post("/courses").set("authorization", "ABCTEST").expect(500);
  });
});

describe("user courses routes", () => {
  test("free user enrolls to free course returns 200", async () => {
    const userCourse = {
      user_id: freeUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${freeUser.id}`).reply(200, freeUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${freeCourse.id}`).reply(200, freeCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${freeCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${freeCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(200, userCourse);
  });
  test("free user enrolls to gold course returns 403", async () => {
    const userCourse = {
      user_id: freeUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${freeUser.id}`).reply(200, freeUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${goldCourse.id}`).reply(200, goldCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${goldCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${goldCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(403, { message: "Can't subscribe user with subscription type Free to gold course" });
  });
  test("free user enrolls to premium course returns 403", async () => {
    const userCourse = {
      user_id: freeUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${freeUser.id}`).reply(200, freeUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${premiumCourse.id}`).reply(200, premiumCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${premiumCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${premiumCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(403, { message: "Can't subscribe user with subscription type Free to premium course" });
  });
  test("gold user enrolls to free course returns 200", async () => {
    const userCourse = {
      user_id: goldUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${goldUser.id}`).reply(200, goldUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${freeCourse.id}`).reply(200, freeCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${freeCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${freeCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(200, userCourse);
  });
  test("gold user enrolls to gold course returns 200", async () => {
    const userCourse = {
      user_id: goldUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${goldUser.id}`).reply(200, goldUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${goldCourse.id}`).reply(200, goldCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${goldCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${goldCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(200, userCourse);
  });
  test("gold user enrolls to premium course returns 403", async () => {
    const userCourse = {
      user_id: goldUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${goldUser.id}`).reply(200, goldUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${premiumCourse.id}`).reply(200, premiumCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${premiumCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${premiumCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(403, { message: "Can't subscribe user with subscription type Gold to premium course" });
  });
  test("premium user enrolls to free course returns 200", async () => {
    const userCourse = {
      user_id: premiumUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${premiumUser.id}`).reply(200, premiumUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${freeCourse.id}`).reply(200, freeCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${freeCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${freeCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(200, userCourse);
  });
  test("premium user enrolls to gold course returns 200", async () => {
    const userCourse = {
      user_id: premiumUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${premiumUser.id}`).reply(200, premiumUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${goldCourse.id}`).reply(200, freeCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${goldCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${goldCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(200, userCourse);
  });
  test("premium user enrolls to premium course returns 200", async () => {
    const userCourse = {
      user_id: premiumUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${premiumUser.id}`).reply(200, premiumUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${premiumCourse.id}`).reply(200, premiumCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${premiumCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${premiumCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(200, userCourse);
  });
});
