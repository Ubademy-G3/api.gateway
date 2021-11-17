// const axios = require("axios");
// const MockAdapter = require("axios-mock-adapter");
// const supertest = require("supertest");
// const app = require("../app");

// const mock = new MockAdapter(axios);
// request = supertest(app);

// const fakeCourse = {
//     id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//     name: "string",
//     description: "string",
//     category: 0,
//     kind: "string",
//     subscription_type: "string",
//     location: "string",
//     info: {},
//     profile_picture: "string"
//   }

//   const fakeInvalidCourse = {
//     description: "someDescription",
//   };
//   const badRequestResponse = { response: { status: 400, data: "Bad request" } };

// describe("coursesController", () => {
//     test("valid course on creation should return success code 200 and course information", async () => {
//         mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
//         mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses`, fakeCourse).reply(200, fakeCourse);
//         await request.post(`/courses`).send(fakeCourse).set("authorization", "ABCTEST").expect(200, fakeCourse);
//       });
//       test("incomplete course should return bad request code 400", async () => {
//         mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
//         mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses`, fakeInvalidCourse).reply(400, badRequestResponse);
//         await request.post(`/courses`).send(fakeInvalidCourse).set("authorization", "ABCTEST").expect(400, badRequestResponse);
//       });
//       test("unexpected error getting user should return code 500", async () => {
//         mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
//         mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses`).reply(500);
//         await request.post(`/courses`).set("authorization", "ABCTEST").expect(500);
//       });
// });
